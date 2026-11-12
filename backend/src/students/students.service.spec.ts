import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StudentsService } from './students.service.js';
import { RentStatus, VerificationStatus, AccountStatus } from './schemas/student.schema.js';
import { BedStatus } from '../rooms/schemas/bed.schema.js';
import { NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

describe('StudentsService', () => {
  let service: StudentsService;
  let mockStudentModel: any;
  let mockBedModel: any;
  let mockRoomModel: any;
  let mockPgModel: any;

  const ownerId = new Types.ObjectId().toString();
  const studentId = new Types.ObjectId().toString();

  beforeEach(() => {
    function MockStudentModel(this: any, data: any) {
      Object.assign(this, data);
      this._id = this._id || new Types.ObjectId(studentId);
      this.save = vi.fn().mockResolvedValue(this);
      this.markModified = vi.fn();
      this.toJSON = () => ({
        ...this,
        _id: this._id.toString(),
        id: this._id.toString(),
      });
    }
    MockStudentModel.findOne = vi.fn();
    MockStudentModel.find = vi.fn();
    MockStudentModel.countDocuments = vi.fn().mockReturnValue({ exec: vi.fn().mockResolvedValue(0) });
    MockStudentModel.deleteOne = vi.fn().mockReturnValue({ exec: vi.fn().mockResolvedValue({ deletedCount: 1 }) });
    mockStudentModel = MockStudentModel;

    function MockBedModel(this: any, data: any) {
      Object.assign(this, data);
      this._id = this._id || new Types.ObjectId();
      this.save = vi.fn().mockResolvedValue(this);
      this.toJSON = () => ({
        ...this,
        _id: this._id.toString(),
        id: this._id.toString(),
      });
    }
    MockBedModel.findOne = vi.fn();
    MockBedModel.find = vi.fn();
    MockBedModel.countDocuments = vi.fn().mockReturnValue({ exec: vi.fn().mockResolvedValue(5) });
    MockBedModel.updateMany = vi.fn().mockResolvedValue({ modifiedCount: 1 });
    mockBedModel = MockBedModel;

    function MockRoomModel(this: any, data: any) {
      Object.assign(this, data);
      this._id = this._id || new Types.ObjectId();
      this.save = vi.fn().mockResolvedValue(this);
    }
    MockRoomModel.findOne = vi.fn();
    mockRoomModel = MockRoomModel;

    function MockPgModel(this: any, data: any) {
      Object.assign(this, data);
      this._id = this._id || new Types.ObjectId();
    }
    MockPgModel.find = vi.fn().mockReturnValue({ exec: vi.fn().mockResolvedValue([]) });
    mockPgModel = MockPgModel;

    service = new StudentsService(
      mockStudentModel,
      mockBedModel,
      mockRoomModel,
      mockPgModel,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return formatted students array', async () => {
      const mockDoc = new mockStudentModel({
        name: 'Aarav Sharma',
        studentId: 'PGM-2026-0101',
        ownerId: new Types.ObjectId(ownerId),
      });

      mockStudentModel.find.mockReturnValue({
        sort: vi.fn().mockReturnValue({
          exec: vi.fn().mockResolvedValue([mockDoc]),
        }),
      });

      const result = await service.findAll(ownerId, {});
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Aarav Sharma');
      expect(result[0].id).toBe(mockDoc._id.toString());
    });
  });

  describe('findOne', () => {
    it('should return student if exists', async () => {
      const mockDoc = new mockStudentModel({
        name: 'Aarav Sharma',
        studentId: 'PGM-2026-0101',
        ownerId: new Types.ObjectId(ownerId),
      });

      mockStudentModel.findOne.mockReturnValue({
        exec: vi.fn().mockResolvedValue(mockDoc),
      });

      const result = await service.findOne('PGM-2026-0101', ownerId);
      expect(result.name).toBe('Aarav Sharma');
    });

    it('should throw NotFoundException if not found', async () => {
      mockStudentModel.findOne.mockReturnValue({
        exec: vi.fn().mockResolvedValue(null),
      });

      await expect(service.findOne('non-existent', ownerId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create student with generated studentId and timeline', async () => {
      mockStudentModel.countDocuments.mockReturnValue({
        exec: vi.fn().mockResolvedValue(0),
      });
      mockStudentModel.findOne.mockReturnValue({
        exec: vi.fn().mockResolvedValue(null),
      });

      const dto: any = {
        name: 'Aarav Sharma',
        email: 'aarav@test.com',
        phone: '9876543210',
        accommodation: {
          monthlyRent: 8000,
          roomNumber: '101',
          bedNumber: 'Bed 1',
        },
      };

      const result = await service.create(ownerId, dto);
      expect(result.name).toBe('Aarav Sharma');
      expect(result.studentId).toContain('PGM-');
      expect(result.timeline).toBeDefined();
    });
  });

  describe('recordRentPayment', () => {
    it('should record payment and update rentStatus', async () => {
      const mockDoc = new mockStudentModel({
        name: 'Aarav Sharma',
        rentDueAmount: 8000,
        rentStatus: RentStatus.PENDING,
        accommodation: { monthlyRent: 8000 },
        rentHistory: [],
        timeline: [],
      });

      mockStudentModel.findOne.mockReturnValue({
        exec: vi.fn().mockResolvedValue(mockDoc),
      });

      const result = await service.recordRentPayment(studentId, ownerId, {
        amount: 8000,
        month: 'November',
        paymentMethod: 'UPI',
      });

      expect(result.rentStatus).toBe(RentStatus.PAID);
      expect(result.rentDueAmount).toBe(0);
      expect(result.rentHistory).toHaveLength(1);
    });
  });

  describe('transferRoom', () => {
    it('should update accommodation and log timeline', async () => {
      const mockDoc = new mockStudentModel({
        name: 'Aarav Sharma',
        accommodation: { pgName: 'Old PG', roomNumber: '101', bedNumber: 'Bed 1' },
        timeline: [],
      });

      mockStudentModel.findOne.mockReturnValue({
        exec: vi.fn().mockResolvedValue(mockDoc),
      });
      mockBedModel.find.mockReturnValue({
        exec: vi.fn().mockResolvedValue([]),
      });

      const result = await service.transferRoom(studentId, ownerId, {
        pgId: 'pg-2',
        pgName: 'New Luxury PG',
        roomNumber: '202',
        bedNumber: 'Bed 2',
      });

      expect(result.accommodation.roomNumber).toBe('202');
      expect(result.accommodation.pgName).toBe('New Luxury PG');
      expect(result.timeline[0].type).toBe('ROOM_CHANGE');
    });
  });

  describe('approveDocument and rejectDocument', () => {
    it('should approve document and set status to VERIFIED', async () => {
      const mockDoc = new mockStudentModel({
        name: 'Aarav Sharma',
        documents: [{ id: 'doc-1', title: 'Aadhaar', status: 'PENDING' }],
        timeline: [],
      });

      mockStudentModel.findOne.mockReturnValue({
        exec: vi.fn().mockResolvedValue(mockDoc),
      });

      const result = await service.approveDocument(studentId, ownerId, 'doc-1');
      expect(result.documents[0].status).toBe(VerificationStatus.VERIFIED);
      expect(result.verificationStatus).toBe(VerificationStatus.VERIFIED);
    });

    it('should reject document with reason', async () => {
      const mockDoc = new mockStudentModel({
        name: 'Aarav Sharma',
        documents: [{ id: 'doc-1', title: 'Aadhaar', status: 'PENDING' }],
        timeline: [],
      });

      mockStudentModel.findOne.mockReturnValue({
        exec: vi.fn().mockResolvedValue(mockDoc),
      });

      const result = await service.rejectDocument(studentId, ownerId, 'doc-1', 'Invalid file');
      expect(result.documents[0].status).toBe(VerificationStatus.REJECTED);
      expect(result.documents[0].rejectionReason).toBe('Invalid file');
      expect(result.verificationStatus).toBe(VerificationStatus.REJECTED);
    });
  });

  describe('getStats', () => {
    it('should compute aggregated student stats', async () => {
      const mockStudents = [
        new mockStudentModel({
          accountStatus: AccountStatus.ACTIVE,
          verificationStatus: VerificationStatus.VERIFIED,
          rentStatus: RentStatus.PAID,
          accommodation: { monthlyRent: 8000 },
        }),
        new mockStudentModel({
          accountStatus: AccountStatus.ACTIVE,
          verificationStatus: VerificationStatus.PENDING,
          rentStatus: RentStatus.OVERDUE,
          rentDueAmount: 5000,
          accommodation: { monthlyRent: 5000 },
        }),
      ];

      mockStudentModel.find.mockReturnValue({
        exec: vi.fn().mockResolvedValue(mockStudents),
      });

      const stats = await service.getStats(ownerId);
      expect(stats.totalStudents).toBe(2);
      expect(stats.activeStudents).toBe(2);
      expect(stats.pendingVerification).toBe(1);
      expect(stats.pendingRentCount).toBe(1);
      expect(stats.pendingRentAmount).toBe(5000);
      expect(stats.totalMonthlyCollection).toBe(8000);
      expect(stats.vacantRoomRequests).toBe(5);
    });
  });
});
