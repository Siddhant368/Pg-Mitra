import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { DemoRequestsService } from './demo-requests.service.js';
import { CreateDemoRequestDto } from './dto/create-demo-request.dto.js';
import { UpdateDemoRequestStatusDto } from './dto/update-demo-request.dto.js';
import { JwtAuthGuard } from '../common/jwt-auth.guard.js';
import { RolesGuard } from '../common/roles.guard.js';
import { Roles } from '../common/roles.decorator.js';
import { ParseObjectIdPipe } from '../common/parse-object-id.pipe.js';
import { Role } from '../users/user.schema.js';
import { DemoRequestStatus, EmailStatus } from './schemas/demo-request.schema.js';

@Controller('demo-requests')
export class DemoRequestsController {
  constructor(private readonly demoRequestsService: DemoRequestsService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async create(@Body() createDto: CreateDemoRequestDto) {
    await this.demoRequestsService.create(createDto);
    return { message: 'Thanks, we will contact you soon' };
  }

  @Post(':id/retry-email')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async retryEmail(@Param('id', ParseObjectIdPipe) id: string) {
    return this.demoRequestsService.retryEmail(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: DemoRequestStatus,
    @Query('emailStatus') emailStatus?: EmailStatus,
    @Query('date') date?: string,
  ) {
    const pageNum = parseInt(page || '1', 10) || 1;
    const limitNum = parseInt(limit || '20', 10) || 20;
    return this.demoRequestsService.findAll({
      page: pageNum,
      limit: limitNum,
      status,
      emailStatus,
      date,
    });
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async updateStatus(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateDto: UpdateDemoRequestStatusDto,
  ) {
    return this.demoRequestsService.updateStatus(id, updateDto);
  }
}
