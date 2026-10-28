import { Controller, Get, UseGuards, NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt-auth.guard.js';
import { RolesGuard } from '../common/roles.guard.js';
import { Roles } from '../common/roles.decorator.js';
import { Role } from '../users/user.schema.js';
import { UsersService } from '../users/users.service.js';
import { CurrentUser } from '../common/current-user.decorator.js';

@Controller('owner')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.OWNER, Role.SUPER_ADMIN)
export class OwnerController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@CurrentUser() user: any) {
    const profile = await this.usersService.findById(user.userId);
    if (!profile) {
      throw new NotFoundException('Owner profile not found');
    }
    const profileJson = profile.toJSON();
    return { ...profileJson, id: profile._id.toString() };
  }
}
