import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import { IUser } from '../types/User';

export class UserService {
  private static readonly SALT_ROUNDS = 10;

  static async createUser(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    if (userData.password) {
      user.password = await bcrypt.hash(userData.password, this.SALT_ROUNDS);
    }
    await user.save();
    return user;
  }

  static async getUserByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email });
  }

  static async getUserByUsername(username: string): Promise<IUser | null> {
    return User.findOne({ username });
  }

  static async getUserById(id: string): Promise<IUser | null> {
    return User.findById(id);
  }

  static async updateUser(id: string, updates: Partial<IUser>): Promise<IUser | null> {
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, this.SALT_ROUNDS);
    }
    return User.findByIdAndUpdate(id, updates, { new: true });
  }

  static async updatePreferences(id: string, preferences: IUser['preferences']): Promise<IUser | null> {
    return User.findByIdAndUpdate(
      id,
      { preferences },
      { new: true }
    );
  }

  static async deleteUser(id: string): Promise<boolean> {
    const result = await User.findByIdAndDelete(id);
    return !!result;
  }

  static async verifyEmail(id: string): Promise<IUser | null> {
    return User.findByIdAndUpdate(
      id,
      { emailVerified: true },
      { new: true }
    );
  }

  static async updatePassword(id: string, currentPassword: string, newPassword: string): Promise<IUser | null> {
    const user = await User.findById(id).select('+password');
    if (!user) {
      throw new Error('User not found');
    }

    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      throw new Error('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, this.SALT_ROUNDS);
    return User.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );
  }

  static async listUsers(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find().skip(skip).limit(limit),
      User.countDocuments()
    ]);
    
    return {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  static async updateProfile(userId: string, updates: Partial<IUser>) {
    // Remove sensitive fields from updates
    const { password, email, role, ...safeUpdates } = updates;
    return User.findByIdAndUpdate(userId, safeUpdates, { new: true });
  }
}
