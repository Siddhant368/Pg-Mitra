import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { StudentsController } from './students.controller.js';
import { StudentsService } from './students.service.js';
import { Types } from 'mongoose';

describe('StudentsController', () => {
  let controller: StudentsController;
  let service: any;

  const mockUser = { userId: new Types.ObjectId().toString(), role: 'OWNER' };
  const mockStudentId = new Types.ObjectId().toString();

  beforeEach(async () => {
    service = {
      findAll: vi.fn().mockResolvedValue([{ id: mockStudentId, name: 'Aarav Sharma' }]),
      findOne: vi.fn().mockResolvedValue({ id: mockStudentId, name: 'Aarav Sharma' }),
      getStats: vi.fn().mockResolvedValue({ totalStudents: 1, activeStudents: 1 }),
      create: vi.fn().mockResolvedValue({ id: mockStudentId, name: 'Aarav Sharma' }),
      update: vi.fn().mockResolvedValue({ id: mockStudentId, name: 'Aarav Sharma (Updated)' }),
      remove: vi.fn().mockResolvedValue({ success: true, message: 'Student deleted' }),
      transferRoom: vi.fn().mockResolvedValue({ id: mockStudentId, accommodation: { roomNumber: '102' } }),
      recordRentPayment: vi.fn().mockResolvedValue({ id: mockStudentId, rentStatus: 'PAID' }),
      approveDocument: vi.fn().mockResolvedValue({ id: mockStudentId, verificationStatus: 'VERIFIED' }),
      rejectDocument: vi.fn().mockResolvedValue({ id: mockStudentId, verificationStatus: 'REJECTED' }),
      addNote: vi.fn().mockResolvedValue({ id: mockStudentId, adminNotes: [{ content: 'Test note' }] }),
      deleteNote: vi.fn().mockResolvedValue({ id: mockStudentId, adminNotes: [] }),
      sendNotification: vi.fn().mockResolvedValue({ id: mockStudentId }),
      updateStatus: vi.fn().mockResolvedValue({ id: mockStudentId, accountStatus: 'INACTIVE' }),
      bulkApproveDocs: vi.fn().mockResolvedValue({ success: true, count: 2 }),
      bulkUpdateStatus: vi.fn().mockResolvedValue({ success: true, count: 2 }),
      bulkDelete: vi.fn().mockResolvedValue({ success: true, count: 2 }),
      bulkImport: vi.fn().mockResolvedValue([{ id: mockStudentId }]),
      seedDemoStudents: vi.fn().mockResolvedValue([{ id: mockStudentId }]),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentsController],
      providers: [{ provide: StudentsService, useValue: service }],
    }).compile();

    controller = module.get<StudentsController>(StudentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get all students', async () => {
    const result = await controller.findAll(mockUser, {});
    expect(service.findAll).toHaveBeenCalledWith(mockUser.userId, {});
    expect(result).toHaveLength(1);
  });

  it('should get stats', async () => {
    const result = await controller.getStats(mockUser);
    expect(service.getStats).toHaveBeenCalledWith(mockUser.userId);
    expect(result.totalStudents).toBe(1);
  });

  it('should create student', async () => {
    const dto: any = { name: 'Aarav Sharma', email: 'aarav@test.com', phone: '9999999999' };
    const result = await controller.create(mockUser, dto);
    expect(service.create).toHaveBeenCalledWith(mockUser.userId, dto);
    expect(result.name).toBe('Aarav Sharma');
  });

  it('should get one student', async () => {
    const result = await controller.findOne(mockStudentId, mockUser);
    expect(service.findOne).toHaveBeenCalledWith(mockStudentId, mockUser.userId);
    expect(result.id).toBe(mockStudentId);
  });

  it('should update student', async () => {
    const dto: any = { name: 'Aarav Sharma (Updated)' };
    const result = await controller.update(mockStudentId, mockUser, dto);
    expect(service.update).toHaveBeenCalledWith(mockStudentId, mockUser.userId, dto);
    expect(result.name).toContain('Updated');
  });

  it('should delete student', async () => {
    const result = await controller.remove(mockStudentId, mockUser);
    expect(service.remove).toHaveBeenCalledWith(mockStudentId, mockUser.userId);
    expect(result.success).toBe(true);
  });

  it('should transfer room', async () => {
    const dto: any = { pgId: 'pg-1', pgName: 'PG 1', roomNumber: '102', bedNumber: 'Bed A' };
    const result = await controller.transferRoom(mockStudentId, mockUser, dto);
    expect(service.transferRoom).toHaveBeenCalledWith(mockStudentId, mockUser.userId, dto);
    expect(result.accommodation.roomNumber).toBe('102');
  });

  it('should record rent payment', async () => {
    const dto: any = { amount: 8000, month: 'November', paymentMethod: 'UPI' };
    const result = await controller.recordRentPayment(mockStudentId, mockUser, dto);
    expect(service.recordRentPayment).toHaveBeenCalledWith(mockStudentId, mockUser.userId, dto);
    expect(result.rentStatus).toBe('PAID');
  });

  it('should approve document', async () => {
    const result = await controller.approveDocument(mockStudentId, 'doc-1', mockUser);
    expect(service.approveDocument).toHaveBeenCalledWith(mockStudentId, mockUser.userId, 'doc-1');
    expect(result.verificationStatus).toBe('VERIFIED');
  });

  it('should reject document', async () => {
    const result = await controller.rejectDocument(mockStudentId, 'doc-1', mockUser, { reason: 'Blurry photo' });
    expect(service.rejectDocument).toHaveBeenCalledWith(mockStudentId, mockUser.userId, 'doc-1', 'Blurry photo');
    expect(result.verificationStatus).toBe('REJECTED');
  });

  it('should add admin note', async () => {
    const dto: any = { content: 'Test note' };
    const result = await controller.addNote(mockStudentId, mockUser, dto);
    expect(service.addNote).toHaveBeenCalledWith(mockStudentId, mockUser.userId, dto);
    expect(result.adminNotes).toHaveLength(1);
  });

  it('should delete admin note', async () => {
    const result = await controller.deleteNote(mockStudentId, 'note-1', mockUser);
    expect(service.deleteNote).toHaveBeenCalledWith(mockStudentId, mockUser.userId, 'note-1');
    expect(result.adminNotes).toHaveLength(0);
  });

  it('should send notification', async () => {
    const dto: any = { channel: 'WhatsApp', message: 'Hello' };
    await controller.sendNotification(mockStudentId, mockUser, dto);
    expect(service.sendNotification).toHaveBeenCalledWith(mockStudentId, mockUser.userId, dto);
  });

  it('should update status', async () => {
    const dto: any = { accountStatus: 'INACTIVE' };
    const result = await controller.updateStatus(mockStudentId, mockUser, dto);
    expect(service.updateStatus).toHaveBeenCalledWith(mockStudentId, mockUser.userId, 'INACTIVE');
    expect(result.accountStatus).toBe('INACTIVE');
  });

  it('should perform bulk actions', async () => {
    await controller.bulkApproveDocs(mockUser, { studentIds: ['s1', 's2'] });
    expect(service.bulkApproveDocs).toHaveBeenCalledWith(mockUser.userId, ['s1', 's2']);

    await controller.bulkUpdateStatus(mockUser, { studentIds: ['s1', 's2'], accountStatus: 'INACTIVE' });
    expect(service.bulkUpdateStatus).toHaveBeenCalledWith(mockUser.userId, ['s1', 's2'], 'INACTIVE');

    await controller.bulkDelete(mockUser, { studentIds: ['s1', 's2'] });
    expect(service.bulkDelete).toHaveBeenCalledWith(mockUser.userId, ['s1', 's2']);
  });
});
