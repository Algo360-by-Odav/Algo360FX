// Advanced Mining Store with comprehensive mining management features
import { makeAutoObservable, runInAction } from '../utils/mobxMock';

class MiningStore {
  // Observable state
  isLoading = false;
  lastAction = null;
  activeTab = 'dashboard';
  
  // Basic Mining Stats
  miningStats = {
    activeMiners: 3,
    totalHashrate: 450,
    dailyEarnings: 32.75,
    powerConsumption: 1250, // watts
    powerCost: 12.45, // dollars per day
    efficiency: 0.026, // dollars per watt
    uptime: 99.7, // percentage
  };

  // Individual Mining Equipment
  miningEquipment = [
    { 
      id: 'rig-001', 
      name: 'Primary Rig', 
      type: 'GPU',
      status: 'active', 
      hashrate: 250, 
      temperature: 62, 
      powerUsage: 650,
      lastMaintenance: '2025-04-15',
      gpu: 'NVIDIA RTX 4090',
      cores: 24,
      coins: ['ETH', 'RVN', 'ERGO'],
      alerts: [],
      location: 'Home Office'
    },
    { 
      id: 'rig-002', 
      name: 'Secondary Rig', 
      type: 'GPU',
      status: 'active', 
      hashrate: 150, 
      temperature: 58, 
      powerUsage: 450,
      lastMaintenance: '2025-05-01',
      gpu: 'AMD RX 7900 XT',
      cores: 20,
      coins: ['ETH', 'RVN', 'ERGO'],
      alerts: [{type: 'warning', message: 'Temperature increase detected'}],
      location: 'Home Office'
    },
    { 
      id: 'rig-003', 
      name: 'ASIC Miner', 
      type: 'ASIC',
      status: 'active', 
      hashrate: 50, 
      temperature: 72, 
      powerUsage: 150,
      lastMaintenance: '2025-03-20',
      model: 'Antminer S19 XP',
      coins: ['BTC'],
      alerts: [],
      location: 'Garage'
    },
    { 
      id: 'rig-004', 
      name: 'Test Rig', 
      type: 'GPU',
      status: 'offline', 
      hashrate: 0, 
      temperature: 0, 
      powerUsage: 0,
      lastMaintenance: '2025-02-10',
      gpu: 'NVIDIA RTX 3080',
      cores: 16,
      coins: ['ETH', 'RVN'],
      alerts: [{type: 'error', message: 'Connection lost'}],
      location: 'Workshop'
    }
  ];

  // Trading Stats
  tradingStats = {
    totalTrades: 128,
    profitLoss: 842.15,
    pendingSwaps: 2,
    autoTradingEnabled: true,
    tradingStrategy: 'smart',
    profitThreshold: 2.5,
    recentTrades: [
      { id: 'trade-001', from: 'ETH', to: 'USDT', amount: 0.35, value: 945.25, timestamp: '2025-05-27T14:30:00Z', status: 'completed' },
      { id: 'trade-002', from: 'BTC', to: 'USDT', amount: 0.02, value: 1125.80, timestamp: '2025-05-26T10:15:00Z', status: 'completed' },
      { id: 'trade-003', from: 'RVN', to: 'BTC', amount: 1250, value: 0.015, timestamp: '2025-05-28T09:45:00Z', status: 'pending' }
    ]
  };

  // Market Predictions from AI
  marketPredictions = {
    nextDayProfitability: [
      { coin: 'BTC', estimatedReturn: '+2.3%', prediction: 'high', confidence: 0.85 },
      { coin: 'ETH', estimatedReturn: '+1.7%', prediction: 'high', confidence: 0.75 },
      { coin: 'RVN', estimatedReturn: '-0.5%', prediction: 'low', confidence: 0.65 },
      { coin: 'ERGO', estimatedReturn: '+4.2%', prediction: 'high', confidence: 0.92 },
    ],
    recommendedActions: [
      { action: 'Switch to ERGO', impact: 'high', confidence: 0.92 },
      { action: 'Upgrade cooling', impact: 'medium', confidence: 0.75 },
    ]
  };

