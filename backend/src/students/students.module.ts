import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from './schemas/student.schema.js';
import { Bed, BedSchema } from '../rooms/schemas/bed.schema.js';
import { Room, RoomSchema } from '../rooms/schemas/room.schema.js';
import { Pg, PgSchema } from '../pgs/schemas/pg.schema.js';
import { StudentsController } from './students.controller.js';
import { StudentsService } from './students.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Student.name, schema: StudentSchema },
      { name: Bed.name, schema: BedSchema },
      { name: Room.name, schema: RoomSchema },
      { name: Pg.name, schema: PgSchema },
    ]),
  ],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}
