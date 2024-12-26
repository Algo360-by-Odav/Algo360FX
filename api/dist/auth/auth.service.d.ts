import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            username: string;
            firstName: string;
            lastName: string;
        };
    }>;
    validateUser(email: string, password: string): Promise<{
        email: string;
        username: string;
        password: string;
        firstName: string | null;
        lastName: string | null;
        id: string;
        isVerified: boolean;
        role: import(".prisma/client").$Enums.Role;
        preferences: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    login(loginDto: LoginDto): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            username: string;
            firstName: string;
            lastName: string;
        };
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
}
