import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { access } from 'fs';

@Injectable()
export class AuthService {
    constructor( private prisma: PrismaService, private jwtService: JwtService) {}

    async registerAdmin(dto: CreateAdminDto) {
        const existingAdmin = await this.prisma.admin.findUnique({
            where: {email: dto.email}
        })

        if (existingAdmin) {
            throw new ConflictException('Email já cadastrado')
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10)

        return this.prisma.admin.create({
            data: {
                name: dto.name,
                email: dto.email,
                password: hashedPassword
            }
        })
    }

    // Felipe aqui
    async login(dto: LoginDto) {
        const { email, password } = dto

        const admin = await this.prisma.admin.findUnique({where:{ email }})

        if (admin) {
            const passwordCorrect = await bcrypt.compare(password, admin.password)

            if(!passwordCorrect) throw new UnauthorizedException('Credenciais inválidas!')

                const playLoad = { sub: admin.id, role: 'admin'}
                return {
                    access_token: await this.jwtService.signAsync(playLoad),
                    user: {
                        id: admin.id,
                        name: admin.name,
                        email: admin.email,
                        role: 'admin',
                    },
            }
        }
       const user = await this.prisma.user.findUnique({ where: { email } });

    if (user) {
      const senhaOk = await bcrypt.compare(password, user.password);
      if (!senhaOk) throw new UnauthorizedException('Credenciais inválidas');

      const payload = { sub: user.id, role: 'user' };

      return {
        access_token: await this.jwtService.signAsync(payload),
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: 'user',
        },
      };
    }

    throw new UnauthorizedException('Credenciais inválidas');
  } 
}
