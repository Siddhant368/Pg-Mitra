import { Module } from '@nestjs/common';
import { OwnerController } from './owner.controller.js';
import { UsersModule } from '../users/users.module.js';

@Module({
  imports: [UsersModule],
  controllers: [OwnerController],
})
export class OwnerModule {}
