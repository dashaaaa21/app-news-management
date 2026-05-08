import {
  Controller,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ─── Auth ────────────────────────────────────────────────────────────────

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Returns access and refresh tokens' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('User/refreshToken')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  refreshToken(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto.refreshToken);
  }

  @Post('forgotPassword')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send password reset email' })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Post('logout/:userId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  logout(@Param('userId') userId: string) {
    return this.authService.logout(userId);
  }

  // ─── Profile ─────────────────────────────────────────────────────────────

  @Post('changePassword')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change user password' })
  changePassword(@Body() dto: ChangePasswordDto, @Request() req: { user: { _id: string } }) {
    return this.authService.changePassword(req.user._id, dto);
  }

  @Post('updateProfile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile' })
  updateProfile(@Body() dto: UpdateProfileDto, @Request() req: { user: { _id: string } }) {
    return this.authService.updateProfile(req.user._id, dto);
  }

  @Post('updateUser')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user (alias for updateProfile)' })
  updateUser(@Body() dto: UpdateProfileDto, @Request() req: { user: { _id: string } }) {
    return this.authService.updateProfile(req.user._id, dto);
  }

  // ─── Upload ───────────────────────────────────────────────────────────────

  @Post('uploadProfilePicture')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload profile picture' })
  @UseInterceptors(FileInterceptor('file'))
  uploadProfilePicture(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: { user: { _id: string } },
  ) {
    return this.authService.uploadProfilePicture(req.user._id, file);
  }

  @Post('upload')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload file (alias)' })
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: { user: { _id: string } },
  ) {
    return this.authService.uploadProfilePicture(req.user._id, file);
  }
}
