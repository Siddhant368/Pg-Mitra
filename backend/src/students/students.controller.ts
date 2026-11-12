import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StudentsService } from './students.service.js';
import { CreateStudentDto } from './dto/create-student.dto.js';
import { UpdateStudentDto } from './dto/update-student.dto.js';
import { StudentQueryDto } from './dto/student-query.dto.js';
import { RecordRentDto } from './dto/record-rent.dto.js';
import { TransferRoomDto } from './dto/transfer-room.dto.js';
import { AddAdminNoteDto } from './dto/admin-note.dto.js';
import { RejectDocDto } from './dto/reject-doc.dto.js';
import { SendNotificationDto } from './dto/send-notification.dto.js';
import { UpdateStatusDto } from './dto/update-status.dto.js';
import { BulkActionDto } from './dto/bulk-action.dto.js';
import { BulkImportDto } from './dto/bulk-import.dto.js';
import { JwtAuthGuard } from '../common/jwt-auth.guard.js';
import { RolesGuard } from '../common/roles.guard.js';
import { Roles } from '../common/roles.decorator.js';
import { CurrentUser } from '../common/current-user.decorator.js';
import { Role } from '../users/user.schema.js';

@Controller(['owner/students', 'students'])
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.OWNER, Role.SUPER_ADMIN)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  findAll(@CurrentUser() user: any, @Query() query: StudentQueryDto) {
    return this.studentsService.findAll(user.userId, query);
  }

  @Get('stats')
  getStats(@CurrentUser() user: any) {
    return this.studentsService.getStats(user.userId);
  }

  @Post('seed')
  seedDemoStudents(@CurrentUser() user: any) {
    return this.studentsService.seedDemoStudents(user.userId);
  }

  @Post('import')
  bulkImport(@CurrentUser() user: any, @Body() dto: BulkImportDto) {
    return this.studentsService.bulkImport(user.userId, dto.students);
  }

  @Post('bulk/approve-docs')
  bulkApproveDocs(@CurrentUser() user: any, @Body() dto: BulkActionDto) {
    return this.studentsService.bulkApproveDocs(user.userId, dto.studentIds);
  }

  @Post('bulk/status')
  bulkUpdateStatus(@CurrentUser() user: any, @Body() dto: BulkActionDto) {
    return this.studentsService.bulkUpdateStatus(
      user.userId,
      dto.studentIds,
      dto.accountStatus || 'ACTIVE',
    );
  }

  @Post('bulk/delete')
  bulkDelete(@CurrentUser() user: any, @Body() dto: BulkActionDto) {
    return this.studentsService.bulkDelete(user.userId, dto.studentIds);
  }

  @Post()
  create(@CurrentUser() user: any, @Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(user.userId, createStudentDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.studentsService.findOne(id, user.userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return this.studentsService.update(id, user.userId, updateStudentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.studentsService.remove(id, user.userId);
  }

  @Post(':id/transfer-room')
  transferRoom(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: TransferRoomDto,
  ) {
    return this.studentsService.transferRoom(id, user.userId, dto);
  }

  @Post(':id/rent')
  recordRentPayment(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: RecordRentDto,
  ) {
    return this.studentsService.recordRentPayment(id, user.userId, dto);
  }

  @Patch(':id/documents/:docId/approve')
  approveDocument(
    @Param('id') id: string,
    @Param('docId') docId: string,
    @CurrentUser() user: any,
  ) {
    return this.studentsService.approveDocument(id, user.userId, docId);
  }

  @Patch(':id/documents/:docId/reject')
  rejectDocument(
    @Param('id') id: string,
    @Param('docId') docId: string,
    @CurrentUser() user: any,
    @Body() dto: RejectDocDto,
  ) {
    return this.studentsService.rejectDocument(id, user.userId, docId, dto.reason);
  }

  @Post(':id/notes')
  addNote(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: AddAdminNoteDto,
  ) {
    return this.studentsService.addNote(id, user.userId, dto);
  }

  @Delete(':id/notes/:noteId')
  deleteNote(
    @Param('id') id: string,
    @Param('noteId') noteId: string,
    @CurrentUser() user: any,
  ) {
    return this.studentsService.deleteNote(id, user.userId, noteId);
  }

  @Post(':id/notifications')
  sendNotification(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: SendNotificationDto,
  ) {
    return this.studentsService.sendNotification(id, user.userId, dto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.studentsService.updateStatus(id, user.userId, dto.accountStatus);
  }
}
