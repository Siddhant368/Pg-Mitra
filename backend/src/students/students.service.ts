import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Student,
  StudentDocumentType,
  RentStatus,
  VerificationStatus,
  AccountStatus,
} from './schemas/student.schema.js';
import { Bed, BedDocument, BedStatus } from '../rooms/schemas/bed.schema.js';
import { Room, RoomDocument } from '../rooms/schemas/room.schema.js';
import { Pg, PgDocument } from '../pgs/schemas/pg.schema.js';
import { CreateStudentDto } from './dto/create-student.dto.js';
import { UpdateStudentDto } from './dto/update-student.dto.js';
import { StudentQueryDto } from './dto/student-query.dto.js';
import { RecordRentDto } from './dto/record-rent.dto.js';
import { TransferRoomDto } from './dto/transfer-room.dto.js';
import { AddAdminNoteDto } from './dto/admin-note.dto.js';
import { SendNotificationDto } from './dto/send-notification.dto.js';

@Injectable()
export class StudentsService {
  private readonly logger = new Logger(StudentsService.name);

  constructor(
    @InjectModel(Student.name)
    private readonly studentModel: Model<StudentDocumentType>,
    @InjectModel(Bed.name)
    private readonly bedModel: Model<BedDocument>,
    @InjectModel(Room.name)
    private readonly roomModel: Model<RoomDocument>,
    @InjectModel(Pg.name)
    private readonly pgModel: Model<PgDocument>,
  ) {}

  /**
   * Format single student response object for client
   */
  formatStudent(doc: any) {
    if (!doc) return null;
    const obj = doc.toJSON ? doc.toJSON() : { ...doc };
    const id = obj._id ? obj._id.toString() : obj.id;
    return {
      ...obj,
      id,
      _id: id,
    };
  }

  /**
   * Helper: Generate next unique Student ID in format PGM-YYYY-XXXX
   */
  async generateNextStudentId(ownerId: string): Promise<string> {
    const currentYear = new Date().getFullYear();
    const count = await this.studentModel
      .countDocuments({ ownerId: new Types.ObjectId(ownerId) })
      .exec();
    const baseNumber = count + 101;
    let candidate = `PGM-${currentYear}-${String(baseNumber).padStart(4, '0')}`;
    let exists = await this.studentModel.findOne({ studentId: candidate }).exec();
    let offset = 1;
    while (exists) {
      candidate = `PGM-${currentYear}-${String(baseNumber + offset).padStart(4, '0')}`;
      exists = await this.studentModel.findOne({ studentId: candidate }).exec();
      offset++;
    }
    return candidate;
  }

  /**
   * Bed Sync Helper: Link student to room/bed and mark bed occupied
   */
  private async syncBedAssignment(
    studentIdObj: Types.ObjectId,
    studentName: string,
    studentPhone: string,
    pgIdStr?: string,
    roomNumberStr?: string,
    bedNumberStr?: string,
    monthlyRent?: number,
  ): Promise<{ roomId: string; bedId: string } | null> {
    if (!pgIdStr || !roomNumberStr || !bedNumberStr) return null;

    try {
      const roomQuery: any = { roomNumber: roomNumberStr };
      if (Types.ObjectId.isValid(pgIdStr)) {
        roomQuery.pgId = new Types.ObjectId(pgIdStr);
      }
      const room = await this.roomModel.findOne(roomQuery).exec();
      if (!room) return null;

      const numericMatch = bedNumberStr.match(/\d+/);
      const bedNum = numericMatch ? parseInt(numericMatch[0], 10) : undefined;

      const bedQuery: any = { roomId: room._id };
      if (bedNum !== undefined) {
        bedQuery.$or = [{ bedNumber: bedNum }, { label: bedNumberStr }];
      } else {
        bedQuery.label = bedNumberStr;
      }

      const bed = await this.bedModel.findOne(bedQuery).exec();
      if (bed) {
        bed.status = BedStatus.OCCUPIED;
        bed.isOccupied = true;
        bed.tenantId = studentIdObj;
        bed.tenantName = studentName;
        bed.tenantPhone = studentPhone;
        if (monthlyRent !== undefined) {
          bed.monthlyRent = monthlyRent;
        }
        await bed.save();
        return {
          roomId: room._id.toString(),
          bedId: bed._id.toString(),
        };
      }
    } catch (err: any) {
      this.logger.warn(`Could not sync bed assignment: ${err.message}`);
    }
    return null;
  }

