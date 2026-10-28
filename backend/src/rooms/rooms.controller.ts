import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { RoomsService } from './rooms.service.js';
import { CreateRoomDto } from './dto/create-room.dto.js';
import { UpdateRoomDto } from './dto/update-room.dto.js';
import { RoomQueryDto } from './dto/room-query.dto.js';
import { JwtAuthGuard } from '../common/jwt-auth.guard.js';
import { RolesGuard } from '../common/roles.guard.js';
import { Roles } from '../common/roles.decorator.js';
import { CurrentUser } from '../common/current-user.decorator.js';
import { ParseObjectIdPipe } from '../common/parse-object-id.pipe.js';
import { Role } from '../users/user.schema.js';

@Controller(['pgs', 'owner/pgs'])
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.OWNER, Role.SUPER_ADMIN)
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post(':pgId/rooms')
  create(
    @Param('pgId', ParseObjectIdPipe) pgId: string,
    @CurrentUser() user: any,
    @Body() createRoomDto: CreateRoomDto,
  ) {
    return this.roomsService.create(pgId, user.userId, createRoomDto);
  }

  @Get(':pgId/rooms')
  findAll(
    @Param('pgId', ParseObjectIdPipe) pgId: string,
    @CurrentUser() user: any,
    @Query() query: RoomQueryDto,
  ) {
    return this.roomsService.findAll(pgId, user.userId, query);
  }

  @Get([':pgId/rooms/summary', ':pgId/summary'])
  getSummary(
    @Param('pgId', ParseObjectIdPipe) pgId: string,
    @CurrentUser() user: any,
  ) {
    return this.roomsService.getSummary(pgId, user.userId);
  }

  @Get(':pgId/rooms/:roomId')
  findOne(
    @Param('pgId', ParseObjectIdPipe) pgId: string,
    @Param('roomId', ParseObjectIdPipe) roomId: string,
    @CurrentUser() user: any,
  ) {
    return this.roomsService.findOne(roomId, user.userId, pgId);
  }

  @Patch(':pgId/rooms/:roomId')
  update(
    @Param('pgId', ParseObjectIdPipe) pgId: string,
    @Param('roomId', ParseObjectIdPipe) roomId: string,
    @CurrentUser() user: any,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    return this.roomsService.update(roomId, user.userId, updateRoomDto, pgId);
  }

  @Delete(':pgId/rooms/:roomId')
  remove(
    @Param('pgId', ParseObjectIdPipe) pgId: string,
    @Param('roomId', ParseObjectIdPipe) roomId: string,
    @CurrentUser() user: any,
  ) {
    return this.roomsService.remove(roomId, user.userId, pgId);
  }
}

@Controller('rooms')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.OWNER, Role.SUPER_ADMIN)
export class RoomsDirectController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get(':id')
  findOne(
    @Param('id', ParseObjectIdPipe) id: string,
    @CurrentUser() user: any,
  ) {
    return this.roomsService.findOne(id, user.userId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @CurrentUser() user: any,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    return this.roomsService.update(id, user.userId, updateRoomDto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseObjectIdPipe) id: string,
    @CurrentUser() user: any,
  ) {
    return this.roomsService.remove(id, user.userId);
  }
}
