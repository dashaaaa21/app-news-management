import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@ApiTags('News')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('api/news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  // GET /api/news
  @Get()
  @ApiOperation({ summary: 'Get all news' })
  @ApiResponse({ status: 200, description: 'Returns all news articles' })
  findAll() {
    return this.newsService.findAll();
  }

  // GET /api/news/:id
  @Get(':id')
  @ApiOperation({ summary: 'Get news by id' })
  @ApiResponse({ status: 200, description: 'Returns a news article' })
  @ApiResponse({ status: 404, description: 'News not found' })
  findOne(@Param('id') id: string) {
    return this.newsService.findById(id);
  }

  // POST /api/news
  @Post()
  @ApiOperation({ summary: 'Create news article' })
  @ApiResponse({ status: 201, description: 'News created successfully' })
  create(@Body() dto: CreateNewsDto) {
    return this.newsService.create(dto);
  }

  // PUT /api/news/:id
  @Put(':id')
  @ApiOperation({ summary: 'Update news article' })
  @ApiResponse({ status: 200, description: 'News updated successfully' })
  @ApiResponse({ status: 404, description: 'News not found' })
  update(@Param('id') id: string, @Body() dto: UpdateNewsDto) {
    return this.newsService.update(id, dto);
  }

  // DELETE /api/news/:id
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete news article' })
  @ApiResponse({ status: 200, description: 'News deleted successfully' })
  @ApiResponse({ status: 404, description: 'News not found' })
  async remove(@Param('id') id: string) {
    await this.newsService.delete(id);
    return { message: 'News deleted successfully' };
  }
}
