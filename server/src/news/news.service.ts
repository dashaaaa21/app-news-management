import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { News, NewsDocument } from './schemas/news.schema';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@Injectable()
export class NewsService {
    constructor(
        @InjectModel(News.name) private readonly newsModel: Model<NewsDocument>,
    ) {}

    async create(dto: CreateNewsDto): Promise<NewsDocument> {
        const news = new this.newsModel(dto);
        return news.save();
    }

    async findAll(): Promise<NewsDocument[]> {
        return this.newsModel.find().sort({ createdAt: -1 }).exec();
    }

    async findById(id: string): Promise<NewsDocument> {
        const news = await this.newsModel.findById(id).exec();
        if (!news) throw new NotFoundException('News not found');
        return news;
    }

    async update(id: string, dto: UpdateNewsDto): Promise<NewsDocument> {
        const news = await this.newsModel
            .findByIdAndUpdate(id, dto, { new: true })
            .exec();
        if (!news) throw new NotFoundException('News not found');
        return news;
    }

    async delete(id: string): Promise<void> {
        const result = await this.newsModel.findByIdAndDelete(id).exec();
        if (!result) throw new NotFoundException('News not found');
    }
}
// updated