  // Knowledge Base with articles, videos, and resources
  // Settings for mining operations
  settings = {
    general: {
      theme: 'system',
      notifications: true,
      soundAlerts: true,
      autoUpdates: true,
      language: 'en',
      currency: 'USD',
      temperatureUnit: 'C',
      hashRateUnit: 'MH/s'
    },
    mining: {
      autoStart: true,
      autoRestart: true,
      idleDetection: true,
      minimumIdleTime: 10, // minutes
      stopOnUserActivity: false,
      powerManagement: 'balanced', // 'efficiency', 'balanced', 'performance'
      maxTemperature: 75,
      nightMode: {
        enabled: false,
        startTime: '22:00',
        endTime: '08:00',
        reducedPower: 70 // percent
      }
    },
    appearance: {
      compactView: false,
      darkMode: 'system', // 'always', 'never', 'system'
      showDetailedStats: true,
      animationsEnabled: true,
      accentColor: '#2196f3'
    },
    advanced: {
      enableOverclocking: false,
      manageExternalDevices: true,
      loggingLevel: 'info', // 'debug', 'info', 'warn', 'error'
      autoTuning: true,
      developerMode: false,
      customMiningParams: '',
      startWithOS: true,
      minimizeToTray: true,
      preventSleep: true,
      priority: {
        high: false,
        affinity: 'all-cores'
      },
      api: {
        enabled: false,
        port: 4000,
        readonly: true,
        allowRemote: false,
        token: ''
      }
    }
  };

  knowledgeBase = {
    articles: [
      {
        id: 'article-001',
        title: 'Optimizing Mining Efficiency',
        category: 'Efficiency',
        content: 'Learn how to optimize your mining operations for maximum efficiency and profitability.',
        datePublished: '2025-03-15',
        author: 'Alex Johnson',
        difficulty: 'intermediate',
        bookmarked: false,
        liked: false,
        tags: ['efficiency', 'optimization', 'profitability']
      },
      {
        id: 'article-002',
        title: 'Cooling Solutions for Mining Rigs',
        category: 'Hardware',
        content: 'Effective cooling solutions to keep your mining equipment running at optimal temperatures.',
        datePublished: '2025-04-22',
        author: 'Sarah Chen',
        difficulty: 'beginner',
        bookmarked: true,
        liked: true,
        tags: ['cooling', 'hardware', 'temperature']
      },
      {
        id: 'article-003',
        title: 'Advanced Mining Pool Strategies',
        category: 'Pools',
        content: 'Maximize your earnings with these advanced mining pool strategies and techniques.',
        datePublished: '2025-05-10',
        author: 'Michael Rodriguez',
        difficulty: 'advanced',
        bookmarked: false,
        liked: false,
        tags: ['pools', 'strategy', 'earnings']
      }
    ],
    videos: [
      {
        id: 'video-001',
        title: 'Setting Up Your First Mining Rig',
        thumbnail: 'https://via.placeholder.com/150',
        duration: '12:34',
        views: 45600,
        datePublished: '2025-02-18',
        channel: 'CryptoMiners',
        bookmarked: false
      },
      {
        id: 'video-002',
        title: 'GPU vs ASIC Mining Explained',
        thumbnail: 'https://via.placeholder.com/150',
        duration: '8:47',
        views: 32400,
        datePublished: '2025-03-05',
        channel: 'Mining Masters',
        bookmarked: true
      },
      {
        id: 'video-003',
        title: 'Maximizing ROI in Cryptocurrency Mining',
        thumbnail: 'https://via.placeholder.com/150',
        duration: '15:21',
        views: 28900,
        datePublished: '2025-04-12',
        channel: 'CryptoMiners',
        bookmarked: false
      }
    ],
    categories: ['Efficiency', 'Hardware', 'Pools', 'Security', 'Profitability', 'Basics']
  };

