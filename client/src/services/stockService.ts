import { apiService } from './api';

export interface StockQuote {
  symbol: string;
  companyName: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  exchange: string;
  timestamp: string;
}

export interface StockProfile {
  symbol: string;
  companyName: string;
  exchange: string;
  industry: string;
  website: string;
  description: string;
  CEO: string;
  sector: string;
  employees: number;
  country: string;
}

class StockService {
  private static instance: StockService;
  private baseUrl = '/stocks';
  
  // Stock Categories
  private stocksByMarket = {
    US: [
      'AAPL',  // Apple
      'MSFT',  // Microsoft
      'GOOGL', // Alphabet
      'AMZN',  // Amazon
      'META',  // Meta (Facebook)
      'TSLA',  // Tesla
      'NVDA',  // NVIDIA
      'JPM',   // JPMorgan Chase
      'BAC',   // Bank of America
      'WMT',   // Walmart
    ],
    MY: [
      'MAYBANK.KL',   // Malayan Banking Berhad
      'PBBANK.KL',    // Public Bank Berhad
      'TENAGA.KL',    // Tenaga Nasional Berhad
      'PCHEM.KL',     // Petronas Chemicals Group Berhad
      'CIMB.KL',      // CIMB Group Holdings Berhad
      'TOPGLOV.KL',   // Top Glove Corporation Bhd
      'AXIATA.KL',    // Axiata Group Berhad
      'DIGI.KL',      // Digi.Com Berhad
      'MAXIS.KL',     // Maxis Berhad
      'GENTING.KL',   // Genting Berhad
    ],
    NG: [
      'DANGCEM.LG',   // Dangote Cement Plc
      'MTNN.LG',      // MTN Nigeria Communications Plc
      'BUACEMENT.LG', // BUA Cement Plc
      'AIRTEL.LG',    // Airtel Africa Plc
      'GTCO.LG',      // Guaranty Trust Holding Co Plc
      'ZENITHBA.LG',  // Zenith Bank Plc
      'BUAFOODS.LG',  // BUA Foods Plc
      'NESTLE.LG',    // Nestle Nigeria Plc
      'FBNH.LG',      // FBN Holdings Plc
      'UBA.LG',       // United Bank for Africa Plc
    ],
    ZA: [
      'NPN.JO',    // Naspers Limited
      'BTI.JO',    // British American Tobacco
      'FSR.JO',    // FirstRand Limited
      'SBK.JO',    // Standard Bank Group
      'MTN.JO',    // MTN Group Limited
      'VOD.JO',    // Vodacom Group
      'AGL.JO',    // Anglo American Plc
      'CPI.JO',    // Capitec Bank Holdings
      'SLM.JO',    // Sanlam Limited
      'ABG.JO',    // Absa Group Limited
    ],
    KE: [
      'SCOM.NR',   // Safaricom Plc
      'EQTY.NR',   // Equity Group Holdings
      'KCB.NR',    // KCB Group Plc
      'EABL.NR',   // East African Breweries
      'BATK.NR',   // BAT Kenya Plc
      'COOP.NR',   // Co-operative Bank
      'SCBK.NR',   // Standard Chartered Kenya
      'NCBA.NR',   // NCBA Group Plc
      'BAMB.NR',   // Bamburi Cement
      'JUBILEE.NR',// Jubilee Holdings
    ],
    JP: [
      '7203.T',    // Toyota Motor Corporation
      '9984.T',    // SoftBank Group Corp
      '6758.T',    // Sony Group Corporation
      '9432.T',    // Nippon Telegraph & Telephone
      '7974.T',    // Nintendo Co Ltd
      '6861.T',    // Keyence Corporation
      '8306.T',    // Mitsubishi UFJ Financial
      '6367.T',    // Daikin Industries Ltd
      '6501.T',    // Hitachi Ltd
      '9433.T',    // KDDI Corporation
    ],
    KR: [
      '005930.KS', // Samsung Electronics
      '000660.KS', // SK Hynix
      '005935.KS', // Samsung Electronics Pref.
      '005380.KS', // Hyundai Motor
      '051910.KS', // LG Chem
      '035420.KS', // NAVER
      '000270.KS', // Kia Corporation
      '005490.KS', // POSCO
      '035720.KS', // Kakao
      '055550.KS', // Shinhan Financial Group
    ],
    CN: [
      '601318.SS', // Ping An Insurance
      '600519.SS', // Kweichow Moutai
      '601988.SS', // Bank of China
      '600036.SS', // China Merchants Bank
      '601628.SS', // China Life Insurance
      '000858.SZ', // Wuliangye Yibin
      '000333.SZ', // Midea Group
      '002594.SZ', // BYD Company
      '600276.SS', // Jiangsu Hengrui Medicine
      '601398.SS', // ICBC
    ],
    IN: [
      'RELIANCE.BO',  // Reliance Industries
      'TCS.BO',       // Tata Consultancy Services
      'HDFCBANK.BO',  // HDFC Bank
      'INFY.BO',      // Infosys
      'HINDUNILVR.BO',// Hindustan Unilever
      'ICICIBANK.BO', // ICICI Bank
      'BHARTIARTL.BO',// Bharti Airtel
      'KOTAKBANK.BO', // Kotak Mahindra Bank
      'BAJFINANCE.BO',// Bajaj Finance
      'ASIANPAINT.BO',// Asian Paints
    ],
    ID: [
      'BBCA.JK',   // Bank Central Asia
      'BBRI.JK',   // Bank Rakyat Indonesia
      'TLKM.JK',   // Telkom Indonesia
      'ASII.JK',   // Astra International
      'BMRI.JK',   // Bank Mandiri
      'UNVR.JK',   // Unilever Indonesia
      'BBNI.JK',   // Bank Negara Indonesia
      'ICBP.JK',   // Indofood CBP
      'EMTK.JK',   // Elang Mahkota Teknologi
      'GGRM.JK',   // Gudang Garam
    ],
  };

