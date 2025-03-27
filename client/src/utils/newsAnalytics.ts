import { format, parseISO, subDays } from 'date-fns';
import { NewsItem, PriceData } from '../stores/newsStore';

export function calculateCorrelation(
  news: NewsItem[],
  prices: PriceData[],
  currency: string,
  daysBack: number = 30
): number {
  const startDate = subDays(new Date(), daysBack);
  
  // Filter news and prices for the specified period and currency
  const filteredNews = news.filter(item => 
    item.currencies.includes(currency) && 
    parseISO(item.publishedAt) >= startDate
  );

  const filteredPrices = prices.filter(item => 
    item.currency === currency && 
    parseISO(item.timestamp) >= startDate
  );

  // Create daily sentiment scores
  const sentimentByDay: { [key: string]: number } = {};
  filteredNews.forEach(item => {
    const date = format(parseISO(item.publishedAt), 'yyyy-MM-dd');
    const sentimentScore = item.sentiment === 'positive' ? 1 : item.sentiment === 'negative' ? -1 : 0;
    sentimentByDay[date] = (sentimentByDay[date] || 0) + sentimentScore;
  });

  // Create daily price changes
  const priceChangeByDay: { [key: string]: number } = {};
  for (let i = 1; i < filteredPrices.length; i++) {
    const date = format(parseISO(filteredPrices[i].timestamp), 'yyyy-MM-dd');
    const priceChange = (filteredPrices[i].price - filteredPrices[i-1].price) / filteredPrices[i-1].price;
    priceChangeByDay[date] = priceChange;
  }

  // Get dates that have both sentiment and price data
  const dates = Object.keys(sentimentByDay).filter(date => date in priceChangeByDay);

  if (dates.length < 2) return 0;

  // Calculate correlation
  const sentiments = dates.map(date => sentimentByDay[date]);
  const priceChanges = dates.map(date => priceChangeByDay[date]);

  const meanSentiment = sentiments.reduce((a, b) => a + b) / sentiments.length;
  const meanPriceChange = priceChanges.reduce((a, b) => a + b) / priceChanges.length;

  const numerator = sentiments.reduce((sum, sentiment, i) => 
    sum + (sentiment - meanSentiment) * (priceChanges[i] - meanPriceChange), 0);

  const denominatorSentiment = Math.sqrt(sentiments.reduce((sum, sentiment) => 
    sum + Math.pow(sentiment - meanSentiment, 2), 0));

  const denominatorPrice = Math.sqrt(priceChanges.reduce((sum, price) => 
    sum + Math.pow(price - meanPriceChange, 2), 0));

  return numerator / (denominatorSentiment * denominatorPrice);
}

export function extractCommonWords(news: NewsItem[]): { text: string; value: number }[] {
  const stopWords = new Set(['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at']);
  const wordCounts: { [key: string]: number } = {};

  news.forEach(item => {
    const words = (item.title + ' ' + item.description)
      .toLowerCase()
      .replace(/[^a-z\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3 && !stopWords.has(word));

    words.forEach(word => {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    });
  });

  return Object.entries(wordCounts)
    .map(([text, value]) => ({ text, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 50);
}

export function getGeographicDistribution(news: NewsItem[]): { [key: string]: number } {
  const locationCounts: { [key: string]: number } = {};

  news.forEach(item => {
    if (item.location) {
      locationCounts[item.location] = (locationCounts[item.location] || 0) + 1;
    }
  });

  return locationCounts;
}

export function aggregateNewsByDateRange(
  news: NewsItem[],
  startDate: Date,
  endDate: Date
): { sentimentTrend: { date: string; positive: number; negative: number; neutral: number }[] } {
  const dateMap = new Map<string, { positive: number; negative: number; neutral: number }>();

  // Initialize dates
  let currentDate = startDate;
  while (currentDate <= endDate) {
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    dateMap.set(dateStr, { positive: 0, negative: 0, neutral: 0 });
    currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
  }

  // Aggregate news data
  news.forEach(item => {
    const date = format(parseISO(item.publishedAt), 'yyyy-MM-dd');
    const data = dateMap.get(date);
    if (data) {
      data[item.sentiment]++;
    }
  });

  // Convert to array and sort by date
  const sentimentTrend = Array.from(dateMap.entries())
    .map(([date, counts]) => ({
      date,
      ...counts
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return { sentimentTrend };
}