  /**
   * Bed Sync Helper: Free up any bed assigned to this student
   */
  private async releaseBedAssignment(studentIdObj: Types.ObjectId): Promise<void> {
    try {
      const beds = await this.bedModel.find({ tenantId: studentIdObj }).exec();
      for (const bed of beds) {
        bed.status = BedStatus.AVAILABLE;
        bed.isOccupied = false;
        bed.tenantId = undefined as any;
        bed.tenantName = undefined as any;
        bed.tenantPhone = undefined as any;
        await bed.save();
      }
    } catch (err: any) {
      this.logger.warn(`Could not release bed assignment: ${err.message}`);
    }
  }

  /**
   * Get all students for the authenticated owner
   */
  async findAll(ownerId: string, query: StudentQueryDto = {}): Promise<any[]> {
    const filter: any = { ownerId: new Types.ObjectId(ownerId) };

    if (query.pgId) {
      filter['accommodation.pgId'] = query.pgId;
    }
    if (query.rentStatus) {
      filter.rentStatus = query.rentStatus;
    }
    if (query.verificationStatus) {
      filter.verificationStatus = query.verificationStatus;
    }
    if (query.accountStatus) {
      filter.accountStatus = query.accountStatus;
    }

    if (query.quickFilter) {
      const now = Date.now();
      if (query.quickFilter === 'RENT_OVERDUE') {
        filter.rentStatus = RentStatus.OVERDUE;
      } else if (query.quickFilter === 'DOCS_PENDING') {
        filter.verificationStatus = VerificationStatus.PENDING;
      } else if (query.quickFilter === 'LEAVING_SOON') {
        filter.accountStatus = AccountStatus.NOTICE;
      } else if (query.quickFilter === 'THIS_MONTH') {
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        filter.createdAt = { $gte: startOfMonth };
      } else if (query.quickFilter === 'LAST_30_DAYS') {
        const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
        filter.createdAt = { $gte: thirtyDaysAgo };
      }
    }

    if (query.search && query.search.trim()) {
      const regex = new RegExp(query.search.trim(), 'i');
      filter.$or = [
        { name: regex },
        { studentId: regex },
        { phone: regex },
        { email: regex },
        { 'accommodation.roomNumber': regex },
        { 'accommodation.pgName': regex },
      ];
    }

    let sort: any = { createdAt: -1 };
    if (query.sortField) {
      const order = query.sortOrder === 'asc' ? 1 : -1;
      if (query.sortField === 'joiningDate') {
        sort = { 'accommodation.joiningDate': order, createdAt: -1 };
      } else {
        sort = { [query.sortField]: order };
      }
    }

    let q = this.studentModel.find(filter).sort(sort);
    if (query.page && query.limit) {
      const skip = (query.page - 1) * query.limit;
      q = q.skip(skip).limit(query.limit);
    }

    const docs = await q.exec();
    return docs.map((d) => this.formatStudent(d));
  }

  /**
   * Find single student by ID or studentId
   */
  async findOne(idOrStudentId: string, ownerId: string): Promise<StudentDocumentType> {
    const ownerObjectId = new Types.ObjectId(ownerId);
    const query: any = { ownerId: ownerObjectId };

    if (Types.ObjectId.isValid(idOrStudentId)) {
      query.$or = [
        { _id: new Types.ObjectId(idOrStudentId) },
        { studentId: idOrStudentId },
        { id: idOrStudentId },
      ];
    } else {
      query.$or = [
        { studentId: idOrStudentId },
        { id: idOrStudentId },
      ];
    }

    const student = await this.studentModel.findOne(query).exec();
    if (!student) {
      throw new NotFoundException(`Student '${idOrStudentId}' not found or access denied`);
    }
    return student;
  }