  // Market Information
  private marketInfo = {
    US: {
      name: 'United States',
      exchange: 'NYSE/NASDAQ',
      currency: 'USD',
      timeZone: 'America/New_York',
      tradingHours: '9:30 AM - 4:00 PM ET',
    },
    MY: {
      name: 'Malaysia',
      exchange: 'KLSE',
      currency: 'MYR',
      timeZone: 'Asia/Kuala_Lumpur',
      tradingHours: '9:00 AM - 5:00 PM MYT',
    },
    NG: {
      name: 'Nigeria',
      exchange: 'NGX',
      currency: 'NGN',
      timeZone: 'Africa/Lagos',
      tradingHours: '10:00 AM - 2:30 PM WAT',
    },
    ZA: {
      name: 'South Africa',
      exchange: 'JSE',
      currency: 'ZAR',
      timeZone: 'Africa/Johannesburg',
      tradingHours: '9:00 AM - 5:00 PM SAST',
    },
    KE: {
      name: 'Kenya',
      exchange: 'NSE',
      currency: 'KES',
      timeZone: 'Africa/Nairobi',
      tradingHours: '9:30 AM - 3:00 PM EAT',
    },
    JP: {
      name: 'Japan',
      exchange: 'TSE',
      currency: 'JPY',
      timeZone: 'Asia/Tokyo',
      tradingHours: '9:00 AM - 3:00 PM JST',
    },
    KR: {
      name: 'South Korea',
      exchange: 'KRX',
      currency: 'KRW',
      timeZone: 'Asia/Seoul',
      tradingHours: '9:00 AM - 3:30 PM KST',
    },
    CN: {
      name: 'China',
      exchange: 'SSE/SZSE',
      currency: 'CNY',
      timeZone: 'Asia/Shanghai',
      tradingHours: '9:30 AM - 3:00 PM CST',
    },
    IN: {
      name: 'India',
      exchange: 'BSE/NSE',
      currency: 'INR',
      timeZone: 'Asia/Kolkata',
      tradingHours: '9:15 AM - 3:30 PM IST',
    },
    ID: {
      name: 'Indonesia',
      exchange: 'IDX',
      currency: 'IDR',
      timeZone: 'Asia/Jakarta',
      tradingHours: '9:00 AM - 3:30 PM WIB',
    },
  };

  private constructor() {}

