import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ApiResponse } from '../common/dto/api-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    const data = await this.authService.signup(dto);
    return ApiResponse.ok('Account created successfully', data);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK) // POST defaults to 201, login should return 200
  async login(@Body() dto: LoginDto) {
    const data = await this.authService.login(dto);
    return ApiResponse.ok('Login successful', data);
  }
}
