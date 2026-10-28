import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PgsService } from './pgs.service.js';
import { PgsController } from './pgs.controller.js';
import { Pg, PgSchema } from './schemas/pg.schema.js';
import { Room, RoomSchema } from '../rooms/schemas/room.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Pg.name, schema: PgSchema },
      { name: Room.name, schema: RoomSchema },
    ]),
  ],
  controllers: [PgsController],
  providers: [PgsService],
  exports: [PgsService],
})
export class PgsModule {}
