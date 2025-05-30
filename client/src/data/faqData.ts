// FAQ data for the Algo360FX platform
export interface FAQ {
  question: string;
  answer: string;
}

export const faqData: FAQ[] = [
  {
    question: "What trading instruments are available on Algo360FX?",
    answer: "Algo360FX offers a wide range of trading instruments including Forex pairs, Stocks (US, Asian, European markets), ETFs, Cryptocurrencies, Commodities, and Derivatives. We support major Malaysian stocks, structured warrants, and ETFs from Bursa Malaysia."
  },
  {
    question: "What Malaysian stocks and ETFs are available for trading?",
    answer: "We offer comprehensive coverage of Bursa Malaysia securities including: KLCI component stocks, Mid 70 stocks, Small Cap stocks, FTSE Bursa Malaysia ETFs, Islamic ETFs, and sector-specific ETFs. Major sectors include Banking (Maybank, CIMB, Public Bank), Telecommunications (Axiata, Digi, TM), Oil & Gas (Petronas), and Technology (MY E.G., Revenue Group)."
  },
  {
    question: "How can I trade Malaysian structured warrants on Algo360FX?",
    answer: "Our platform supports trading of Malaysian structured warrants including call warrants (CW) and put warrants (PW) for major stocks, indices (KLCI), and commodities. We provide real-time warrant pricing, gearing ratios, and expiry information. Minimum lot size is 100 units with leverage up to 15x depending on the warrant type."
  },
  {
    question: "What are the trading hours for Malaysian markets?",
    answer: "Bursa Malaysia trading hours are: Pre-opening: 8:30am-9:00am, Morning session: 9:00am-12:30pm, Midday break: 12:30pm-2:30pm, Afternoon session: 2:30pm-5:00pm (Malaysia Time, GMT+8). Trading is closed on Malaysian public holidays."
  },
  {
    question: "What are the minimum requirements to start trading?",
    answer: "To start trading, you need a verified account with minimum deposit requirements varying by account type: Basic ($100), Premium ($1000), or Professional ($5000). You'll also need a modern web browser with JavaScript enabled."
  },
  {
    question: "What are the fees for trading Malaysian securities?",
    answer: "For Malaysian stocks: Brokerage fee: 0.1% to 0.5% (minimum RM8), Clearing fee: 0.03%, Stamp duty: 0.1% (maximum RM200). For structured warrants: Brokerage fee: 0.5% (minimum RM8). For ETFs: Brokerage fee: 0.3% (minimum RM8). All fees are subject to 6% Service Tax."
  },
  {
    question: "How do I comply with Bursa Malaysia's trading regulations?",
    answer: "Our platform automatically enforces Bursa Malaysia's trading rules including: Lot size requirements (100 shares), price limits (±30% for stocks, ±20% for warrants), short-selling restrictions, and margin requirements. We also provide real-time regulatory updates and compliance notifications."
  },
  {
    question: "What market analysis tools are available for Malaysian securities?",
    answer: "We offer comprehensive analysis tools including: Real-time KLCI index tracking, sector analysis, warrant pricing calculators, technical analysis with local market indicators, fundamental analysis with Malaysian company financials, and market sentiment analysis based on local news and events."
  },
  {
    question: "What trading features are available?",
    answer: "Our platform offers advanced charting, real-time market data, algorithmic trading capabilities, portfolio management, risk analysis tools, automated trading strategies, and comprehensive market analysis features."
  },
  {
    question: "Is Algo360FX available in my country?",
    answer: "Algo360FX is available in most countries across Asia Pacific, including Malaysia, Singapore, Indonesia, Thailand, Vietnam, Philippines, Hong Kong, Japan, and South Korea. We also serve clients in the US, UK, Canada, and Australia."
  },
  {
    question: "What customer support options are available?",
    answer: "We offer 24/5 customer support through live chat, email, and phone in multiple languages including English, Chinese, Malay, Indonesian, Thai, Vietnamese, Japanese, Korean, Hindi, Arabic, Spanish, and Portuguese."
  },
  {
    question: "What Islamic trading products are available on Algo360FX?",
    answer: "We offer a comprehensive suite of Shariah-compliant products including: FTSE Bursa Malaysia EMAS Shariah Index stocks, Islamic ETFs (MyETF MSCI Malaysia Islamic Dividend, MyETF Dow Jones Islamic Market Malaysia Titans 25), Islamic REITs, and Sukuk trading. All products are certified Shariah-compliant and regularly reviewed by our Shariah board."
  },
  {
    question: "How does Islamic trading differ from conventional trading on the platform?",
    answer: "Islamic trading accounts feature: No interest (riba) charges or payments, no overnight swap fees, instant execution to avoid gharar (uncertainty), and trading only in Shariah-compliant instruments. We provide specialized Islamic portfolio screening tools and Zakat calculation features."
  },
  {
    question: "What are the Shariah screening criteria for stocks?",
    answer: "We follow Bursa Malaysia's Shariah screening methodology: Business activity screening (avoiding non-halal activities) and financial ratio screening (debt ratio < 33%, cash/interest-bearing securities < 33%, accounts receivable/total assets < 49%). Our platform automatically filters stocks based on these criteria."
  },
  {
    question: "What regulatory licenses does Algo360FX hold?",
    answer: "We are licensed by Securities Commission Malaysia (SC) for dealing in securities and derivatives, Bank Negara Malaysia (BNM) for forex trading, and Labuan Financial Services Authority (LFSA) for digital assets. We also maintain compliance with PDPA 2010 for data protection."
  },
  {
    question: "How does Algo360FX ensure regulatory compliance?",
    answer: "We implement comprehensive compliance measures: Real-time trade monitoring, AML/CFT checks, risk management systems, regular audits, and automated regulatory reporting. Our platform enforces position limits, margin requirements, and trading restrictions as per regulatory guidelines."
  },
  {
    question: "What are the reporting requirements for Malaysian traders?",
    answer: "Malaysian traders must report: Large shareholding positions (>5%), insider trading declarations, contract note requirements, and annual trading summaries for tax purposes. Our platform generates automated reports and notifications to help maintain compliance."
  },
  {
    question: "What types of Islamic ETFs are available on Algo360FX?",
    answer: "We offer various Islamic ETFs: MyETF MSCI Malaysia Islamic Dividend (dividend-focused), MyETF Dow Jones Islamic Market Malaysia Titans 25 (large-cap Shariah), TradePlus MSCI Asia ex Japan Islamic REITs (property), and MyETF Thomson Reuters Asia Pacific ex-Japan Islamic Agribusiness (agriculture sector). Each ETF is certified Shariah-compliant and regularly reviewed by our Shariah board."
  },
  {
    question: "How does Sukuk trading work on the platform?",
    answer: "Our Sukuk trading platform supports various structures: Ijarah (lease-based), Murabahah (cost-plus), Musharakah (partnership), and Wakalah (agency). We provide real-time pricing, yield calculations, and credit ratings. Minimum investment starts at RM1,000 with detailed documentation of underlying assets and Shariah structures."
  },
  {
    question: "What Islamic derivatives and hedging instruments are available?",
    answer: "We offer Shariah-compliant derivatives: Wa'd (promise-based forwards), Islamic swaps based on commodity Murabahah, Islamic options using Urbun structure, and Islamic profit rate swaps. These instruments are designed for hedging purposes and comply with AAOIFI standards."
  },
  {
    question: "How are Islamic REITs different from conventional REITs?",
    answer: "Islamic REITs must comply with additional requirements: Property usage must be Shariah-compliant (no conventional banks, gambling, etc.), insurance must be Takaful, financing must be Islamic, and non-permissible rental income must be below 20%. Our platform automatically filters and monitors these requirements."
  },
  {
    question: "What are the specific features of Islamic money market instruments?",
    answer: "We offer Islamic money market instruments including: Commodity Murabahah deposits, Islamic commercial papers, Government Investment Issues (GII), and Islamic accepted bills. These instruments use various Shariah concepts like Mudarabah, Wakalah, and Tawarruq for liquidity management."
  }
];