  /**
   * Get Student Dashboard Analytics & Aggregated Stats
   */
  async getStats(ownerId: string): Promise<any> {
    const ownerObjectId = new Types.ObjectId(ownerId);
    const students = await this.studentModel.find({ ownerId: ownerObjectId }).exec();

    const totalStudents = students.length;
    const activeStudents = students.filter(
      (s) => s.accountStatus === AccountStatus.ACTIVE || s.accountStatus === AccountStatus.NOTICE,
    ).length;

    const pendingVerification = students.filter(
      (s) => s.verificationStatus === VerificationStatus.PENDING,
    ).length;

    const pendingRentList = students.filter(
      (s) =>
        s.rentStatus === RentStatus.OVERDUE ||
        s.rentStatus === RentStatus.PENDING ||
        s.rentStatus === RentStatus.PARTIAL,
    );
    const pendingRentCount = pendingRentList.length;
    const pendingRentAmount = pendingRentList.reduce(
      (acc, s) => acc + (s.rentDueAmount || 0),
      0,
    );

    const vacantBeds = await this.bedModel
      .countDocuments({
        ownerId: ownerObjectId,
        status: { $in: [BedStatus.AVAILABLE, BedStatus.VACANT] },
      })
      .exec();

    const now = Date.now();
    const studentsLeavingSoon = students.filter((s) => {
      if (s.accountStatus === AccountStatus.NOTICE) return true;
      if (s.accommodation?.expectedLeavingDate) {
        try {
          const diffDays =
            (new Date(s.accommodation.expectedLeavingDate).getTime() - now) /
            (1000 * 60 * 60 * 24);
          return diffDays >= 0 && diffDays <= 20;
        } catch {
          return false;
        }
      }
      return false;
    }).length;

    const totalMonthlyCollection = students
      .filter((s) => s.rentStatus === RentStatus.PAID)
      .reduce((acc, s) => acc + (s.accommodation?.monthlyRent || 0), 0);

    return {
      totalStudents,
      activeStudents,
      pendingVerification,
      pendingRentCount,
      pendingRentAmount,
      vacantRoomRequests: vacantBeds,
      studentsLeavingSoon,
      totalMonthlyCollection,
    };
  }

  /**
   * Create / Admit a new student
   */
  async create(ownerId: string, dto: CreateStudentDto): Promise<any> {
    const ownerObjectId = new Types.ObjectId(ownerId);
    const studentId = dto.studentId || (await this.generateNextStudentId(ownerId));

    const monthlyRent = dto.accommodation?.monthlyRent || 0;
    const rentDueAmount =
      dto.rentDueAmount !== undefined
        ? dto.rentDueAmount
        : dto.rentStatus === RentStatus.PAID
        ? 0
        : monthlyRent;

    const timeline =
      dto.timeline && dto.timeline.length > 0
        ? dto.timeline
        : [
            {
              id: 'tl-' + Date.now(),
              title: 'Student Admission Registered',
              description: `${dto.name} registered with ID ${studentId}`,
              timestamp: new Date().toISOString(),
              type: 'ADMISSION',
              actor: 'Admin',
            },
          ];

    const student = new this.studentModel({
      ...dto,
      ownerId: ownerObjectId,
      studentId,
      rentDueAmount,
      rentStatus: dto.rentStatus || (rentDueAmount > 0 ? RentStatus.PENDING : RentStatus.PAID),
      verificationStatus: dto.verificationStatus || VerificationStatus.PENDING,
      accountStatus: dto.accountStatus || AccountStatus.ACTIVE,
      timeline,
      attendance: dto.attendance || {
        monthlyPercentage: 100,
        presentDays: 30,
        totalDays: 30,
        records: [],
      },
      documents: dto.documents || [],
      rentHistory: dto.rentHistory || [],
      complaints: dto.complaints || [],
      adminNotes: dto.adminNotes || [],
    });

    const saved = await student.save();

    // Link bed if room & bed are specified
    if (dto.accommodation?.roomNumber && dto.accommodation?.bedNumber) {
      const syncResult = await this.syncBedAssignment(
        saved._id as Types.ObjectId,
        saved.name,
        saved.phone,
        dto.accommodation.pgId,
        dto.accommodation.roomNumber,
        dto.accommodation.bedNumber,
        dto.accommodation.monthlyRent,
      );
      if (syncResult) {
        saved.accommodation.roomId = syncResult.roomId;
        saved.accommodation.bedId = syncResult.bedId;
        saved.markModified('accommodation');
        await saved.save();
      }
    }

    return this.formatStudent(saved);
  }

