import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto): Promise<AuthResponseDto> {
    // Prevent duplicate accounts
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new BadRequestException('An account with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create org and user in a transaction — both succeed or both fail
    const user = await this.prisma.$transaction(async (tx) => {
      const org = await tx.organization.create({
        data: { name: dto.organizationName },
      });

      return tx.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          organizationId: org.id,
        },
        include: { organization: true },
      });
    });

    const token = this.generateToken(user.id, user.email);

    return {
      token,
      email: user.email,
      organizationName: user.organization.name,
    };
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { organization: true },
    });

    // Same message for both cases — don't reveal which field is wrong
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.generateToken(user.id, user.email);

    return {
      token,
      email: user.email,
      organizationName: user.organization.name,
    };
  }

  private generateToken(userId: number, email: string): string {
    const payload: JwtPayload = { sub: userId, email };
    return this.jwtService.sign(payload);
  }
}
