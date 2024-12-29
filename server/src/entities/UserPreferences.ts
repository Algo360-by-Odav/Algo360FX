import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';

@Entity('user_preferences')
export class UserPreferences extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  userId: string = '';

  @Column({ default: 'light' })
  theme: string = 'light';

  @Column('jsonb', { default: {} })
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  } = {
    email: false,
    push: false,
    sms: false
  };

  @Column({ default: 'H1' })
  defaultTimeframe: string = 'H1';

  @Column('jsonb', { default: [] })
  favoriteSymbols: string[] = [];

  @Column('jsonb', { default: {} })
  chartSettings: {
    indicators: string[];
    colors: {
      background: string;
      grid: string;
      text: string;
    };
  } = {
    indicators: [],
    colors: {
      background: '#ffffff',
      grid: '#e0e0e0',
      text: '#000000'
    }
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