  /**
   * Update student profile
   */
  async update(idOrStudentId: string, ownerId: string, dto: UpdateStudentDto): Promise<any> {
    const student = await this.findOne(idOrStudentId, ownerId);

    // Omit read-only fields
    const { id, _id, createdAt, updatedAt, ...rest } = dto as any;

    Object.assign(student, rest);

    // Sync bed tenant info if name or phone changed
    if (rest.name || rest.phone) {
      await this.bedModel.updateMany(
        { tenantId: student._id },
        {
          ...(rest.name ? { tenantName: rest.name } : {}),
          ...(rest.phone ? { tenantPhone: rest.phone } : {}),
        },
      );
    }

    await student.save();
    return this.formatStudent(student);
  }

  /**
   * Transfer room / assign accommodation
   */
  async transferRoom(idOrStudentId: string, ownerId: string, dto: TransferRoomDto): Promise<any> {
    const student = await this.findOne(idOrStudentId, ownerId);
    const oldPg = student.accommodation?.pgName || 'Previous PG';
    const oldRoom = student.accommodation?.roomNumber || 'Unknown Room';

    // Release old bed
    await this.releaseBedAssignment(student._id as Types.ObjectId);

    // Assign new bed
    const syncResult = await this.syncBedAssignment(
      student._id as Types.ObjectId,
      student.name,
      student.phone,
      dto.pgId,
      dto.roomNumber,
      dto.bedNumber,
      dto.newRent || student.accommodation?.monthlyRent,
    );

    student.accommodation = {
      ...student.accommodation,
      pgId: dto.pgId,
      pgName: dto.pgName,
      roomNumber: dto.roomNumber,
      bedNumber: dto.bedNumber,
      building: dto.building || student.accommodation?.building,
      floor: dto.floor || student.accommodation?.floor,
      monthlyRent: dto.newRent !== undefined ? dto.newRent : student.accommodation?.monthlyRent,
      roomId: syncResult?.roomId,
      bedId: syncResult?.bedId,
    };

    student.timeline.unshift({
      id: 'tl-' + Date.now(),
      title: 'Room Transfer Completed',
      description: `Transferred from ${oldPg} (Room ${oldRoom}) to ${dto.pgName} (Room ${dto.roomNumber} - ${dto.bedNumber})`,
      timestamp: new Date().toISOString(),
      type: 'ROOM_CHANGE',
      actor: 'Admin',
    });

    student.markModified('accommodation');
    student.markModified('timeline');
    await student.save();
    return this.formatStudent(student);
  }

