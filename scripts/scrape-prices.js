#!/usr/bin/env node
/**
 * Price Scraper Script
 * Fetches computer component prices and stores historical data
 * 
 * Usage: node scrape-prices.js [--product gpu|cpu|ram|ssd|monitor|all]
 * 
 * This script can be run as a cron job every 10 minutes:
 * */10 * * * * cd /path/to/vue && node scripts/scrape-prices.js >> logs/prices.log 2>&1
 */

const fs = require('fs');
const path = require('path');

// Product configurations with base prices and search terms
const PRODUCTS = {
  gpu: {
    name: '显卡',
    items: [
      { id: 'rtx4090', name: 'RTX 4090', basePrice: 15999 },
      { id: 'rtx4080', name: 'RTX 4080', basePrice: 8999 },
      { id: 'rtx4070', name: 'RTX 4070', basePrice: 4999 },
      { id: 'rx7900xtx', name: 'RX 7900 XTX', basePrice: 7999 },
      { id: 'rx7800xt', name: 'RX 7800 XT', basePrice: 3999 }
    ]
  },
  cpu: {
    name: 'CPU',
    items: [
      { id: 'i9-14900k', name: 'Intel i9-14900K', basePrice: 4999 },
      { id: 'i7-14700k', name: 'Intel i7-14700K', basePrice: 3299 },
      { id: 'r9-7950x', name: 'AMD R9 7950X', basePrice: 3999 },
      { id: 'r7-7800x3d', name: 'AMD R7 7800X3D', basePrice: 2399 },
      { id: 'i5-14600k', name: 'Intel i5-14600K', basePrice: 2199 }
    ]
  },
  ram: {
    name: '内存',
    items: [
      { id: 'ddr5-32g', name: 'DDR5 32GB', basePrice: 799 },
      { id: 'ddr5-64g', name: 'DDR5 64GB', basePrice: 1499 },
      { id: 'ddr4-32g', name: 'DDR4 32GB', basePrice: 499 }
    ]
  },
  ssd: {
    name: '固态硬盘',
    items: [
      { id: '990pro-2t', name: '三星 990 Pro 2TB', basePrice: 1299 },
      { id: 'sn850x-2t', name: 'WD Black SN850X 2TB', basePrice: 1199 },
      { id: 'p7000z-2t', name: '致态 P7000Z 2TB', basePrice: 799 }
    ]
  },
  monitor: {
    name: '显示器',
    items: [
      { id: 'lg-27gp95r', name: 'LG 27GP95R', basePrice: 3999 },
      { id: 'dell-g3223q', name: 'Dell G3223Q', basePrice: 5999 },
      { id: 'samsung-odyssey', name: '三星 Odyssey G7', basePrice: 4999 }
    ]
  }
};

// Data storage paths
const DATA_DIR = path.join(__dirname, '..', 'data');
const HISTORY_FILE = path.join(DATA_DIR, 'price-history.json');

/**
 * Simulate fetching price from an API
 * In production, this would fetch from JD.com, Taobao, etc.
 */
async function fetchPrice(productId, basePrice) {
  // Simulate API call with realistic price variation
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Generate realistic price with small random variation (±3%)
  const variation = (Math.random() - 0.5) * 0.06;
  const price = basePrice * (1 + variation);
  
  return Math.round(price * 100) / 100;
}

/**
 * Load existing price history
 */
function loadHistory() {
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      const data = fs.readFileSync(HISTORY_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load history:', e.message);
  }
  return { prices: {}, lastUpdate: null };
}

/**
 * Save price history
 */
function saveHistory(history) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    history.lastUpdate = new Date().toISOString();
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
    console.log(`Saved price data to ${HISTORY_FILE}`);
  } catch (e) {
    console.error('Failed to save history:', e.message);
  }
}

/**
 * Scrape prices for a specific category or all
 */
async function scrapePrices(category = 'all') {
  const categories = category === 'all' 
    ? Object.keys(PRODUCTS) 
    : [category];
  
  const history = loadHistory();
  const today = new Date().toISOString().split('T')[0];
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`Price Scraping - ${new Date().toLocaleString('zh-CN')}`);
  console.log(`Categories: ${categories.join(', ')}`);
  console.log('='.repeat(50));
  
  for (const cat of categories) {
    if (!PRODUCTS[cat]) {
      console.warn(`Unknown category: ${cat}`);
      continue;
    }
    
    console.log(`\n[${PRODUCTS[cat].name}]`);
    
    for (const item of PRODUCTS[cat].items) {
      try {
        const price = await fetchPrice(item.id, item.basePrice);
        
        // Initialize category and product if needed
        if (!history.prices[item.id]) {
          history.prices[item.id] = {};
        }
        
        // Store today's price
        history.prices[item.id][today] = price;
        
        // Keep only last 90 days of history
        const dates = Object.keys(history.prices[item.id]).sort();
        if (dates.length > 90) {
          const toDelete = dates.slice(0, dates.length - 90);
          toDelete.forEach(d => delete history.prices[item.id][d]);
        }
        
        const lastPrice = dates.length > 0 ? history.prices[item.id][dates[dates.length - 1]] : price;
        const change = price - lastPrice;
        const changePercent = ((change / lastPrice) * 100).toFixed(2);
        
        console.log(`  ${item.name}: ¥${price.toFixed(2)} (${change >= 0 ? '+' : ''}${change.toFixed(2)} / ${changePercent}%)`);
        
      } catch (e) {
        console.error(`  Failed to fetch ${item.name}:`, e.message);
      }
    }
  }
  
  saveHistory(history);
  
  console.log(`\nDone! Last update: ${history.lastUpdate}`);
  return history;
}

/**
 * Print price comparison
 */
function printComparison(history) {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  console.log(`\n${'='.repeat(50)}`);
  console.log('Price Comparison (vs yesterday)');
  console.log('='.repeat(50));
  
  for (const [catKey, cat] of Object.entries(PRODUCTS)) {
    console.log(`\n${cat.name}:`);
    
    for (const item of cat.items) {
      if (!history.prices[item.id]) continue;
      
      const todayPrice = history.prices[item.id][today];
      const yesterdayPrice = history.prices[item.id][yesterday] || todayPrice;
      
      if (!todayPrice) continue;
      
      const change = todayPrice - yesterdayPrice;
      const changeStr = change >= 0 ? `↑ +¥${change.toFixed(2)}` : `↓ -¥${Math.abs(change).toFixed(2)}`;
      
      console.log(`  ${item.name}: ¥${todayPrice.toFixed(2)} ${changeStr}`);
    }
  }
}

// Main execution
const args = process.argv.slice(2);
const category = args[0] || 'all';

scrapePrices(category)
  .then(history => {
    printComparison(history);
    process.exit(0);
  })
  .catch(e => {
    console.error('Scraping failed:', e);
    process.exit(1);
  });
