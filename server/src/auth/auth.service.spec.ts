import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

const mockUser = {
  _id: 'user123',
  email: 'test@example.com',
  password: 'hashedPassword',
  firstName: 'John',
  lastName: 'Doe',
  role: 'user',
  gender: 'male',
  phone: '+1234567890',
  bio: '',
  position: 'Developer',
  hireDate: '2022-01-01',
  dateOfBirth: '1990-01-01',
  toObject: () => ({
    _id: 'user123',
    email: 'test@example.com',
    password: 'hashedPassword',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
  }),
};

const mockUsersService = {
  findByEmail: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  updateById: jest.fn(),
};

const mockJwtService = {
  signAsync: jest.fn().mockResolvedValue('mock_token'),
  verify: jest.fn(),
};

const mockConfigService = {
  get: jest.fn().mockReturnValue('test_secret'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
    mockJwtService.signAsync.mockResolvedValue('mock_token');
    mockConfigService.get.mockReturnValue('test_secret');
  });

  // ─── register ────────────────────────────────────────────────────────────

  describe('register', () => {
    it('should register a new user successfully', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await service.register({
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        password: 'Password1',
        gender: 'male',
        dateOfBirth: '1990-01-01',
        position: 'Developer',
        hireDate: '2022-01-01',
        phone: '+1234567890',
      });

      expect(result.message).toBe('User registered successfully');
      expect(result.user).toBeDefined();
      expect(result.user.password).toBeUndefined();
    });

    it('should throw ConflictException if email already exists', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      await expect(
        service.register({
          firstName: 'John',
          lastName: 'Doe',
          email: 'test@example.com',
          password: 'Password1',
          gender: 'male',
          dateOfBirth: '1990-01-01',
          position: 'Developer',
          hireDate: '2022-01-01',
          phone: '+1234567890',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  // ─── login ───────────────────────────────────────────────────────────────

  describe('login', () => {
    it('should return tokens on valid credentials', async () => {
      const hashed = await bcrypt.hash('password123', 10);
      mockUsersService.findByEmail.mockResolvedValue({ ...mockUser, password: hashed });

      const result = await service.login({ email: 'test@example.com', password: 'password123' });

      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({ email: 'notfound@example.com', password: 'password123' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is wrong', async () => {
      const hashed = await bcrypt.hash('correctPassword', 10);
      mockUsersService.findByEmail.mockResolvedValue({ ...mockUser, password: hashed });

      await expect(
        service.login({ email: 'test@example.com', password: 'wrongPassword' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  // ─── refreshToken ────────────────────────────────────────────────────────

  describe('refreshToken', () => {
    it('should return new tokens on valid refresh token', async () => {
      mockJwtService.verify.mockReturnValue({ sub: 'user123', email: 'test@example.com' });
      mockUsersService.findById.mockResolvedValue(mockUser);

      const result = await service.refreshToken('valid_refresh_token');

      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it('should throw UnauthorizedException on invalid refresh token', async () => {
      mockJwtService.verify.mockImplementation(() => { throw new Error('invalid'); });

      await expect(service.refreshToken('invalid_token')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user not found after token verify', async () => {
      mockJwtService.verify.mockReturnValue({ sub: 'nonexistent', email: 'x@x.com' });
      mockUsersService.findById.mockResolvedValue(null);

      await expect(service.refreshToken('valid_token')).rejects.toThrow(UnauthorizedException);
    });
  });

  // ─── forgotPassword ──────────────────────────────────────────────────────

  describe('forgotPassword', () => {
    it('should return generic message regardless of whether email exists', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      const result = await service.forgotPassword('unknown@example.com');
      expect(result.message).toContain('If this email exists');
    });

    it('should return same message when email exists', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      const result = await service.forgotPassword('test@example.com');
      expect(result.message).toContain('If this email exists');
    });
  });

  // ─── logout ──────────────────────────────────────────────────────────────

  describe('logout', () => {
    it('should return success message', async () => {
      const result = await service.logout('user123');
      expect(result.message).toBe('Logged out successfully');
    });
  });

  // ─── changePassword ──────────────────────────────────────────────────────

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const hashed = await bcrypt.hash('oldPassword', 10);
      mockUsersService.findById.mockResolvedValue({ ...mockUser, password: hashed });
      mockUsersService.updateById.mockResolvedValue(mockUser);

      const result = await service.changePassword('user123', {
        currentPassword: 'oldPassword',
        newPassword: 'newPassword1',
        confirmNewPassword: 'newPassword1',
      });

      expect(result.message).toBe('Password changed successfully');
    });

    it('should throw BadRequestException if passwords do not match', async () => {
      await expect(
        service.changePassword('user123', {
          currentPassword: 'oldPassword',
          newPassword: 'newPassword1',
          confirmNewPassword: 'differentPassword',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUsersService.findById.mockResolvedValue(null);

      await expect(
        service.changePassword('nonexistent', {
          currentPassword: 'oldPassword',
          newPassword: 'newPassword1',
          confirmNewPassword: 'newPassword1',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw BadRequestException if current password is wrong', async () => {
      const hashed = await bcrypt.hash('correctPassword', 10);
      mockUsersService.findById.mockResolvedValue({ ...mockUser, password: hashed });

      await expect(
        service.changePassword('user123', {
          currentPassword: 'wrongPassword',
          newPassword: 'newPassword1',
          confirmNewPassword: 'newPassword1',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ─── updateProfile ───────────────────────────────────────────────────────

  describe('updateProfile', () => {
    it('should update profile and return sanitized user', async () => {
      mockUsersService.updateById.mockResolvedValue(mockUser);

      const result = await service.updateProfile('user123', {
        firstName: 'Jane',
        lastName: 'Doe',
      });

      expect(result.message).toBe('Profile updated successfully');
      expect(result.user).toBeDefined();
      expect(result.user.password).toBeUndefined();
    });
  });
});