  /**
   * Record rent payment
   */
  async recordRentPayment(idOrStudentId: string, ownerId: string, dto: RecordRentDto): Promise<any> {
    const student = await this.findOne(idOrStudentId, ownerId);
    const receiptNumber = dto.receiptNumber || 'REC-' + Date.now().toString().slice(-6);
    const monthlyRent = student.accommodation?.monthlyRent || 0;
    const currentDue =
      student.rentDueAmount !== undefined ? student.rentDueAmount : monthlyRent;
    const isFull = dto.amount >= currentDue || dto.amount >= monthlyRent;

    const newRecord = {
      id: 'rent-' + Date.now(),
      month: dto.month,
      year: dto.year || new Date().getFullYear(),
      amount: dto.amount,
      dueDate: dto.dueDate || student.nextRentDueDate || new Date().toISOString().split('T')[0],
      paidDate: dto.paidDate || new Date().toISOString().split('T')[0],
      paymentMethod: dto.paymentMethod,
      transactionId: dto.transactionId,
      status: isFull ? RentStatus.PAID : RentStatus.PARTIAL,
      receiptNumber,
      collectedBy: dto.collectedBy || 'Admin',
      notes: dto.notes,
    };

    const newDue = Math.max(0, currentDue - dto.amount);
    const newStatus = newDue === 0 ? RentStatus.PAID : RentStatus.PARTIAL;

    student.rentStatus = newStatus;
    student.rentDueAmount = newDue;
    student.rentHistory.unshift(newRecord);
    student.timeline.unshift({
      id: 'tl-' + Date.now(),
      title: 'Rent Payment Received',
      description: `₹${dto.amount.toLocaleString('en-IN')} collected for ${dto.month} via ${dto.paymentMethod} (${receiptNumber})`,
      timestamp: new Date().toISOString(),
      type: 'PAYMENT',
      actor: 'Admin',
    });

    student.markModified('rentHistory');
    student.markModified('timeline');
    await student.save();
    return this.formatStudent(student);
  }

  /**
   * Approve a student document
   */
  async approveDocument(idOrStudentId: string, ownerId: string, docId: string): Promise<any> {
    const student = await this.findOne(idOrStudentId, ownerId);
    const doc = student.documents.find((d: any) => d.id === docId || d._id?.toString() === docId);
    if (!doc) {
      throw new NotFoundException('Document not found');
    }

    doc.status = VerificationStatus.VERIFIED;
    delete doc.rejectionReason;

    const allVerified = student.documents.every(
      (d: any) => d.status === VerificationStatus.VERIFIED,
    );
    if (allVerified) {
      student.verificationStatus = VerificationStatus.VERIFIED;
    }

    student.timeline.unshift({
      id: 'tl-' + Date.now(),
      title: 'Document Verified',
      description: `${doc.title || 'Identity document'} verified by Admin`,
      timestamp: new Date().toISOString(),
      type: 'VERIFICATION',
      actor: 'Admin',
    });

    student.markModified('documents');
    student.markModified('timeline');
    await student.save();
    return this.formatStudent(student);
  }

  /**
   * Reject a student document with reason
   */
  async rejectDocument(
    idOrStudentId: string,
    ownerId: string,
    docId: string,
    reason: string,
  ): Promise<any> {
    const student = await this.findOne(idOrStudentId, ownerId);
    const doc = student.documents.find((d: any) => d.id === docId || d._id?.toString() === docId);
    if (!doc) {
      throw new NotFoundException('Document not found');
    }

    doc.status = VerificationStatus.REJECTED;
    doc.rejectionReason = reason;
    student.verificationStatus = VerificationStatus.REJECTED;

    student.timeline.unshift({
      id: 'tl-' + Date.now(),
      title: 'Document Verification Rejected',
      description: `Reason: ${reason}`,
      timestamp: new Date().toISOString(),
      type: 'VERIFICATION',
      actor: 'Admin',
    });

    student.markModified('documents');
    student.markModified('timeline');
    await student.save();
    return this.formatStudent(student);
  }

  /**
   * Add internal administrative note
   */
  async addNote(idOrStudentId: string, ownerId: string, dto: AddAdminNoteDto): Promise<any> {
    const student = await this.findOne(idOrStudentId, ownerId);
    const newNote = {
      id: 'note-' + Date.now(),
      content: dto.content,
      createdAt: new Date().toISOString().split('T')[0],
      author: dto.author || 'Admin',
      priority: dto.priority || 'NORMAL',
    };

    student.adminNotes.unshift(newNote);
    student.markModified('adminNotes');
    await student.save();
    return this.formatStudent(student);
  }

