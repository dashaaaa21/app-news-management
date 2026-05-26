import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { NewsService } from './news.service';
import { News } from './schemas/news.schema';

const mockNewsDoc = {
  _id: 'news123',
  title: 'Test News Title',
  body: 'This is a test news body with enough content.',
  author: 'John Doe',
  date: new Date().toISOString(),
  image: '',
  category: 'tech',
};

const withExec = (value: unknown) => ({ exec: jest.fn().mockResolvedValue(value) });
const withSort = (value: unknown) => ({
  sort: jest.fn().mockReturnValue(withExec(value)),
});

const mockNewsModel = {
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
};

describe('NewsService', () => {
  let service: NewsService;

  function MockNewsModel(data: Record<string, unknown>) {
    return {
      _id: mockNewsDoc._id,
      title: mockNewsDoc.title,
      body: mockNewsDoc.body,
      author: mockNewsDoc.author,
      date: mockNewsDoc.date,
      image: mockNewsDoc.image,
      category: mockNewsDoc.category,
      ...data,
      save: jest.fn().mockResolvedValue({ ...mockNewsDoc, ...(data as object) }),
    };
  }
  MockNewsModel.find = mockNewsModel.find;
  MockNewsModel.findById = mockNewsModel.findById;
  MockNewsModel.findByIdAndUpdate = mockNewsModel.findByIdAndUpdate;
  MockNewsModel.findByIdAndDelete = mockNewsModel.findByIdAndDelete;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NewsService,
        { provide: getModelToken(News.name), useValue: MockNewsModel },
      ],
    }).compile();

    service = module.get<NewsService>(NewsService);
    jest.clearAllMocks();
  });

  // ─── create ──────────────────────────────────────────────────────────────

  describe('create', () => {
    it('should create and return a news article', async () => {
      const dto = {
        title: 'Breaking News',
        body: 'This is the full body of the news article with enough text.',
        author: 'Reporter',
      };

      const result = await service.create(dto);

      expect(result.title).toBe(mockNewsDoc.title);
      expect(result.body).toBeDefined();
    });
  });

  // ─── findAll ─────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('should return all news sorted by createdAt desc', async () => {
      const newsList = [mockNewsDoc, { ...mockNewsDoc, _id: 'news456', title: 'Another News' }];
      mockNewsModel.find.mockReturnValue(withSort(newsList));

      const result = await service.findAll();
      expect(result).toEqual(newsList);
      expect(mockNewsModel.find).toHaveBeenCalled();
    });

    it('should return empty array when no news', async () => {
      mockNewsModel.find.mockReturnValue(withSort([]));

      const result = await service.findAll();
      expect(result).toEqual([]);
    });
  });

  // ─── findById ────────────────────────────────────────────────────────────

  describe('findById', () => {
    it('should return news by id', async () => {
      mockNewsModel.findById.mockReturnValue(withExec(mockNewsDoc));

      const result = await service.findById('news123');
      expect(result).toEqual(mockNewsDoc);
    });

    it('should throw NotFoundException if news not found', async () => {
      mockNewsModel.findById.mockReturnValue(withExec(null));

      await expect(service.findById('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  // ─── update ──────────────────────────────────────────────────────────────

  describe('update', () => {
    it('should update and return news article', async () => {
      const updated = { ...mockNewsDoc, title: 'Updated Title' };
      mockNewsModel.findByIdAndUpdate.mockReturnValue(withExec(updated));

      const result = await service.update('news123', { title: 'Updated Title' });
      expect(result.title).toBe('Updated Title');
    });

    it('should throw NotFoundException if news not found', async () => {
      mockNewsModel.findByIdAndUpdate.mockReturnValue(withExec(null));

      await expect(service.update('nonexistent', { title: 'Title' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ─── delete ──────────────────────────────────────────────────────────────

  describe('delete', () => {
    it('should delete news successfully', async () => {
      mockNewsModel.findByIdAndDelete.mockReturnValue(withExec(mockNewsDoc));

      await expect(service.delete('news123')).resolves.not.toThrow();
    });

    it('should throw NotFoundException if news not found', async () => {
      mockNewsModel.findByIdAndDelete.mockReturnValue(withExec(null));

      await expect(service.delete('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });
});
