import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BedsService } from './beds.service.js';
import { CreateBedDto } from './dto/create-bed.dto.js';
import { UpdateBedDto } from './dto/update-bed.dto.js';
import { JwtAuthGuard } from '../common/jwt-auth.guard.js';
import { RolesGuard } from '../common/roles.guard.js';
import { Roles } from '../common/roles.decorator.js';
import { CurrentUser } from '../common/current-user.decorator.js';
import { ParseObjectIdPipe } from '../common/parse-object-id.pipe.js';
import { Role } from '../users/user.schema.js';

@Controller(['pgs', 'owner/pgs'])
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.OWNER, Role.SUPER_ADMIN)
export class BedsController {
  constructor(private readonly bedsService: BedsService) {}

  @Get(':pgId/rooms/:roomId/beds')
  findAll(
    @Param('pgId', ParseObjectIdPipe) pgId: string,
    @Param('roomId', ParseObjectIdPipe) roomId: string,
    @CurrentUser() user: any,
  ) {
    return this.bedsService.findAll(roomId, user.userId, pgId);
  }

  @Post(':pgId/rooms/:roomId/beds')
  create(
    @Param('pgId', ParseObjectIdPipe) pgId: string,
    @Param('roomId', ParseObjectIdPipe) roomId: string,
    @CurrentUser() user: any,
    @Body() createBedDto: CreateBedDto,
  ) {
    return this.bedsService.create(roomId, user.userId, createBedDto, pgId);
  }

  @Get(':pgId/rooms/:roomId/beds/:bedId')
  findOne(
    @Param('pgId', ParseObjectIdPipe) pgId: string,
    @Param('roomId', ParseObjectIdPipe) roomId: string,
    @Param('bedId', ParseObjectIdPipe) bedId: string,
    @CurrentUser() user: any,
  ) {
    return this.bedsService.findOne(bedId, user.userId, roomId, pgId);
  }

  @Patch(':pgId/rooms/:roomId/beds/:bedId')
  update(
    @Param('pgId', ParseObjectIdPipe) pgId: string,
    @Param('roomId', ParseObjectIdPipe) roomId: string,
    @Param('bedId', ParseObjectIdPipe) bedId: string,
    @CurrentUser() user: any,
    @Body() updateBedDto: UpdateBedDto,
  ) {
    return this.bedsService.update(bedId, user.userId, updateBedDto, roomId, pgId);
  }

  @Delete(':pgId/rooms/:roomId/beds/:bedId')
  remove(
    @Param('pgId', ParseObjectIdPipe) pgId: string,
    @Param('roomId', ParseObjectIdPipe) roomId: string,
    @Param('bedId', ParseObjectIdPipe) bedId: string,
    @CurrentUser() user: any,
  ) {
    return this.bedsService.remove(bedId, user.userId, roomId, pgId);
  }
}

@Controller('rooms')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.OWNER, Role.SUPER_ADMIN)
export class BedsRoomDirectController {
  constructor(private readonly bedsService: BedsService) {}

  @Get(':roomId/beds')
  findAll(
    @Param('roomId', ParseObjectIdPipe) roomId: string,
    @CurrentUser() user: any,
  ) {
    return this.bedsService.findAll(roomId, user.userId);
  }

  @Post(':roomId/beds')
  create(
    @Param('roomId', ParseObjectIdPipe) roomId: string,
    @CurrentUser() user: any,
    @Body() createBedDto: CreateBedDto,
  ) {
    return this.bedsService.create(roomId, user.userId, createBedDto);
  }
}

@Controller('beds')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.OWNER, Role.SUPER_ADMIN)
export class BedsDirectController {
  constructor(private readonly bedsService: BedsService) {}

  @Get(':id')
  findOne(
    @Param('id', ParseObjectIdPipe) id: string,
    @CurrentUser() user: any,
  ) {
    return this.bedsService.findOne(id, user.userId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @CurrentUser() user: any,
    @Body() updateBedDto: UpdateBedDto,
  ) {
    return this.bedsService.update(id, user.userId, updateBedDto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseObjectIdPipe) id: string,
    @CurrentUser() user: any,
  ) {
    return this.bedsService.remove(id, user.userId);
  }
}