  // Mining Pool Data
  poolStats = {
    currentPool: 'Flexpool',
    availablePools: ['Flexpool', 'Ethermine', 'F2Pool', 'HiveOn', 'NiceHash'],
    poolPerformance: [
      { name: 'Flexpool', hashrate: 450, workers: 3, lastPayout: '2025-05-27T12:00:00Z', fee: '1%', efficiency: 0.95 },
      { name: 'Ethermine', hashrate: 0, workers: 0, lastPayout: '2025-05-10T12:00:00Z', fee: '1%', efficiency: 0.93 },
      { name: 'F2Pool', hashrate: 0, workers: 0, lastPayout: '2025-04-15T12:00:00Z', fee: '2%', efficiency: 0.92 },
      { name: 'HiveOn', hashrate: 0, workers: 0, lastPayout: null, fee: '0.9%', efficiency: 0.94 },
      { name: 'NiceHash', hashrate: 0, workers: 0, lastPayout: null, fee: 'variable', efficiency: 0.91 }
    ],
    payoutHistory: [
      { date: '2025-05-27', pool: 'Flexpool', coin: 'ETH', amount: 0.05, usdValue: 142.50, status: 'confirmed', txHash: '0x72f8d37b9a1234...' },
      { date: '2025-05-26', pool: 'Flexpool', coin: 'ETH', amount: 0.048, usdValue: 136.80, status: 'confirmed', txHash: '0x58a7c46d3b5678...' },
      { date: '2025-05-25', pool: 'Flexpool', coin: 'ETH', amount: 0.052, usdValue: 148.20, status: 'confirmed', txHash: '0x91b3e27c4f9012...' },
      { date: '2025-05-24', pool: 'Flexpool', coin: 'ETH', amount: 0.047, usdValue: 133.95, status: 'confirmed', txHash: '0x37d9f81a2e7456...' }
    ],
    payoutSettings: {
      ETH: { threshold: 0.05, currentBalance: 0.028, schedule: 'Daily at 12:00 UTC' },
      BTC: { threshold: 0.001, currentBalance: 0.0005, schedule: 'Daily at 14:00 UTC' },
      RVN: { threshold: 100, currentBalance: 65, schedule: 'Daily at 16:00 UTC' },
      gasLimit: 40 // in Gwei for ETH payouts
    }
  };

  // Network Status
  networkStatus = {
    networks: [
      { coin: 'ETH', networkHashrate: '1.24 PH/s', blockReward: '2.0 ETH', difficulty: 12450678, nextDifficultyChange: '-2.3%', contribution: 0.005 },
      { coin: 'BTC', networkHashrate: '458 EH/s', blockReward: '6.25 BTC', difficulty: 67890123456, nextDifficultyChange: '+1.8%', contribution: 0.001 },
      { coin: 'RVN', networkHashrate: '4.5 TH/s', blockReward: '2500 RVN', difficulty: 987654, nextDifficultyChange: '+0.5%', contribution: 0.008 },
      { coin: 'ERGO', networkHashrate: '28.7 TH/s', blockReward: '42 ERG', difficulty: 3456789, nextDifficultyChange: '-1.2%', contribution: 0.012 }
    ],
    connections: {
      primary: { status: 'connected', ping: 23, lastChecked: '2025-05-28T09:15:00Z' },
      backup: { status: 'standby', ping: 45, lastChecked: '2025-05-28T09:15:00Z' }
    },
    issues: [],
    lastUpdated: '2025-05-28T09:15:00Z',
    healthScore: 98, // overall network health percentage
    nextUpdate: '2025-05-28T10:15:00Z'
  };

  // Financial Reports
  financialReports = {
    monthlyReport: {
      month: 'May',
      year: 2025,
      totalRevenue: 1250.75,
      totalCosts: 390.25,
      netProfit: 860.50,
      roi: 220.5, // percentage
      miningBreakdown: { ETH: 65, BTC: 25, RVN: 5, ERGO: 5 },
      powerCost: 375.80,
      hardwareCost: 14.45, // depreciation
      taxLiability: 215.20
    },
    yearlyProjection: {
      year: 2025,
      projectedRevenue: 15250.00,
      projectedCosts: 4800.00,
      projectedProfit: 10450.00,
      roi: 218.75, // percentage
      breakEvenDate: '2025-09-15'
    }
  };

  // Team Stats & Management
  teamStats = {
    teamName: 'Alpha Miners',
    teamId: 'team-001',
    teamRank: 345, // out of all mining teams
    members: [
      { id: 'user-001', name: 'John Doe', role: 'admin', contribution: 250, share: 55, earnings: 18.01, email: 'john@example.com' },
      { id: 'user-002', name: 'Jane Smith', role: 'member', contribution: 150, share: 35, earnings: 11.46, email: 'jane@example.com' },
      { id: 'user-003', name: 'Bob Johnson', role: 'member', contribution: 50, share: 10, earnings: 3.28, email: 'bob@example.com' }
    ],
    totalHashrate: 450,
    distributions: [
      { date: '2025-05-27', totalAmount: 32.75, shares: [
        { userId: 'user-001', amount: 18.01 },
        { userId: 'user-002', amount: 11.46 },
        { userId: 'user-003', amount: 3.28 }
      ]}
    ],
    leaderboard: {
      top10: [
        { rank: 1, name: 'Hashrate Heroes', hashrate: '12.5 GH/s' },
        { rank: 2, name: 'Crypto Miners United', hashrate: '8.7 GH/s' },
        { rank: 3, name: 'BlockChampions', hashrate: '6.2 GH/s' }
      ]
    },
    settings: {
      publicProfile: true,
      automaticPayouts: true,
      notifications: true,
      profitDistributionModel: 'contribution-based' // or 'equal', 'custom'
    },
    performance: {
      weeklyGrowth: 2.3, // percentage
      monthlyGrowth: 8.7, // percentage
      efficiency: 'medium', // high, medium, low
      uptime: 99.2 // percentage
    },
    lastUpdated: '2025-05-28T09:30:00Z'
  };

