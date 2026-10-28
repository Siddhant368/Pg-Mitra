import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BedsService } from './beds.service.js';
import { BedStatus } from './schemas/bed.schema.js';
import {
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Types } from 'mongoose';

describe('BedsService', () => {
  let service: BedsService;
  let mockBedModel: any;
  let mockRoomModel: any;
  let mockPgModel: any;

  const ownerId = new Types.ObjectId().toString();
  const pgId = new Types.ObjectId().toString();
  const roomId = new Types.ObjectId().toString();
  const bedId = new Types.ObjectId().toString();
  const wrongRoomId = new Types.ObjectId().toString();

  beforeEach(() => {
    function MockBedModel(this: any, data: any) {
      Object.assign(this, data);
      this._id = this._id || new Types.ObjectId(bedId);
      this.save = vi.fn().mockResolvedValue(this);
      this.toJSON = () => ({
        ...this,
        _id: this._id.toString(),
        id: this._id.toString(),
      });
    }
    MockBedModel.find = vi.fn();
    MockBedModel.findOne = vi.fn();
    MockBedModel.countDocuments = vi.fn();
    MockBedModel.deleteOne = vi.fn();
    MockBedModel.aggregate = vi.fn();
    mockBedModel = MockBedModel;

    mockRoomModel = {
      findOne: vi.fn(),
      findById: vi.fn(),
    };

    mockPgModel = {
      findOne: vi.fn(),
    };

    service = new BedsService(
      mockBedModel as any,
      mockRoomModel as any,
      mockPgModel as any,
    );
  });

  describe('findAll', () => {
    it('should list beds for an owner room', async () => {
      mockRoomModel.findOne.mockReturnValue({
        exec: vi.fn().mockResolvedValue({
          _id: new Types.ObjectId(roomId),
          pgId: new Types.ObjectId(pgId),
          ownerId: new Types.ObjectId(ownerId),
          roomNumber: '101',
        }),
      });

      mockBedModel.find.mockReturnValue({
        sort: vi.fn().mockReturnValue({
          exec: vi.fn().mockResolvedValue([
            {
              _id: new Types.ObjectId(bedId),
              bedNumber: 1,
              label: '101-A',
              status: BedStatus.AVAILABLE,
              toJSON: () => ({ bedNumber: 1, label: '101-A', status: BedStatus.AVAILABLE }),
            },
          ]),
        }),
      });

      const beds = await service.findAll(roomId, ownerId, pgId);
      expect(Array.isArray(beds)).toBe(true);
      expect(beds.length).toBe(1);
      expect(beds[0].label).toBe('101-A');
    });

    it('should reject access if room belongs to another owner', async () => {
      mockRoomModel.findOne.mockReturnValue({
        exec: vi.fn().mockResolvedValue(null),
      });

      await expect(service.findAll(roomId, ownerId, pgId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create and capacity rules', () => {
    it('should reject creating bed when room capacity is reached', async () => {
      mockRoomModel.findOne.mockReturnValue({
        exec: vi.fn().mockResolvedValue({
          _id: new Types.ObjectId(roomId),
          pgId: new Types.ObjectId(pgId),
          ownerId: new Types.ObjectId(ownerId),
          roomNumber: '101',
          bedCapacity: 2,
        }),
      });

      // Already has 2 beds
      mockBedModel.find.mockReturnValue({
        sort: vi.fn().mockReturnValue({
          exec: vi.fn().mockResolvedValue([
            { bedNumber: 1 },
            { bedNumber: 2 },
          ]),
        }),
      });

      await expect(
        service.create(roomId, ownerId, { bedNumber: 3 }, pgId),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create bed when capacity is available', async () => {
      mockRoomModel.findOne.mockReturnValue({
        exec: vi.fn().mockResolvedValue({
          _id: new Types.ObjectId(roomId),
          pgId: new Types.ObjectId(pgId),
          ownerId: new Types.ObjectId(ownerId),
          roomNumber: '101',
          bedCapacity: 3,
        }),
      });

      mockBedModel.find.mockReturnValue({
        sort: vi.fn().mockReturnValue({
          exec: vi.fn().mockResolvedValue([
            { bedNumber: 1 },
          ]),
        }),
      });

      const created = await service.create(roomId, ownerId, {}, pgId);
      expect(created).toBeDefined();
      expect(created.bedNumber).toBe(2);
      expect(created.label).toBe('101-B');
    });
  });

  describe('update and status transitions', () => {
    it('should reject marking bed available if linked to active tenant', async () => {
      const mockBed = {
        _id: new Types.ObjectId(bedId),
        roomId: new Types.ObjectId(roomId),
        pgId: new Types.ObjectId(pgId),
        ownerId: new Types.ObjectId(ownerId),
        status: BedStatus.OCCUPIED,
        tenantId: new Types.ObjectId(),
        save: vi.fn(),
      };

      mockBedModel.findOne.mockReturnValue({
        exec: vi.fn().mockResolvedValue(mockBed),
      });

      await expect(
        service.update(bedId, ownerId, { status: BedStatus.AVAILABLE }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should update status and fields when valid', async () => {
      const mockBed = {
        _id: new Types.ObjectId(bedId),
        roomId: new Types.ObjectId(roomId),
        pgId: new Types.ObjectId(pgId),
        ownerId: new Types.ObjectId(ownerId),
        bedNumber: 1,
        status: BedStatus.AVAILABLE,
        save: vi.fn().mockImplementation(function (this: any) {
          return Promise.resolve(this);
        }),
        toJSON: () => ({ _id: bedId, id: bedId, bedNumber: 1, status: BedStatus.OCCUPIED }),
      };

      mockBedModel.findOne.mockReturnValue({
        exec: vi.fn().mockResolvedValue(mockBed),
      });

      mockRoomModel.findById.mockReturnValue({
        exec: vi.fn().mockResolvedValue({ roomNumber: '101' }),
      });

      const updated = await service.update(bedId, ownerId, {
        status: BedStatus.OCCUPIED,
      });

      expect(updated.status).toBe(BedStatus.OCCUPIED);
      expect(mockBed.isOccupied).toBe(true);
    });
  });

  describe('remove', () => {
    it('should reject deleting an occupied bed', async () => {
      mockBedModel.findOne.mockReturnValue({
        exec: vi.fn().mockResolvedValue({
          _id: new Types.ObjectId(bedId),
          roomId: new Types.ObjectId(roomId),
          pgId: new Types.ObjectId(pgId),
          ownerId: new Types.ObjectId(ownerId),
          status: BedStatus.OCCUPIED,
        }),
      });

      await expect(service.remove(bedId, ownerId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should safely delete a vacant bed', async () => {
      mockBedModel.findOne.mockReturnValue({
        exec: vi.fn().mockResolvedValue({
          _id: new Types.ObjectId(bedId),
          roomId: new Types.ObjectId(roomId),
          pgId: new Types.ObjectId(pgId),
          ownerId: new Types.ObjectId(ownerId),
          status: BedStatus.AVAILABLE,
        }),
      });

      mockBedModel.deleteOne.mockReturnValue({
        exec: vi.fn().mockResolvedValue({ deletedCount: 1 }),
      });

      const res = await service.remove(bedId, ownerId);
      expect(res.message).toBe('Bed deleted successfully');
      expect(mockBedModel.deleteOne).toHaveBeenCalled();
    });

    it('should reject bed deletion if wrong room ID is supplied', async () => {
      mockBedModel.findOne.mockReturnValue({
        exec: vi.fn().mockResolvedValue({
          _id: new Types.ObjectId(bedId),
          roomId: new Types.ObjectId(roomId),
          pgId: new Types.ObjectId(pgId),
          ownerId: new Types.ObjectId(ownerId),
          status: BedStatus.AVAILABLE,
        }),
      });

      await expect(
        service.remove(bedId, ownerId, wrongRoomId, pgId),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
