import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PgsService } from './pgs.service.js';
import { CreatePgDto } from './dto/create-pg.dto.js';
import { UpdatePgDto } from './dto/update-pg.dto.js';
import { JwtAuthGuard } from '../common/jwt-auth.guard.js';
import { RolesGuard } from '../common/roles.guard.js';
import { Roles } from '../common/roles.decorator.js';
import { Role } from '../users/user.schema.js';
import { CurrentUser } from '../common/current-user.decorator.js';
import { ParseObjectIdPipe } from '../common/parse-object-id.pipe.js';

@Controller('owner/pgs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.OWNER, Role.SUPER_ADMIN)
export class PgsController {
  constructor(private readonly pgsService: PgsService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() createPgDto: CreatePgDto) {
    return this.pgsService.create(user.userId, createPgDto);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.pgsService.findAllByOwner(user.userId);
  }

  @Get(':id')
  findOne(@CurrentUser() user: any, @Param('id', ParseObjectIdPipe) id: any) {
    // Note: ParseObjectIdPipe might return Types.ObjectId or string depending on the exact version in common. 
    // We convert it to string to be safe.
    return this.pgsService.findOneByOwner(id.toString(), user.userId);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: any, 
    @Param('id', ParseObjectIdPipe) id: any, 
    @Body() updatePgDto: UpdatePgDto
  ) {
    return this.pgsService.updateByOwner(id.toString(), user.userId, updatePgDto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: any, @Param('id', ParseObjectIdPipe) id: any) {
    return this.pgsService.deleteByOwner(id.toString(), user.userId);
  }
}