  // Knowledge Base
  knowledgeBase = {
    tutorials: [
      { id: 'tut-001', title: 'Optimizing GPU Mining', level: 'intermediate', views: 1254, rating: 4.7 },
      { id: 'tut-002', title: 'Setting Up Your First Mining Rig', level: 'beginner', views: 3254, rating: 4.9 },
      { id: 'tut-003', title: 'Advanced ASIC Maintenance', level: 'advanced', views: 854, rating: 4.6 },
      { id: 'tut-004', title: 'Tax Strategies for Miners', level: 'intermediate', views: 1654, rating: 4.5 },
      { id: 'tut-005', title: 'Pool Hopping Strategy', level: 'advanced', views: 954, rating: 4.4 }
    ],
    hardwareReviews: [
      { id: 'hw-001', title: 'NVIDIA RTX 4090 for Mining', rating: 4.8, efficiency: 'Excellent', price: 'High', recommendation: 'Highly Recommended' },
      { id: 'hw-002', title: 'AMD RX 7900 XT Review', rating: 4.6, efficiency: 'Very Good', price: 'Medium', recommendation: 'Recommended' },
      { id: 'hw-003', title: 'Antminer S19 XP Analysis', rating: 4.7, efficiency: 'Excellent', price: 'Very High', recommendation: 'For Professionals' }
    ]
  };

  // Settings and Preferences
  settings = {
    notifications: {
      email: true,
      push: true,
      sms: false,
      alerts: {
        equipment: true,
        profitability: true,
        payouts: true,
        marketChanges: true
      }
    },
    autoSwitching: {
      enabled: true,
      minProfitThreshold: 5, // percentage
      switchingDelay: 30 // minutes
    },
    displayUnits: {
      hashrate: 'MH/s',
      currency: 'USD',
      temperature: 'Celsius'
    },
    darkMode: true,
    advancedMode: true
  };

  isLoading = false;

  constructor() {
    // Instead of using makeObservable with individual properties,
    // use makeAutoObservable which makes all properties observable by default
    makeAutoObservable(this);
    
    // Start data fetching intervals
    this.startDataFetching();
  }

  // Computed properties
  get totalDailyProfit() {
    return this.miningStats.dailyEarnings - this.miningStats.powerCost;
  }

  get mostProfitableCoin() {
    if (!this.marketPredictions.nextDayProfitability.length) return null;
    return this.marketPredictions.nextDayProfitability.reduce((prev, current) => {
      const prevReturn = parseFloat(prev.estimatedReturn);
      const currentReturn = parseFloat(current.estimatedReturn);
      return prevReturn > currentReturn ? prev : current;
    });
  }

  get systemHealth() {
    const offlineCount = this.miningEquipment.filter(equip => equip.status === 'offline').length;
    const warningCount = this.miningEquipment.reduce((count, equip) => 
      count + equip.alerts.filter(alert => alert.type === 'warning').length, 0);
    const errorCount = this.miningEquipment.reduce((count, equip) => 
      count + equip.alerts.filter(alert => alert.type === 'error').length, 0);
    
    if (errorCount > 0) return 'critical';
    if (offlineCount > 0 || warningCount > 1) return 'warning';
    if (warningCount === 1) return 'attention';
    return 'healthy';
  }