  /**
   * Delete administrative note
   */
  async deleteNote(idOrStudentId: string, ownerId: string, noteId: string): Promise<any> {
    const student = await this.findOne(idOrStudentId, ownerId);
    student.adminNotes = student.adminNotes.filter((n: any) => n.id !== noteId);
    student.markModified('adminNotes');
    await student.save();
    return this.formatStudent(student);
  }

  /**
   * Send notification to student & log activity
   */
  async sendNotification(
    idOrStudentId: string,
    ownerId: string,
    dto: SendNotificationDto,
  ): Promise<any> {
    const student = await this.findOne(idOrStudentId, ownerId);
    student.timeline.unshift({
      id: 'tl-' + Date.now(),
      title: `${dto.channel} Notification Dispatched`,
      description: `Message: "${dto.message.slice(0, 70)}..."`,
      timestamp: new Date().toISOString(),
      type: 'NOTICE',
      actor: 'Admin',
    });
    student.markModified('timeline');
    await student.save();
    return this.formatStudent(student);
  }

  /**
   * Update student account status
   */
  async updateStatus(
    idOrStudentId: string,
    ownerId: string,
    accountStatus: string,
  ): Promise<any> {
    const student = await this.findOne(idOrStudentId, ownerId);
    student.accountStatus = accountStatus as AccountStatus;

    if (accountStatus === AccountStatus.CHECKED_OUT) {
      await this.releaseBedAssignment(student._id as Types.ObjectId);
    }

    student.timeline.unshift({
      id: 'tl-' + Date.now(),
      title: 'Account Status Updated',
      description: `Student account status marked as ${accountStatus}`,
      timestamp: new Date().toISOString(),
      type: 'GENERAL',
      actor: 'Admin',
    });

    student.markModified('timeline');
    await student.save();
    return this.formatStudent(student);
  }

  /**
   * Delete single student
   */
  async remove(idOrStudentId: string, ownerId: string): Promise<{ success: boolean; message: string }> {
    const student = await this.findOne(idOrStudentId, ownerId);
    await this.releaseBedAssignment(student._id as Types.ObjectId);
    await this.studentModel.deleteOne({ _id: student._id }).exec();
    return { success: true, message: `Student ${student.name} deleted successfully` };
  }

  /**
   * Bulk approve verification documents
   */
  async bulkApproveDocs(ownerId: string, studentIds: string[]): Promise<any> {
    const ownerObjectId = new Types.ObjectId(ownerId);
    const objectIds = studentIds
      .filter((id) => Types.ObjectId.isValid(id))
      .map((id) => new Types.ObjectId(id));

    const students = await this.studentModel
      .find({
        ownerId: ownerObjectId,
        $or: [
          { _id: { $in: objectIds } },
          { studentId: { $in: studentIds } },
          { id: { $in: studentIds } },
        ],
      })
      .exec();

    for (const student of students) {
      student.verificationStatus = VerificationStatus.VERIFIED;
      student.documents = (student.documents || []).map((d: any) => ({
        ...d,
        status: VerificationStatus.VERIFIED,
      }));
      student.markModified('documents');
      await student.save();
    }

    return { success: true, count: students.length };
  }

  /**
   * Bulk update status (Activate / Deactivate)
   */
  async bulkUpdateStatus(ownerId: string, studentIds: string[], status: string): Promise<any> {
    const ownerObjectId = new Types.ObjectId(ownerId);
    const objectIds = studentIds
      .filter((id) => Types.ObjectId.isValid(id))
      .map((id) => new Types.ObjectId(id));

    const students = await this.studentModel
      .find({
        ownerId: ownerObjectId,
        $or: [
          { _id: { $in: objectIds } },
          { studentId: { $in: studentIds } },
          { id: { $in: studentIds } },
        ],
      })
      .exec();

    for (const student of students) {
      student.accountStatus = status as AccountStatus;
      if (status === AccountStatus.CHECKED_OUT) {
        await this.releaseBedAssignment(student._id as Types.ObjectId);
      }
      await student.save();
    }

    return { success: true, count: students.length };
  }

