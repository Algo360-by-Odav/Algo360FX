import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class UserPreferences {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  userId: string;

  @Column({ default: 'light' })
  theme: string;

  @Column('jsonb', {
    default: {
      email: true,
      push: true,
      trading: true
    }
  })
  notifications: {
    email: boolean;
    push: boolean;
    trading: boolean;
  };

  @Column({ default: '1h' })
  defaultTimeframe: string;

  @Column('jsonb', { default: ['EURUSD', 'GBPUSD', 'USDJPY'] })
  favoriteSymbols: string[];

  @Column('jsonb', {
    default: {
      showVolume: true,
      showIndicators: true,
      defaultIndicators: ['MA', 'RSI']
    }
  })
  chartSettings: {
    showVolume: boolean;
    showIndicators: boolean;
    defaultIndicators: string[];
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
