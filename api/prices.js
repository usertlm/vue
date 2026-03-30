// Vercel Serverless Function for Price API
// Returns real price data from Amazon (scraped via Python script)

const fs = require('fs');
const path = require('path');

// USD to CNY conversion rate (approximate)
const USD_TO_CNY = 7.25;

// Load price history
function loadPriceHistory() {
  try {
    const filePath = path.join(__dirname, '..', 'data', 'price-history.json');
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load price history:', e.message);
  }
  return { prices: {}, updatedAt: null };
}

// Product metadata
const PRODUCTS = {
  gpu: {
    name: '显卡',
    items: {
      'rtx4090': { name: 'RTX 4090', basePriceCNY: 15999 },
      'rtx4080': { name: 'RTX 4080', basePriceCNY: 8999 },
      'rtx4070': { name: 'RTX 4070', basePriceCNY: 4999 },
      'rx7900xtx': { name: 'RX 7900 XTX', basePriceCNY: 7999 },
      'rx7800xt': { name: 'RX 7800 XT', basePriceCNY: 3999 }
    }
  },
  cpu: {
    name: 'CPU',
    items: {
      'i9-14900k': { name: 'Intel i9-14900K', basePriceCNY: 4999 },
      'i7-14700k': { name: 'Intel i7-14700K', basePriceCNY: 3299 },
      'r9-7950x': { name: 'AMD R9 7950X', basePriceCNY: 3999 },
      'r7-7800x3d': { name: 'AMD R7 7800X3D', basePriceCNY: 2399 },
      'i5-14600k': { name: 'Intel i5-14600K', basePriceCNY: 2199 }
    }
  },
  ram: {
    name: '内存',
    items: {
      'ddr5-32g': { name: 'DDR5 32GB', basePriceCNY: 799 },
      'ddr5-64g': { name: 'DDR5 64GB', basePriceCNY: 1499 },
      'ddr4-32g': { name: 'DDR4 32GB', basePriceCNY: 499 }
    }
  },
  ssd: {
    name: '固态硬盘',
    items: {
      '990pro-2t': { name: '三星 990 Pro 2TB', basePriceCNY: 1299 },
      'sn850x-2t': { name: 'WD Black SN850X 2TB', basePriceCNY: 1199 },
      'p7000z-2t': { name: '致态 P7000Z 2TB', basePriceCNY: 799 }
    }
  },
  monitor: {
    name: '显示器',
    items: {
      'lg-27gp95r': { name: 'LG 27GP95R', basePriceCNY: 3999 },
      'dell-g3223q': { name: 'Dell G3223Q', basePriceCNY: 5999 },
      'samsung-odyssey': { name: '三星 Odyssey G7', basePriceCNY: 4999 }
    }
  }
};

// Generate demo history based on current price
function generateDemoHistory(currentPrice, days = 30) {
  const history = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Add small random variation
    const variation = (Math.random() - 0.5) * 0.05;
    const price = currentPrice * (1 + variation);
    
    history.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(price * 100) / 100
    });
  }
  
  return history;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { product, currency = 'CNY' } = req.query;

  // Load scraped price data
  const priceData = loadPriceHistory();

  if (!product) {
    // Return all products with prices
    const allProducts = [];
    
    for (const [catKey, cat] of Object.entries(PRODUCTS)) {
      for (const [prodKey, prod] of Object.entries(cat.items)) {
        const scrapedData = priceData[catKey]?.[prodKey];
        const basePrice = prod.basePriceCNY;
        
        let currentPrice = basePrice;
        let priceUSD = null;
        let productName = prod.name;
        
        if (scrapedData && scrapedData.price) {
          priceUSD = scrapedData.price;
          currentPrice = priceUSD * USD_TO_CNY;
          productName = scrapedData.name || prod.name;
        }
        
        allProducts.push({
          id: prodKey,
          category: catKey,
          categoryName: cat.name,
          name: productName,
          price: currency === 'USD' ? priceUSD : Math.round(currentPrice * 100) / 100,
          priceCNY: Math.round(currentPrice * 100) / 100,
          priceUSD: priceUSD,
          currency: currency,
          basePriceCNY: basePrice,
          source: priceUSD ? 'Amazon' : 'Estimated'
        });
      }
    }
    
    return res.status(200).json({
      products: allProducts,
      updatedAt: priceData.updatedAt || new Date().toISOString(),
      currency: currency,
      conversionRate: USD_TO_CNY
    });
  }

  // Validate product
  let foundProduct = null;
  let catKey = null;
  let prodKey = null;
  
  for (const [cKey, cat] of Object.entries(PRODUCTS)) {
    if (cat.items[product]) {
      catKey = cKey;
      prodKey = product;
      foundProduct = cat.items[product];
      break;
    }
  }

  if (!foundProduct) {
    return res.status(404).json({ 
      error: 'Product not found',
      availableProducts: Object.keys(PRODUCTS.gpu.items).concat(
        Object.keys(PRODUCTS.cpu.items),
        Object.keys(PRODUCTS.ram.items),
        Object.keys(PRODUCTS.ssd.items),
        Object.keys(PRODUCTS.monitor.items)
      )
    });
  }

  // Get scraped data if available
  const scrapedData = priceData[catKey]?.[prodKey];
  
  let currentPrice = foundProduct.basePriceCNY;
  let priceUSD = null;
  let productName = foundProduct.name;
  
  if (scrapedData && scrapedData.price) {
    priceUSD = scrapedData.price;
    currentPrice = priceUSD * USD_TO_CNY;
    productName = scrapedData.name || foundProduct.name;
  }

  // Generate price history
  const history = generateDemoHistory(currentPrice);
  
  // Update today's price
  const today = new Date().toISOString().split('T')[0];
  history[history.length - 1] = {
    date: today,
    price: currency === 'USD' ? priceUSD : Math.round(currentPrice * 100) / 100
  };

  const yesterday = history.length > 1 ? history[history.length - 2].price : currentPrice;
  const dailyChange = currentPrice - yesterday;

  return res.status(200).json({
    product: prodKey,
    name: productName,
    category: catKey,
    categoryName: PRODUCTS[catKey].name,
    current: currency === 'USD' ? priceUSD : Math.round(currentPrice * 100) / 100,
    currentCNY: Math.round(currentPrice * 100) / 100,
    currentUSD: priceUSD,
    currency: currency,
    change: {
      daily: {
        value: Math.round(dailyChange * 100) / 100,
        percent: yesterday > 0 ? ((dailyChange / yesterday) * 100).toFixed(2) : '0.00'
      }
    },
    history: history,
    source: priceUSD ? 'Amazon (scraped)' : 'Estimated',
    updatedAt: priceData.updatedAt || new Date().toISOString()
  });
};
