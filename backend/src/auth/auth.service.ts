import { Injectable, ConflictException, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Response } from 'express';
import { UsersService } from '../users/users.service.js';
import { SignupDto } from './dto/auth.dto.js';
import { UserDocument, Role } from '../users/user.schema.js';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async getUserById(id: string) {
    return this.usersService.findById(id);
  }

  async signup(dto: SignupDto): Promise<UserDocument> {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.usersService.create({
      ...dto,
      password: hashedPassword,
      role: Role.OWNER, // Always OWNER
    });
  }

  async login(email: string, pass: string): Promise<UserDocument> {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.isActive || !user.password) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return user;
  }

  async generateTokenCookie(user: UserDocument, res: Response) {
    const payload = { sub: user._id.toString(), role: user.role };
    const token = this.jwtService.sign(payload);
    
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return user;
  }

  async changePassword(userId: string, currentPass: string, newPass: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.password) {
      throw new UnauthorizedException('User not found');
    }
    const isMatch = await bcrypt.compare(currentPass, user.password);
    if (!isMatch) {
      throw new BadRequestException('Incorrect current password');
    }
    const hashedPassword = await bcrypt.hash(newPass, 10);
    await this.usersService.update(userId, { password: hashedPassword });
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.isActive) {
      // Return success anyway to avoid email enumeration
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expires = new Date(Date.now() + 30 * 60 * 1000); // 30 mins

    await this.usersService.update(user._id.toString(), {
      passwordResetTokenHash: tokenHash,
      passwordResetExpires: expires,
    });

    console.log(`http://localhost:3000/reset-password?token=${resetToken}`);
  }

  async resetPassword(token: string, newPass: string) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const user = await this.usersService.findByResetToken(tokenHash);
    
    if (!user) {
      throw new BadRequestException('Token is invalid or has expired');
    }

    const hashedPassword = await bcrypt.hash(newPass, 10);
    await this.usersService.update(user._id.toString(), {
      password: hashedPassword,
      passwordResetTokenHash: undefined,
      passwordResetExpires: undefined,
    });
  }
}