  public static getInstance(): StockService {
    if (!StockService.instance) {
      StockService.instance = new StockService();
    }
    return StockService.instance;
  }

  async getQuote(symbol: string): Promise<StockQuote> {
    try {
      return await apiService.get(`${this.baseUrl}/quote/${symbol}`);
    } catch (error) {
      console.error('Failed to fetch stock quote:', error);
      throw error;
    }
  }

  async getQuotes(symbols: string[]): Promise<StockQuote[]> {
    try {
      return await apiService.get(`${this.baseUrl}/quotes`, { params: { symbols: symbols.join(',') } });
    } catch (error) {
      console.error('Failed to fetch stock quotes:', error);
      throw error;
    }
  }

  async getProfile(symbol: string): Promise<StockProfile> {
    try {
      return await apiService.get(`${this.baseUrl}/profile/${symbol}`);
    } catch (error) {
      console.error('Failed to fetch stock profile:', error);
      throw error;
    }
  }

  async search(query: string, market?: 'US' | 'MY' | 'NG' | 'ZA' | 'KE' | 'JP' | 'KR' | 'CN' | 'IN' | 'ID'): Promise<StockQuote[]> {
    try {
      return await apiService.get(`${this.baseUrl}/search`, { 
        params: { 
          q: query,
          market: market
        } 
      });
    } catch (error) {
      console.error('Failed to search stocks:', error);
      throw error;
    }
  }

  async getStocksByMarket(market: 'US' | 'MY' | 'NG' | 'ZA' | 'KE' | 'JP' | 'KR' | 'CN' | 'IN' | 'ID'): Promise<StockQuote[]> {
    return this.getQuotes(this.stocksByMarket[market]);
  }

  async getMarketNews(market?: 'US' | 'MY' | 'NG' | 'ZA' | 'KE' | 'JP' | 'KR' | 'CN' | 'IN' | 'ID'): Promise<any[]> {
    try {
      return await apiService.get(`${this.baseUrl}/news`, {
        params: { market }
      });
    } catch (error) {
      console.error('Failed to fetch market news:', error);
      throw error;
    }
  }

  getDefaultSymbols(): string[] {
    return [...this.stocksByMarket.US, ...this.stocksByMarket.MY, ...this.stocksByMarket.NG, ...this.stocksByMarket.ZA, ...this.stocksByMarket.KE, ...this.stocksByMarket.JP, ...this.stocksByMarket.KR, ...this.stocksByMarket.CN, ...this.stocksByMarket.IN, ...this.stocksByMarket.ID];
  }

  getMarketInfo(market: 'US' | 'MY' | 'NG' | 'ZA' | 'KE' | 'JP' | 'KR' | 'CN' | 'IN' | 'ID') {
    return this.marketInfo[market];
  }

  getSymbolMarket(symbol: string): 'US' | 'MY' | 'NG' | 'ZA' | 'KE' | 'JP' | 'KR' | 'CN' | 'IN' | 'ID' {
    if (symbol.endsWith('.KL')) return 'MY';
    if (symbol.endsWith('.LG')) return 'NG';
    if (symbol.endsWith('.JO')) return 'ZA';
    if (symbol.endsWith('.NR')) return 'KE';
    if (symbol.endsWith('.T')) return 'JP';
    if (symbol.endsWith('.KS')) return 'KR';
    if (symbol.endsWith('.SS') || symbol.endsWith('.SZ')) return 'CN';
    if (symbol.endsWith('.BO') || symbol.endsWith('.NS')) return 'IN';
    if (symbol.endsWith('.JK')) return 'ID';
    return 'US';
  }

  formatPriceForMarket(price: number, market: 'US' | 'MY' | 'NG' | 'ZA' | 'KE' | 'JP' | 'KR' | 'CN' | 'IN' | 'ID'): string {
    switch (market) {
      case 'JP':
      case 'KR':
      case 'ID':
        return price.toFixed(0); // These markets typically show whole numbers
      case 'MY':
      case 'CN':
        return price.toFixed(3); // These markets use 3 decimal places
      default:
        return price.toFixed(2); // Most markets use 2 decimal places
    }
  }
}

export const stockService = StockService.getInstance();
