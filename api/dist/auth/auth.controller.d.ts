import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    getProfile(req: any): Promise<any>;
    logout(req: any): Promise<{
        message: string;
    }>;
}
