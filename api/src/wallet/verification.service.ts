import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

@Injectable()
export class VerificationService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  /**
   * Generate and store a verification code for withdrawal
   */
  async generateWithdrawalVerificationCode(userId: string, withdrawalId: string, verificationMethod: 'EMAIL' | 'SMS'): Promise<string> {
    // Generate a random 6-digit code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Hash the code for storage
    const hashedCode = this.hashVerificationCode(verificationCode);
    
    // Store verification request
    await this.prisma.withdrawalVerification.create({
      data: {
        id: uuidv4(),
        userId,
        withdrawalId,
        verificationMethod,
        verificationCode: hashedCode,
        isVerified: false,
        attempts: 0,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes expiry
      }
    });
    
    return verificationCode;
  }

  /**
   * Send verification code via email
   */
  async sendEmailVerification(userId: string, withdrawalId: string): Promise<boolean> {
    // Get user's email
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, firstName: true }
    });
    
    if (!user || !user.email) {
      throw new Error('User email not found');
    }
    
    // Generate verification code
    const verificationCode = await this.generateWithdrawalVerificationCode(userId, withdrawalId, 'EMAIL');
    
    // In a production environment, you would integrate with an email service like SendGrid or AWS SES
    // For demonstration purposes, we'll just log the email content
    console.log(`
      [SENDING EMAIL VERIFICATION]
      To: ${user.email}
      Subject: Verify Your Withdrawal - Algo360FX
      
      Dear ${user.firstName || 'User'},
      
      You have requested a withdrawal from your Algo360FX wallet. To confirm this action, please use the following verification code:
      
      ${verificationCode}
      
      This code will expire in 15 minutes.
      
      If you did not request this withdrawal, please contact our support team immediately.
      
      Regards,
      Algo360FX Team
    `);
    
    // In a real implementation, this would return the result from your email service
    return true;
  }

  /**
   * Send verification code via SMS
   */
  async sendSmsVerification(userId: string, withdrawalId: string): Promise<boolean> {
    // Get user's phone number
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { phoneNumber: true }
    });
    
    if (!user || !user.phoneNumber) {
      throw new Error('User phone number not found');
    }
    
    // Generate verification code
    const verificationCode = await this.generateWithdrawalVerificationCode(userId, withdrawalId, 'SMS');
    
    // In a production environment, you would integrate with an SMS service like Twilio
    // For demonstration purposes, we'll just log the SMS content
    console.log(`
      [SENDING SMS VERIFICATION]
      To: ${user.phoneNumber}
      
      Algo360FX: Your withdrawal verification code is: ${verificationCode}. This code will expire in 15 minutes.
    `);
    
    // In a real implementation, this would return the result from your SMS service
    return true;
  }

  /**
   * Verify a withdrawal using the provided verification code
   */
  async verifyWithdrawalCode(userId: string, withdrawalId: string, code: string): Promise<boolean> {
    // Find the verification record
    const verification = await this.prisma.withdrawalVerification.findFirst({
      where: {
        userId,
        withdrawalId,
        isVerified: false,
        expiresAt: {
          gt: new Date()
        }
      }
    });
    
    if (!verification) {
      throw new Error('Verification record not found or expired');
    }
    
    // Check if too many attempts
    if (verification.attempts >= 5) {
      throw new Error('Too many verification attempts. Please request a new code.');
    }
    
    // Hash the provided code and compare
    const hashedCode = this.hashVerificationCode(code);
    const isValid = verification.verificationCode === hashedCode;
    
    // Update attempt count
    await this.prisma.withdrawalVerification.update({
      where: { id: verification.id },
      data: {
        attempts: verification.attempts + 1,
        isVerified: isValid,
        verifiedAt: isValid ? new Date() : null
      }
    });
    
    return isValid;
  }

  /**
   * Hash verification code for secure storage
   */
  private hashVerificationCode(code: string): string {
    const salt = this.configService.get('VERIFICATION_SALT') || 'algo360fx-verification-salt';
    return crypto.createHmac('sha256', salt).update(code).digest('hex');
  }
}
