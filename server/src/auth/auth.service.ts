import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as path from 'path';
import * as fs from 'fs';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // ─── Register ────────────────────────────────────────────────────────────

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      ...dto,
      password: hashedPassword,
    });

    return {
      message: 'User registered successfully',
      user: this.sanitizeUser(user),
    };
  }

  // ─── Login ───────────────────────────────────────────────────────────────

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.generateTokens(user);
  }

  // ─── Refresh token ───────────────────────────────────────────────────────

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  // ─── Forgot password ─────────────────────────────────────────────────────

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return { message: 'If this email exists, a reset link has been sent' };
    }
    // TODO: send actual email
    return { message: 'If this email exists, a reset link has been sent' };
  }

  // ─── Logout ──────────────────────────────────────────────────────────────

  async logout(_userId: string) {
    // Stateless JWT — client removes tokens; server-side blacklist can be added later
    return { message: 'Logged out successfully' };
  }

  // ─── Change password ─────────────────────────────────────────────────────

  async changePassword(userId: string, dto: ChangePasswordDto) {
    if (dto.newPassword !== dto.confirmNewPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isValid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashed = await bcrypt.hash(dto.newPassword, 10);
    await this.usersService.updateById(userId, { password: hashed });

    return { message: 'Password changed successfully' };
  }

  // ─── Update profile ──────────────────────────────────────────────────────

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, ...updateData } = dto;
    const updated = await this.usersService.updateById(userId, updateData);
    return {
      message: 'Profile updated successfully',
      user: this.sanitizeUser(updated),
    };
  }

  // ─── Upload profile picture ───────────────────────────────────────────────

  async uploadProfilePicture(userId: string, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Save to uploads directory
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const ext = path.extname(file.originalname);
    const filename = `profile_${userId}_${Date.now()}${ext}`;
    const filepath = path.join(uploadsDir, filename);
    fs.writeFileSync(filepath, file.buffer);

    const url = `/uploads/${filename}`;
    await this.usersService.updateById(userId, { profilePhoto: url });

    return { url, filename };
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────

  private async generateTokens(user: any) {
    const payload = {
      sub: user._id,
      id: user._id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      phone: user.phone,
      bio: user.bio,
      position: user.position,
      hireDate: user.hireDate,
      dateOfBirth: user.dateOfBirth,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
      }),
      this.jwtService.signAsync(
        { sub: user._id, email: user.email },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  private sanitizeUser(user: any) {
    const obj = user.toObject ? user.toObject() : { ...user };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = obj;
    return result;
  }
}