// Platform information
export const platformInfo = {
  name: "Algo360FX",
  description: "Advanced algorithmic trading platform featuring forex, stocks, ETFs, and derivatives trading with real-time market data and analysis",
  features: [
    "Real-time market data",
    "Algorithmic trading capabilities",
    "Multi-asset trading (Forex, Stocks, ETFs, Derivatives)",
    "Advanced charting tools",
    "Portfolio management",
    "Risk analysis"
  ],
  supportedLanguages: [
    "English",
    "Chinese",
    "Malay",
    "Indonesian",
    "Thai",
    "Vietnamese",
    "Japanese",
    "Korean",
    "Hindi",
    "Arabic",
    "Spanish",
    "Portuguese"
  ],
  supportHours: "Mo-Fr 09:00-17:00",
  technicalSupportPhone: "+60-3-1234-5678",
  technicalSupportHours: "Mo-Fr 09:00-18:00",
  technicalSupportRegions: ["MY", "SG", "ID", "TH", "VN", "PH"]
};

// Course information
export interface Course {
  name: string;
  description: string;
  languages: string[];
  duration: string;
}

export const courseData: Course[] = [
  {
    name: "Forex Trading Fundamentals",
    description: "Learn the basics of forex trading",
    languages: ["en", "zh", "ms", "id", "th", "vi"],
    duration: "4 weeks"
  },
  {
    name: "Algorithmic Trading Strategies",
    description: "Learn to develop and implement algorithmic trading strategies",
    languages: ["en", "zh", "ms"],
    duration: "6 weeks"
  },
  {
    name: "Malaysian Market Analysis",
    description: "Comprehensive analysis of Malaysian markets",
    languages: ["en", "ms", "zh"],
    duration: "3 weeks"
  },
  {
    name: "Advanced Malaysian Warrant Trading",
    description: "Master structured warrant trading, pricing models, and risk management strategies for Malaysian market",
    languages: ["en", "ms", "zh"],
    duration: "4 weeks"
  },
  {
    name: "KLCI Technical Analysis Mastery",
    description: "Advanced technical analysis specifically for KLCI stocks and indices",
    languages: ["en", "ms", "zh"],
    duration: "5 weeks"
  }
];

// Helper function to search FAQs
export const searchFAQs = (query: string): FAQ[] => {
  if (!query) return [];
  
  const normalizedQuery = query.toLowerCase();
  
  return faqData.filter(faq => 
    faq.question.toLowerCase().includes(normalizedQuery) || 
    faq.answer.toLowerCase().includes(normalizedQuery)
  );
};

// Helper function to get the most relevant FAQ
export const getMostRelevantFAQ = (query: string): FAQ | null => {
  const results = searchFAQs(query);
  
  if (results.length === 0) return null;
  
  // Simple relevance scoring - count the number of query words in the question
  const queryWords = query.toLowerCase().split(/\s+/);
  
  const scoredResults = results.map(faq => {
    const questionLower = faq.question.toLowerCase();
    let score = 0;
    
    queryWords.forEach(word => {
      if (word.length > 2 && questionLower.includes(word)) {
        score += 1;
      }
    });
    
    return { faq, score };
  });
  
  // Sort by score (highest first)
  scoredResults.sort((a, b) => b.score - a.score);
  
  return scoredResults[0].faq;
};
