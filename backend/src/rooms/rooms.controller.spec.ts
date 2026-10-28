import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import {
  RoomsController,
  RoomsDirectController,
} from './rooms.controller.js';
import {
  BedsController,
  BedsDirectController,
  BedsRoomDirectController,
} from './beds.controller.js';
import { RoomsService } from './rooms.service.js';
import { BedsService } from './beds.service.js';
import { Types } from 'mongoose';
import { BedStatus } from './schemas/bed.schema.js';

describe('Rooms & Beds Controllers', () => {
  let roomsController: RoomsController;
  let roomsDirectController: RoomsDirectController;
  let bedsController: BedsController;
  let bedsDirectController: BedsDirectController;
  let bedsRoomDirectController: BedsRoomDirectController;
  let mockRoomsService: any;
  let mockBedsService: any;

  const mockUser = { userId: new Types.ObjectId().toString(), role: 'OWNER' };
  const mockPgId = new Types.ObjectId().toString();
  const mockRoomId = new Types.ObjectId().toString();
  const mockBedId = new Types.ObjectId().toString();

  beforeEach(async () => {
    mockRoomsService = {
      create: vi.fn().mockResolvedValue({ id: mockRoomId, roomNumber: '101' }),
      findAll: vi.fn().mockResolvedValue([{ id: mockRoomId, roomNumber: '101' }]),
      findOne: vi.fn().mockResolvedValue({ id: mockRoomId, roomNumber: '101' }),
      update: vi.fn().mockResolvedValue({ id: mockRoomId, roomNumber: '101' }),
      remove: vi.fn().mockResolvedValue({ message: 'Room deleted successfully' }),
      getSummary: vi.fn().mockResolvedValue({ totalRooms: 1, totalBeds: 2 }),
    };

    mockBedsService = {
      create: vi.fn().mockResolvedValue({ id: mockBedId, bedNumber: 1 }),
      findAll: vi.fn().mockResolvedValue([{ id: mockBedId, bedNumber: 1 }]),
      findOne: vi.fn().mockResolvedValue({ id: mockBedId, bedNumber: 1 }),
      update: vi.fn().mockResolvedValue({ id: mockBedId, bedNumber: 1, status: BedStatus.OCCUPIED }),
      remove: vi.fn().mockResolvedValue({ message: 'Bed deleted successfully' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        RoomsController,
        RoomsDirectController,
        BedsController,
        BedsDirectController,
        BedsRoomDirectController,
      ],
      providers: [
        { provide: RoomsService, useValue: mockRoomsService },
        { provide: BedsService, useValue: mockBedsService },
      ],
    }).compile();

    roomsController = module.get<RoomsController>(RoomsController);
    roomsDirectController = module.get<RoomsDirectController>(RoomsDirectController);
    bedsController = module.get<BedsController>(BedsController);
    bedsDirectController = module.get<BedsDirectController>(BedsDirectController);
    bedsRoomDirectController = module.get<BedsRoomDirectController>(BedsRoomDirectController);
  });

  describe('RoomsController', () => {
    it('should delegate room creation to service', async () => {
      const dto = { roomNumber: '101', sharing: 2, monthlyRent: 7000 };
      const res = await roomsController.create(mockPgId, mockUser, dto as any);
      expect(mockRoomsService.create).toHaveBeenCalledWith(mockPgId, mockUser.userId, dto);
      expect(res.roomNumber).toBe('101');
    });

    it('should delegate list rooms to service', async () => {
      const res = await roomsController.findAll(mockPgId, mockUser, {});
      expect(mockRoomsService.findAll).toHaveBeenCalledWith(mockPgId, mockUser.userId, {});
      expect(Array.isArray(res)).toBe(true);
    });

    it('should delegate summary to service', async () => {
      const res = await roomsController.getSummary(mockPgId, mockUser);
      expect(mockRoomsService.getSummary).toHaveBeenCalledWith(mockPgId, mockUser.userId);
      expect(res.totalRooms).toBe(1);
    });

    it('should delegate room details to service', async () => {
      const res = await roomsController.findOne(mockPgId, mockRoomId, mockUser);
      expect(mockRoomsService.findOne).toHaveBeenCalledWith(mockRoomId, mockUser.userId, mockPgId);
      expect(res.id).toBe(mockRoomId);
    });

    it('should delegate room update to service', async () => {
      const dto = { monthlyRent: 8500 };
      await roomsController.update(mockPgId, mockRoomId, mockUser, dto as any);
      expect(mockRoomsService.update).toHaveBeenCalledWith(mockRoomId, mockUser.userId, dto, mockPgId);
    });

    it('should delegate room deletion to service', async () => {
      await roomsController.remove(mockPgId, mockRoomId, mockUser);
      expect(mockRoomsService.remove).toHaveBeenCalledWith(mockRoomId, mockUser.userId, mockPgId);
    });
  });

  describe('RoomsDirectController', () => {
    it('should support direct /rooms/:id route operations', async () => {
      await roomsDirectController.findOne(mockRoomId, mockUser);
      expect(mockRoomsService.findOne).toHaveBeenCalledWith(mockRoomId, mockUser.userId);

      await roomsDirectController.update(mockRoomId, mockUser, { roomNumber: '102' } as any);
      expect(mockRoomsService.update).toHaveBeenCalledWith(mockRoomId, mockUser.userId, { roomNumber: '102' });

      await roomsDirectController.remove(mockRoomId, mockUser);
      expect(mockRoomsService.remove).toHaveBeenCalledWith(mockRoomId, mockUser.userId);
    });
  });

  describe('BedsController', () => {
    it('should delegate bed creation to service', async () => {
      const dto = { bedNumber: 1, label: '101-A' };
      await bedsController.create(mockPgId, mockRoomId, mockUser, dto);
      expect(mockBedsService.create).toHaveBeenCalledWith(mockRoomId, mockUser.userId, dto, mockPgId);
    });

    it('should delegate bed listing to service', async () => {
      await bedsController.findAll(mockPgId, mockRoomId, mockUser);
      expect(mockBedsService.findAll).toHaveBeenCalledWith(mockRoomId, mockUser.userId, mockPgId);
    });

    it('should delegate bed update to service', async () => {
      const dto = { status: BedStatus.OCCUPIED };
      await bedsController.update(mockPgId, mockRoomId, mockBedId, mockUser, dto);
      expect(mockBedsService.update).toHaveBeenCalledWith(mockBedId, mockUser.userId, dto, mockRoomId, mockPgId);
    });

    it('should delegate bed deletion to service', async () => {
      await bedsController.remove(mockPgId, mockRoomId, mockBedId, mockUser);
      expect(mockBedsService.remove).toHaveBeenCalledWith(mockBedId, mockUser.userId, mockRoomId, mockPgId);
    });
  });

  describe('Direct Bed Controllers', () => {
    it('should support /rooms/:roomId/beds and /beds/:id endpoints', async () => {
      await bedsRoomDirectController.findAll(mockRoomId, mockUser);
      expect(mockBedsService.findAll).toHaveBeenCalledWith(mockRoomId, mockUser.userId);

      await bedsDirectController.findOne(mockBedId, mockUser);
      expect(mockBedsService.findOne).toHaveBeenCalledWith(mockBedId, mockUser.userId);

      await bedsDirectController.update(mockBedId, mockUser, { label: 'Special' });
      expect(mockBedsService.update).toHaveBeenCalledWith(mockBedId, mockUser.userId, { label: 'Special' });

      await bedsDirectController.remove(mockBedId, mockUser);
      expect(mockBedsService.remove).toHaveBeenCalledWith(mockBedId, mockUser.userId);
    });
  });
});
