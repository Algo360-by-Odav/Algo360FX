import { User } from '../models/User';
import bcrypt from 'bcrypt';

interface CreateUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export class UserService {
  async findByEmail(email: string) {
    return User.findOne({ email });
  }

  async create(input: CreateUserInput) {
    const hashedPassword = await bcrypt.hash(input.password, 10);
    
    const user = new User({
      email: input.email,
      password: hashedPassword,
      firstName: input.firstName,
      lastName: input.lastName,
      emailVerified: false,
      preferences: {
        theme: 'light',
        notifications: true,
        language: 'en',
        riskLevel: 'medium',
        defaultLotSize: 0.01,
        tradingPairs: ['EUR/USD', 'GBP/USD', 'USD/JPY']
      }
    });

    await user.save();
    return user;
  }
}
