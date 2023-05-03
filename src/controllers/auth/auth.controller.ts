import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthRequestDto } from 'src/dtos/auth.dto';
import { AuthService } from 'src/services/auth/auth.service';

@Controller('auth/')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() data: AuthRequestDto): Promise<object> {
    return this.authService.session(data);
  }

  @Get()
  @UseGuards(AuthGuard('google'))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req): Promise<{
    access_token: string;
  }> {
    return await this.authService.googleSession(req.user);
  }
}
