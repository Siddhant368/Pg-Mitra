import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RoomsService } from './rooms.service.js';
import { BedStatus } from './schemas/bed.schema.js';
import { RoomOccupancyStatus } from './schemas/room.schema.js';
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { Types } from 'mongoose';

describe('RoomsService', () => {
  let service: RoomsService;
  let mockRoomModel: any;
  let mockBedModel: any;
  let mockPgModel: any;
  let mockConnection: any;

  const ownerId = new Types.ObjectId().toString();
  const otherOwnerId = new Types.ObjectId().toString();
  const pgId = new Types.ObjectId().toString();
  const wrongPgId = new Types.ObjectId().toString();
  const roomId = new Types.ObjectId().toString();

  beforeEach(() => {
    function MockRoomModel(this: any, data: any) {
      Object.assign(this, data);
      this._id = this._id || new Types.ObjectId(roomId);
      this.save = vi.fn().mockResolvedValue(this);
      this.toJSON = () => ({
        ...this,
        _id: this._id.toString(),
        id: this._id.toString(),
      });
    }
    MockRoomModel.findOne = vi.fn();
    MockRoomModel.find = vi.fn();
    MockRoomModel.create = vi.fn().mockImplementation((data) => new (MockRoomModel as any)(data));
    MockRoomModel.updateOne = vi.fn();
    MockRoomModel.deleteOne = vi.fn();
    MockRoomModel.countDocuments = vi.fn();
    mockRoomModel = MockRoomModel;

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
    MockBedModel.find = vi.fn();
    MockBedModel.findOne = vi.fn();
    MockBedModel.insertMany = vi.fn();
    MockBedModel.deleteMany = vi.fn();
    MockBedModel.deleteOne = vi.fn();
    MockBedModel.countDocuments = vi.fn();
    mockBedModel = MockBedModel;

    mockPgModel = {
      findOne: vi.fn(),
      findById: vi.fn(),
    };

    mockConnection = {
      startSession: vi.fn().mockResolvedValue({
        withTransaction: vi.fn().mockImplementation(async (cb) => cb()),
        endSession: vi.fn(),
      }),
    };

    service = new RoomsService(
      mockRoomModel as any,
      mockBedModel as any,
      mockPgModel as any,
      mockConnection as any,
    );
  });

  describe('create', () => {
    it('should create a room in own PG with automatically provisioned beds', async () => {
      // Mock PG exists and belongs to owner
      mockPgModel.findOne.mockReturnValue({
        exec: vi.fn().mockResolvedValue({ _id: new Types.ObjectId(pgId), ownerId: new Types.ObjectId(ownerId) }),
      });

      // No duplicate roomNumber
      mockRoomModel.findOne.mockReturnValue({
        collation: vi.fn().mockReturnValue({
          exec: vi.fn().mockResolvedValue(null),
        }),
      });

      mockBedModel.insertMany.mockResolvedValue([
        {
          _id: new Types.ObjectId(),
          bedNumber: 1,
          label: '101-A',
          status: BedStatus.AVAILABLE,
          toJSON: () => ({ bedNumber: 1, label: '101-A', status: BedStatus.AVAILABLE }),
        },
        {
          _id: new Types.ObjectId(),
          bedNumber: 2,
          label: '101-B',
          status: BedStatus.AVAILABLE,
          toJSON: () => ({ bedNumber: 2, label: '101-B', status: BedStatus.AVAILABLE }),
        },
      ]);

      const result = await service.create(pgId, ownerId, {
        roomNumber: '101',
        floor: 1,
        sharing: 2,
        monthlyRent: 8000,
      });

      expect(result).toBeDefined();
      expect(result.roomNumber).toBe('101');
      expect(result.totalBeds).toBe(2);
      expect(result.vacantBeds).toBe(2);
      expect(result.occupiedBeds).toBe(0);
      expect(result.status).toBe(RoomOccupancyStatus.VACANT);
    });

    it('should reject creation if PG does not belong to owner', async () => {
      mockPgModel.findOne.mockReturnValue({
        exec: vi.fn().mockResolvedValue(null),
      });

      await expect(
        service.create(pgId, otherOwnerId, {
          roomNumber: '101',
          sharing: 2,
          monthlyRent: 8000,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should reject duplicate room number in the same PG', async () => {
      mockPgModel.findOne.mockReturnValue({
        exec: vi.fn().mockResolvedValue({ _id: new Types.ObjectId(pgId), ownerId: new Types.ObjectId(ownerId) }),
      });

      mockRoomModel.findOne.mockReturnValue({
        collation: vi.fn().mockReturnValue({
          exec: vi.fn().mockResolvedValue({ roomNumber: '101' }),
        }),
      });

      await expect(
        service.create(pgId, ownerId, {
          roomNumber: '101',
          sharing: 2,
          monthlyRent: 8000,
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should list rooms for owner PG with bed occupancy counts', async () => {
      mockPgModel.findOne.mockReturnValue({
        exec: vi.fn().mockResolvedValue({ _id: new Types.ObjectId(pgId), ownerId: new Types.ObjectId(ownerId) }),
      });

      const mockRoom = {
        _id: new Types.ObjectId(roomId),
        pgId: new Types.ObjectId(pgId),
        ownerId: new Types.ObjectId(ownerId),
        roomNumber: '101',
        floor: 1,
        bedCapacity: 2,
        monthlyRent: 6000,
        toJSON: () => ({
          _id: roomId,
          id: roomId,
          roomNumber: '101',
          floor: 1,
          bedCapacity: 2,
          monthlyRent: 6000,
        }),
      };

      mockRoomModel.find.mockReturnValue({
        exec: vi.fn().mockResolvedValue([mockRoom]),
      });

      const mockBeds = [
        {
          _id: new Types.ObjectId(),
          roomId: new Types.ObjectId(roomId),
          bedNumber: 1,
          status: BedStatus.OCCUPIED,
          toJSON: () => ({ bedNumber: 1, status: BedStatus.OCCUPIED, _id: 'b1' }),
        },
        {
          _id: new Types.ObjectId(),
          roomId: new Types.ObjectId(roomId),
          bedNumber: 2,
          status: BedStatus.AVAILABLE,
          toJSON: () => ({ bedNumber: 2, status: BedStatus.AVAILABLE, _id: 'b2' }),
        },
      ];

      mockBedModel.find.mockReturnValue({
        exec: vi.fn().mockResolvedValue(mockBeds),
      });

      const result = await service.findAll(pgId, ownerId);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(1);
      expect(result[0].totalBeds).toBe(2);
      expect(result[0].occupiedBeds).toBe(1);
      expect(result[0].vacantBeds).toBe(1);
      expect(result[0].status).toBe(RoomOccupancyStatus.PARTIALLY_OCCUPIED);
    });
  });

  describe('findOne and wrong PG ID check', () => {
    it('should reject access if room does not belong to specified PG', async () => {
      mockRoomModel.findOne.mockReturnValue({
        exec: vi.fn().mockResolvedValue({
          _id: new Types.ObjectId(roomId),
          pgId: new Types.ObjectId(pgId),
          ownerId: new Types.ObjectId(ownerId),
        }),
      });

      await expect(
        service.findOne(roomId, ownerId, wrongPgId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update and capacity rules', () => {
    it('should reject reducing room capacity below occupied beds', async () => {
      const mockRoom = {
        _id: new Types.ObjectId(roomId),
        pgId: new Types.ObjectId(pgId),
        ownerId: new Types.ObjectId(ownerId),
        roomNumber: '101',
        bedCapacity: 3,
        sharing: 3,
      };

      mockRoomModel.findOne.mockReturnValue({
        exec: vi.fn().mockResolvedValue(mockRoom),
      });

      mockBedModel.find.mockReturnValue({
        sort: vi.fn().mockReturnValue({
          exec: vi.fn().mockResolvedValue([
            { _id: new Types.ObjectId(), bedNumber: 1, status: BedStatus.OCCUPIED },
            { _id: new Types.ObjectId(), bedNumber: 2, status: BedStatus.OCCUPIED },
            { _id: new Types.ObjectId(), bedNumber: 3, status: BedStatus.AVAILABLE },
          ]),
        }),
      });

      // Attempt reducing capacity to 1 when 2 beds are occupied
      await expect(
        service.update(roomId, ownerId, { bedCapacity: 1 }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should prevent deleting room with occupied beds', async () => {
      mockRoomModel.findOne.mockReturnValue({
        exec: vi.fn().mockResolvedValue({
          _id: new Types.ObjectId(roomId),
          pgId: new Types.ObjectId(pgId),
          ownerId: new Types.ObjectId(ownerId),
        }),
      });

      mockBedModel.countDocuments.mockReturnValue({
        exec: vi.fn().mockResolvedValue(1), // 1 occupied bed
      });

      await expect(service.remove(roomId, ownerId)).rejects.toThrow(BadRequestException);
    });

    it('should safely delete room and beds when all beds are vacant', async () => {
      mockRoomModel.findOne.mockReturnValue({
        exec: vi.fn().mockResolvedValue({
          _id: new Types.ObjectId(roomId),
          pgId: new Types.ObjectId(pgId),
          ownerId: new Types.ObjectId(ownerId),
        }),
      });

      mockBedModel.countDocuments.mockReturnValue({
        exec: vi.fn().mockResolvedValue(0),
      });

      mockBedModel.deleteMany.mockReturnValue({
        exec: vi.fn().mockResolvedValue({ deletedCount: 2 }),
      });
      mockRoomModel.deleteOne.mockReturnValue({
        exec: vi.fn().mockResolvedValue({ deletedCount: 1 }),
      });

      const res = await service.remove(roomId, ownerId);
      expect(res.message).toBe('Room deleted successfully');
      expect(mockBedModel.deleteMany).toHaveBeenCalled();
      expect(mockRoomModel.deleteOne).toHaveBeenCalled();
    });
  });

  describe('getSummary', () => {
    it('should calculate accurate occupancy and vacantBySharing from database records', async () => {
      mockPgModel.findOne.mockReturnValue({
        exec: vi.fn().mockResolvedValue({ _id: new Types.ObjectId(pgId), ownerId: new Types.ObjectId(ownerId) }),
      });

      const r1Id = new Types.ObjectId();
      const r2Id = new Types.ObjectId();

      mockRoomModel.find.mockReturnValue({
        exec: vi.fn().mockResolvedValue([
          { _id: r1Id, bedCapacity: 2, sharing: 2 },
          { _id: r2Id, bedCapacity: 3, sharing: 3 },
        ]),
      });

      mockBedModel.find.mockReturnValue({
        exec: vi.fn().mockResolvedValue([
          { roomId: r1Id, status: BedStatus.OCCUPIED },
          { roomId: r1Id, status: BedStatus.AVAILABLE },
          { roomId: r2Id, status: BedStatus.AVAILABLE },
          { roomId: r2Id, status: BedStatus.AVAILABLE },
          { roomId: r2Id, status: BedStatus.RESERVED },
        ]),
      });

      const summary = await service.getSummary(pgId, ownerId);
      expect(summary.totalRooms).toBe(2);
      expect(summary.totalBeds).toBe(5);
      expect(summary.occupiedBeds).toBe(1);
      expect(summary.availableBeds).toBe(3);
      expect(summary.vacantBeds).toBe(3);
      expect(summary.reservedBeds).toBe(1);
      expect(summary.occupancyRate).toBe(20);
      expect(Array.isArray(summary.vacantBySharing)).toBe(true);
    });
  });
});
