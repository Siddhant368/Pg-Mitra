import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomsService } from './rooms.service.js';
import { BedsService } from './beds.service.js';
import {
  RoomsController,
  RoomsDirectController,
} from './rooms.controller.js';
import {
  BedsController,
  BedsRoomDirectController,
  BedsDirectController,
} from './beds.controller.js';
import { Room, RoomSchema } from './schemas/room.schema.js';
import { Bed, BedSchema } from './schemas/bed.schema.js';
import { Pg, PgSchema } from '../pgs/schemas/pg.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Room.name, schema: RoomSchema },
      { name: Bed.name, schema: BedSchema },
      { name: Pg.name, schema: PgSchema },
    ]),
  ],
  controllers: [
    RoomsController,
    RoomsDirectController,
    BedsController,
    BedsRoomDirectController,
    BedsDirectController,
  ],
  providers: [RoomsService, BedsService],
  exports: [RoomsService, BedsService, MongooseModule],
})
export class RoomsModule {}
