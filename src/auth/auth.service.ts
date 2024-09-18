import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/Prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) {}

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.prisma.user.findUnique({ where: { username } });
        if (user && (await bcrypt.compare(pass, user.password))) {
          const { password, ...result } = user;
          return result;
        }
        return null;
      }
    
      async login(user: any) {
        const payload = { username: user.username, sub: user.id };
        return {
          accessToken: this.jwtService.sign(payload),
        };
      }
    
      async register(username: string, password: string) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return this.prisma.user.create({
          data: {
            username,
            password: hashedPassword,
          },
        });
      }
}
