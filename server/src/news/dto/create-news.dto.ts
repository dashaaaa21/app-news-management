import { IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNewsDto {
    @ApiProperty()
    @IsString()
    @MinLength(5)
    title: string;

    @ApiProperty()
    @IsString()
    @MinLength(20)
    body: string;

    @ApiProperty()
    @IsString()
    @MinLength(2)
    author: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    image?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    category?: string;
}
// updated
