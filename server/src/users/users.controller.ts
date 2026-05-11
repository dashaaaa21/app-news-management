import {
    Controller,
    Get,
    Put,
    Delete,
    Param,
    Body,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    @ApiOperation({ summary: 'Get all users' })
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get user by id' })
    findOne(@Param('id') id: string) {
        return this.usersService.findById(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update user by id' })
    update(@Param('id') id: string, @Body() body: Record<string, unknown>) {
        return this.usersService.updateById(id, body);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete user by id' })
    async remove(@Param('id') id: string) {
        await this.usersService.deleteById(id);
        return { message: 'User deleted successfully' };
    }
}
