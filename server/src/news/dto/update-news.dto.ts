import { IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateNewsDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @MinLength(5)
    title?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    body?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    author?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    image?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    category?: string;
}