  /**
   * Bulk delete students
   */
  async bulkDelete(ownerId: string, studentIds: string[]): Promise<any> {
    const ownerObjectId = new Types.ObjectId(ownerId);
    const objectIds = studentIds
      .filter((id) => Types.ObjectId.isValid(id))
      .map((id) => new Types.ObjectId(id));

    const students = await this.studentModel
      .find({
        ownerId: ownerObjectId,
        $or: [
          { _id: { $in: objectIds } },
          { studentId: { $in: studentIds } },
          { id: { $in: studentIds } },
        ],
      })
      .exec();

    for (const student of students) {
      await this.releaseBedAssignment(student._id as Types.ObjectId);
      await this.studentModel.deleteOne({ _id: student._id }).exec();
    }

    return { success: true, count: students.length };
  }

  /**
   * Bulk import multiple students
   */
  async bulkImport(ownerId: string, batch: any[]): Promise<any> {
    const created: any[] = [];
    for (const item of batch) {
      const res = await this.create(ownerId, item);
      created.push(res);
    }
    return created;
  }

  /**
   * Seed realistic sample students for owner
   */
  async seedDemoStudents(ownerId: string): Promise<any[]> {
    const ownerObjectId = new Types.ObjectId(ownerId);
    const pgs = await this.pgModel.find({ ownerId: ownerObjectId }).exec();
    const primaryPg = pgs[0];
    const pgId = primaryPg ? primaryPg._id.toString() : 'pg-01';
    const pgName = primaryPg ? primaryPg.name : 'Green Valley PG';

    const seedData = [
      {
        name: 'Aarav Sharma',
        email: 'aarav.sharma@gmail.com',
        phone: '+91 98765 43210',
        gender: 'Male',
        dob: '2003-08-14',
        bloodGroup: 'O+',
        address: {
          street: '42, Shivalik Hills, Mansarovar',
          city: 'Jaipur',
          state: 'Rajasthan',
          pincode: '302020',
        },
        emergencyContact: {
          name: 'Ramesh Sharma',
          relation: 'Father',
          phone: '+91 98290 11223',
        },
        academic: {
          college: 'IIT Delhi',
          course: 'B.Tech',
          branch: 'Computer Science',
          year: '3rd Year',
          rollNumber: '2023CSB1042',
        },
        guardian: {
          name: 'Ramesh Sharma',
          relation: 'Father',
          phone: '+91 98290 11223',
          occupation: 'Civil Engineer',
        },
        accommodation: {
          pgId,
          pgName,
          floor: '2nd Floor',
          roomNumber: '204',
          bedNumber: 'Bed A',
          sharingType: 'Double',
          joiningDate: '2025-07-15',
          monthlyRent: 8500,
          securityDeposit: 17000,
          depositStatus: 'Paid',
        },
        rentStatus: RentStatus.PAID,
        rentDueAmount: 0,
        nextRentDueDate: '2026-12-05',
        verificationStatus: VerificationStatus.VERIFIED,
        accountStatus: AccountStatus.ACTIVE,
        documents: [
          {
            id: 'doc-101',
            type: 'AADHAAR',
            title: 'Aadhaar Card',
            fileName: 'aarav_aadhaar.pdf',
            fileSize: '1.2 MB',
            uploadedAt: '2025-07-15',
            status: 'VERIFIED',
          },
          {
            id: 'doc-102',
            type: 'COLLEGE_ID',
            title: 'IIT Delhi ID',
            fileName: 'iitd_id.png',
            fileSize: '840 KB',
            uploadedAt: '2025-07-15',
            status: 'VERIFIED',
          },
        ],
        rentHistory: [
          {
            id: 'rent-101',
            month: 'November',
            year: 2026,
            amount: 8500,
            dueDate: '2026-11-05',
            paidDate: '2026-11-02',
            paymentMethod: 'UPI',
            status: 'PAID',
            receiptNumber: 'REC-2026-1102',
          },
        ],
      },
      {
        name: 'Priya Patel',
        email: 'priya.patel@gmail.com',
        phone: '+91 91234 56789',
        gender: 'Female',
        dob: '2004-03-22',
        bloodGroup: 'B+',
        address: {
          street: '12 Sunrise Apartments',
          city: 'Ahmedabad',
          state: 'Gujarat',
          pincode: '380015',
        },
        emergencyContact: {
          name: 'Kirit Patel',
          relation: 'Father',
          phone: '+91 98980 12345',
        },
        academic: {
          college: 'AIIMS',
          course: 'MBBS',
          branch: 'General Medicine',
          year: '2nd Year',
          rollNumber: '2024MED089',
        },
        guardian: {
          name: 'Kirit Patel',
          relation: 'Father',
          phone: '+91 98980 12345',
          occupation: 'Business',
        },
        accommodation: {
          pgId,
          pgName,
          floor: '1st Floor',
          roomNumber: '102',
          bedNumber: 'Bed B',
          sharingType: 'Double',
          joiningDate: '2025-08-01',
          monthlyRent: 9500,
          securityDeposit: 19000,
          depositStatus: 'Paid',
        },
        rentStatus: RentStatus.PENDING,
        rentDueAmount: 9500,
        nextRentDueDate: '2026-11-10',
        verificationStatus: VerificationStatus.VERIFIED,
        accountStatus: AccountStatus.ACTIVE,
        documents: [
          {
            id: 'doc-201',
            type: 'AADHAAR',
            title: 'Aadhaar Card',
            fileName: 'priya_aadhaar.pdf',
            fileSize: '1.1 MB',
            uploadedAt: '2025-08-01',
            status: 'VERIFIED',
          },
        ],
        rentHistory: [],
      },
      {
        name: 'Rohan Verma',
        email: 'rohan.verma@gmail.com',
        phone: '+91 98111 22334',
        gender: 'Male',
        dob: '2002-11-10',
        bloodGroup: 'A+',
        address: {
          street: '78 Sector 14',
          city: 'Gurugram',
          state: 'Haryana',
          pincode: '122001',
        },
        emergencyContact: {
          name: 'Sunita Verma',
          relation: 'Mother',
          phone: '+91 98111 99887',
        },
        academic: {
          college: 'Delhi University',
          course: 'B.Com',
          branch: 'Honours',
          year: '3rd Year',
          rollNumber: '2023BCOM312',
        },
        guardian: {
          name: 'Sunita Verma',
          relation: 'Mother',
          phone: '+91 98111 99887',
          occupation: 'Teacher',
        },
        accommodation: {
          pgId,
          pgName,
          floor: '3rd Floor',
          roomNumber: '305',
          bedNumber: 'Bed A',
          sharingType: 'Triple',
          joiningDate: '2025-06-10',
          monthlyRent: 7000,
          securityDeposit: 14000,
          depositStatus: 'Paid',
        },
        rentStatus: RentStatus.OVERDUE,
        rentDueAmount: 7000,
        nextRentDueDate: '2026-11-01',
        verificationStatus: VerificationStatus.PENDING,
        accountStatus: AccountStatus.ACTIVE,
        documents: [
          {
            id: 'doc-301',
            type: 'COLLEGE_ID',
            title: 'DU Student ID',
            fileName: 'du_id.pdf',
            fileSize: '920 KB',
            uploadedAt: '2025-06-10',
            status: 'PENDING',
          },
        ],
        rentHistory: [],
      },
    ];

    const results: any[] = [];
    for (const item of seedData) {
      const created = await this.create(ownerId, item as any);
      results.push(created);
    }
    return results;
  }
}
