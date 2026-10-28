import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PgsService } from './pgs.service.js';
import { PgsController } from './pgs.controller.js';
import { Pg, PgSchema } from './schemas/pg.schema.js';

@Module({
  imports: [MongooseModule.forFeature([{ name: Pg.name, schema: PgSchema }])],
  controllers: [PgsController],
  providers: [PgsService],
  exports: [PgsService],
})
export class PgsModule {}
