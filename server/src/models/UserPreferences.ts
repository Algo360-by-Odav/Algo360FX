import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('user_preferences')
export class UserPreferences {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', default: 'light' })
  theme: string;

  @Column({ type: 'boolean', default: true })
  notifications: boolean;

  @Column({ type: 'varchar', default: 'en' })
  language: string;

  @Column({ type: 'varchar', default: 'UTC' })
  timezone: string;

  @Column({ type: 'jsonb', nullable: true })
  chartPreferences?: {
    defaultTimeframe?: string;
    indicators?: string[];
    layout?: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  tradingPreferences?: {
    defaultLotSize?: number;
    riskPercentage?: number;
    defaultStopLoss?: number;
    defaultTakeProfit?: number;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
