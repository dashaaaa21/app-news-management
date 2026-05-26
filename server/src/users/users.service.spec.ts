import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';

const mockUserDoc = {
  _id: 'user123',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'hashed',
  role: 'user',
  save: jest.fn(),
};

const mockUserModel = {
  new: jest.fn().mockResolvedValue(mockUserDoc),
  constructor: jest.fn().mockResolvedValue(mockUserDoc),
  find: jest.fn(),
  findOne: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  create: jest.fn(),
};

// Helper to chain .exec()
const withExec = (value: unknown) => ({ exec: jest.fn().mockResolvedValue(value) });
const withSelect = (value: unknown) => ({
  select: jest.fn().mockReturnValue(withExec(value)),
  exec: jest.fn().mockResolvedValue(value),
});

describe('UsersService', () => {
  let service: UsersService;

  function MockUserModel(data: Record<string, unknown>) {
    return {
      _id: mockUserDoc._id,
      firstName: mockUserDoc.firstName,
      lastName: mockUserDoc.lastName,
      email: mockUserDoc.email,
      password: mockUserDoc.password,
      role: mockUserDoc.role,
      ...data,
      save: jest.fn().mockResolvedValue({ ...mockUserDoc, ...(data as object) }),
    };
  }
  MockUserModel.find = mockUserModel.find;
  MockUserModel.findOne = mockUserModel.findOne;
  MockUserModel.findById = mockUserModel.findById;
  MockUserModel.findByIdAndUpdate = mockUserModel.findByIdAndUpdate;
  MockUserModel.findByIdAndDelete = mockUserModel.findByIdAndDelete;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken(User.name), useValue: MockUserModel },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  // ─── findByEmail ─────────────────────────────────────────────────────────

  describe('findByEmail', () => {
    it('should return user when found', async () => {
      mockUserModel.findOne.mockReturnValue(withExec(mockUserDoc));

      const result = await service.findByEmail('john@example.com');
      expect(result).toEqual(mockUserDoc);
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: 'john@example.com' });
    });

    it('should return null when user not found', async () => {
      mockUserModel.findOne.mockReturnValue(withExec(null));

      const result = await service.findByEmail('notfound@example.com');
      expect(result).toBeNull();
    });
  });

  // ─── findById ────────────────────────────────────────────────────────────

  describe('findById', () => {
    it('should return user by id', async () => {
      mockUserModel.findById.mockReturnValue(withExec(mockUserDoc));

      const result = await service.findById('user123');
      expect(result).toEqual(mockUserDoc);
    });

    it('should return null when user not found', async () => {
      mockUserModel.findById.mockReturnValue(withExec(null));

      const result = await service.findById('nonexistent');
      expect(result).toBeNull();
    });
  });

  // ─── findAll ─────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('should return all users without passwords', async () => {
      const users = [mockUserDoc, { ...mockUserDoc, _id: 'user456', email: 'jane@example.com' }];
      mockUserModel.find.mockReturnValue(withSelect(users));

      const result = await service.findAll();
      expect(result).toEqual(users);
      expect(mockUserModel.find).toHaveBeenCalled();
    });
  });

  // ─── updateById ──────────────────────────────────────────────────────────

  describe('updateById', () => {
    it('should update and return user', async () => {
      const updated = { ...mockUserDoc, firstName: 'Jane' };
      mockUserModel.findByIdAndUpdate.mockReturnValue(withSelect(updated));

      const result = await service.updateById('user123', { firstName: 'Jane' });
      expect(result).toEqual(updated);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserModel.findByIdAndUpdate.mockReturnValue(withSelect(null));

      await expect(service.updateById('nonexistent', { firstName: 'Jane' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ─── deleteById ──────────────────────────────────────────────────────────

  describe('deleteById', () => {
    it('should delete user successfully', async () => {
      mockUserModel.findByIdAndDelete.mockReturnValue(withExec(mockUserDoc));

      await expect(service.deleteById('user123')).resolves.not.toThrow();
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserModel.findByIdAndDelete.mockReturnValue(withExec(null));

      await expect(service.deleteById('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });
});
