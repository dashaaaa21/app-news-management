import {
    IsEmail,
    IsString,
    MinLength,
    IsEnum,
    IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty()
    @IsString()
    firstName: string;

    @ApiProperty()
    @IsString()
    lastName: string;

    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    confirmPassword?: string;

    @ApiProperty({ enum: ['male', 'female', 'other'] })
    @IsEnum(['male', 'female', 'other'])
    gender: 'male' | 'female' | 'other';

    @ApiProperty()
    @IsString()
    dateOfBirth: string;

    @ApiProperty()
    @IsString()
    position: string;

    @ApiProperty()
    @IsString()
    hireDate: string;

    @ApiProperty()
    @IsString()
    phone: string;

    @ApiProperty({ enum: ['admin', 'user', 'manager'], default: 'user' })
    @IsOptional()
    @IsEnum(['admin', 'user', 'manager'])
    role?: 'admin' | 'user' | 'manager';
}
