import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from '../auth/dto/register.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: RegisterDto & {
        password: string;
    }): Promise<{
        email: string;
        username: string;
        firstName: string;
        lastName: string;
        id: string;
        isVerified: boolean;
        role: import(".prisma/client").$Enums.Role;
        preferences: import("@prisma/client/runtime/library").JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findByEmail(email: string): Promise<{
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
    findById(id: string): Promise<{
        email: string;
        username: string;
        firstName: string;
        lastName: string;
        id: string;
        isVerified: boolean;
        role: import(".prisma/client").$Enums.Role;
        preferences: import("@prisma/client/runtime/library").JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