  // Actions
  fetchMiningStats() {
    this.isLoading = true;
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, you would fetch from API
      // Update with slight variations to simulate real-time changes
      this.miningStats = {
        ...this.miningStats,
        totalHashrate: this.miningStats.totalHashrate + (Math.random() * 10 - 5),
        dailyEarnings: this.miningStats.dailyEarnings + (Math.random() * 2 - 1),
        uptime: Math.min(100, this.miningStats.uptime + (Math.random() * 0.5 - 0.1))
      };
      
      this.isLoading = false;
    }, 1000);
  }

  fetchTradingStats() {
    this.isLoading = true;
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, you would fetch from API
      this.tradingStats = {
        ...this.tradingStats,
        totalTrades: this.tradingStats.totalTrades + (Math.random() > 0.7 ? 1 : 0),
        profitLoss: this.tradingStats.profitLoss + (Math.random() * 10 - 3)
      };
      
      this.isLoading = false;
    }, 800);
  }

  fetchMarketPredictions() {
    this.isLoading = true;
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, you would fetch from API
      // Simulate changes to predictions
      const updatedPredictions = this.marketPredictions.nextDayProfitability.map(pred => {
        const change = (Math.random() * 1 - 0.5).toFixed(1);
        const currentReturn = parseFloat(pred.estimatedReturn);
        return {
          ...pred,
          confidence: Math.min(0.99, Math.max(0.5, pred.confidence + (Math.random() * 0.1 - 0.05))),
          estimatedReturn: (currentReturn + parseFloat(change)).toFixed(1) + '%'
        };
      });
      
      this.marketPredictions = {
        ...this.marketPredictions,
        nextDayProfitability: updatedPredictions
      };
      
      this.isLoading = false;
    }, 1200);
  }

  updateMiningEquipment(equipmentId, updates) {
    const index = this.miningEquipment.findIndex(eq => eq.id === equipmentId);
    if (index !== -1) {
      this.miningEquipment[index] = {
        ...this.miningEquipment[index],
        ...updates
      };
    }
  }

  switchPool(poolName) {
    // In real app, this would handle the process of switching mining pools
    this.isLoading = true;
    
    setTimeout(() => {
      // Update current pool
      this.poolStats.currentPool = poolName;
      
      // Update pool performance
      const poolPerformance = this.poolStats.poolPerformance.map(pool => {
        if (pool.name === poolName) {
          return {
            ...pool,
            hashrate: this.miningStats.totalHashrate,
            workers: this.miningStats.activeMiners
          };
        } else if (pool.name === this.poolStats.currentPool) {
          return {
            ...pool,
            hashrate: 0,
            workers: 0
          };
        }
        return pool;
      });
      
      this.poolStats.poolPerformance = poolPerformance;
      this.isLoading = false;
      
      // Notify UI of pool change
      this.lastAction = {
        type: 'POOL_SWITCH',
        message: `Successfully switched to ${poolName}`,
        timestamp: new Date().toISOString()
      };
    }, 1500);
  }

  updateSettings(newSettings) {
    this.settings = {
      ...this.settings,
      ...newSettings
    };
  }

  startMining(equipmentId) {
    const index = this.miningEquipment.findIndex(eq => eq.id === equipmentId);
    if (index !== -1) {
      this.miningEquipment[index].status = 'starting';
      
      // Simulate startup delay
      setTimeout(() => {
        this.miningEquipment[index].status = 'active';
        this.miningEquipment[index].hashrate = this.miningEquipment[index].type === 'GPU' ? 
          (Math.random() * 50 + 150) : (Math.random() * 20 + 40);
        this.miningEquipment[index].temperature = Math.floor(Math.random() * 15 + 55);
        this.miningEquipment[index].powerUsage = this.miningEquipment[index].type === 'GPU' ? 
          (Math.random() * 50 + 400) : (Math.random() * 30 + 130);
          
        // Update total hashrate
        this.miningStats.activeMiners = this.miningEquipment.filter(eq => eq.status === 'active').length;
        this.miningStats.totalHashrate = this.miningEquipment
          .filter(eq => eq.status === 'active')
          .reduce((sum, eq) => sum + eq.hashrate, 0);
      }, 3000);
    }
  }

  stopMining(equipmentId) {
    const index = this.miningEquipment.findIndex(eq => eq.id === equipmentId);
    if (index !== -1) {
      this.miningEquipment[index].status = 'stopping';
      
      // Simulate shutdown delay
      setTimeout(() => {
        this.miningEquipment[index].status = 'offline';
        this.miningEquipment[index].hashrate = 0;
        this.miningEquipment[index].temperature = 0;
        this.miningEquipment[index].powerUsage = 0;
        
        // Update total hashrate
        this.miningStats.activeMiners = this.miningEquipment.filter(eq => eq.status === 'active').length;
        this.miningStats.totalHashrate = this.miningEquipment
          .filter(eq => eq.status === 'active')
          .reduce((sum, eq) => sum + eq.hashrate, 0);
      }, 2000);
    }
  }

  restartMiningRig(equipmentId) {
    const index = this.miningEquipment.findIndex(eq => eq.id === equipmentId);
    if (index !== -1) {
      this.miningEquipment[index].status = 'restarting';
      
      // Simulate restart sequence
      setTimeout(() => {
        this.miningEquipment[index].status = 'offline';
        this.miningEquipment[index].hashrate = 0;
        this.miningEquipment[index].temperature = 0;
        this.miningEquipment[index].powerUsage = 0;
        
        setTimeout(() => {
          this.miningEquipment[index].status = 'starting';
          
          setTimeout(() => {
            this.miningEquipment[index].status = 'active';
            this.miningEquipment[index].hashrate = this.miningEquipment[index].type === 'GPU' ? 
              (Math.random() * 50 + 150) : (Math.random() * 20 + 40);
            this.miningEquipment[index].temperature = Math.floor(Math.random() * 15 + 55);
            this.miningEquipment[index].powerUsage = this.miningEquipment[index].type === 'GPU' ? 
              (Math.random() * 50 + 400) : (Math.random() * 30 + 130);
              
            // Clear alerts
            this.miningEquipment[index].alerts = [];
            
            // Update total hashrate
            this.miningStats.activeMiners = this.miningEquipment.filter(eq => eq.status === 'active').length;
            this.miningStats.totalHashrate = this.miningEquipment
              .filter(eq => eq.status === 'active')
              .reduce((sum, eq) => sum + eq.hashrate, 0);
          }, 2000);
        }, 1000);
      }, 1000);
    }
  }

  // Team Management Methods
  addTeamMember(member) {
    // Check if email already exists
    const existingMemberIndex = this.teamStats.members.findIndex(m => m.email === member.email);
    if (existingMemberIndex !== -1) {
      return { success: false, message: 'Member with this email already exists' };
    }
    
    // Add new member with default values
    const newMember = {
      id: `user-${Date.now()}`,
      name: member.name,
      email: member.email,
      role: member.role || 'member',
      contribution: member.contribution || 0,
      share: member.share || 0,
      earnings: member.earnings || 0
    };
    
    this.teamStats.members.push(newMember);
    
    // Update team hashrate if member has contribution
    if (newMember.contribution > 0) {
      this.teamStats.totalHashrate += newMember.contribution;
    }
    
    this.lastAction = {
      type: 'TEAM_MEMBER_ADDED',
      message: `Added ${newMember.name} to the team`,
      timestamp: new Date().toISOString()
    };
    
    return { success: true, member: newMember };
  }
  
  removeTeamMember(memberId) {
    const memberIndex = this.teamStats.members.findIndex(m => m.id === memberId);
    if (memberIndex === -1) {
      return { success: false, message: 'Member not found' };
    }
    
    const member = this.teamStats.members[memberIndex];
    
    // Remove member from array
    this.teamStats.members.splice(memberIndex, 1);
    
    // Update team hashrate
    this.teamStats.totalHashrate -= member.contribution;
    
    this.lastAction = {
      type: 'TEAM_MEMBER_REMOVED',
      message: `Removed ${member.name} from the team`,
      timestamp: new Date().toISOString()
    };
    
    return { success: true };
  }
  
  updateTeamMember(memberId, updates) {
    const memberIndex = this.teamStats.members.findIndex(m => m.id === memberId);
    if (memberIndex === -1) {
      return { success: false, message: 'Member not found' };
    }
    
    const oldContribution = this.teamStats.members[memberIndex].contribution;
    
    // Update member properties
    this.teamStats.members[memberIndex] = {
      ...this.teamStats.members[memberIndex],
      ...updates
    };
    
    // Update team hashrate if contribution changed
    if (updates.hasOwnProperty('contribution') && updates.contribution !== oldContribution) {
      this.teamStats.totalHashrate = this.teamStats.totalHashrate - oldContribution + updates.contribution;
    }
    
    this.lastAction = {
      type: 'TEAM_MEMBER_UPDATED',
      message: `Updated ${this.teamStats.members[memberIndex].name}'s information`,
      timestamp: new Date().toISOString()
    };
    
    return { success: true, member: this.teamStats.members[memberIndex] };
  }
  
  // Network and Pool Methods
  fetchNetworkStatus() {
    this.isLoading = true;
    
    // Simulate API call
    setTimeout(() => {
      // Update network hashrates with small fluctuations
      this.networkStatus.networks = this.networkStatus.networks.map(network => ({
        ...network,
        difficulty: Math.floor(network.difficulty * (1 + (Math.random() * 0.02 - 0.01))),
        nextDifficultyChange: `${(Math.random() * 4 - 2).toFixed(1)}%`
      }));
      
      // Update connection status
      this.networkStatus.connections.primary.ping = Math.floor(Math.random() * 30 + 15);
      this.networkStatus.connections.backup.ping = Math.floor(Math.random() * 30 + 35);
      this.networkStatus.lastUpdated = new Date().toISOString();
      
      // Random chance of network issue
      if (Math.random() > 0.95) {
        this.networkStatus.issues.push({
          id: `issue-${Date.now()}`,
          type: 'latency',
          severity: 'warning',
          message: 'Higher than normal network latency detected',
          timestamp: new Date().toISOString()
        });
      } else if (this.networkStatus.issues.length > 0 && Math.random() > 0.7) {
        // Clear a random issue
        this.networkStatus.issues.pop();
      }
      
      this.isLoading = false;
    }, 1000);
  }
  
  updatePayoutSettings(settings) {
    this.poolStats.payoutSettings = {
      ...this.poolStats.payoutSettings,
      ...settings
    };
    
    this.lastAction = {
      type: 'PAYOUT_SETTINGS_UPDATED',
      message: 'Payout settings updated successfully',
      timestamp: new Date().toISOString()
    };
    
    return { success: true };
  }
  
  fetchTeamStats() {
    this.isLoading = true;
    
    // Simulate API call
    setTimeout(() => {
      // Update earnings for team members with small fluctuations
      this.teamStats.members = this.teamStats.members.map(member => ({
        ...member,
        earnings: parseFloat((member.earnings * (1 + (Math.random() * 0.04 - 0.02))).toFixed(2))
      }));
      
      // Update team performance metrics
      this.teamStats.performance.weeklyGrowth = parseFloat((this.teamStats.performance.weeklyGrowth + (Math.random() * 0.4 - 0.2)).toFixed(1));
      this.teamStats.performance.uptime = Math.min(100, parseFloat((this.teamStats.performance.uptime + (Math.random() * 0.2 - 0.1)).toFixed(1)));
      this.teamStats.lastUpdated = new Date().toISOString();
      
      this.isLoading = false;
    }, 1200);
  }
  
  setActiveTab(tab) {
    this.activeTab = tab;
  }
  
  // Computed properties for team and network
  get teamPerformance() {
    return {
      averageContribution: this.teamStats.members.length > 0 ? 
        this.teamStats.totalHashrate / this.teamStats.members.length : 0,
      totalEarnings: this.teamStats.members.reduce((sum, member) => sum + member.earnings, 0),
      memberCount: this.teamStats.members.length,
      efficiencyRating: this.teamStats.performance.efficiency
    };
  }
  
  get networkHealthStatus() {
    const issues = this.networkStatus.issues.length;
    const primaryStatus = this.networkStatus.connections.primary.status === 'connected';
    const primaryPing = this.networkStatus.connections.primary.ping;
    
    if (issues > 2 || !primaryStatus) {
      return 'warning';
    } else if (issues > 0 || primaryPing > 100) {
      return 'moderate';
    } else {
      return 'good';
    }
  }
  
  // Data fetching interval setup
  startDataFetching() {
    // Fetch initial data
    this.fetchMiningStats();
    this.fetchTradingStats();
    this.fetchMarketPredictions();
    this.fetchNetworkStatus();
    this.fetchTeamStats();
    
    // Set up intervals for regular updates
    setInterval(() => this.fetchMiningStats(), 30000); // 30 seconds
    setInterval(() => this.fetchTradingStats(), 45000); // 45 seconds
    setInterval(() => this.fetchMarketPredictions(), 300000); // 5 minutes
    setInterval(() => this.fetchNetworkStatus(), 60000); // 1 minute
    setInterval(() => this.fetchTeamStats(), 120000); // 2 minutes
  }
}

// Create and export a singleton instance
export const miningStore = new MiningStore();
