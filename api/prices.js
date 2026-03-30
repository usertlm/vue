// Vercel Serverless Function for Price API
// Returns price history data for computer components

// Demo data - in production, this would fetch from a real price API
const DEMO_PRICES = {
  // GPU prices (in CNY)
  'rtx4090': { base: 15999, name: 'RTX 4090' },
  'rtx4080': { base: 8999, name: 'RTX 4080' },
  'rtx4070': { base: 4999, name: 'RTX 4070' },
  'rx7900xtx': { base: 7999, name: 'RX 7900 XTX' },
  'rx7800xt': { base: 3999, name: 'RX 7800 XT' },
  
  // CPU prices
  'i9-14900k': { base: 4999, name: 'Intel i9-14900K' },
  'i7-14700k': { base: 3299, name: 'Intel i7-14700K' },
  'r9-7950x': { base: 3999, name: 'AMD R9 7950X' },
  'r7-7800x3d': { base: 2399, name: 'AMD R7 7800X3D' },
  'i5-14600k': { base: 2199, name: 'Intel i5-14600K' },
  
  // RAM prices
  'ddr5-32g': { base: 799, name: 'DDR5 32GB' },
  'ddr5-64g': { base: 1499, name: 'DDR5 64GB' },
  'ddr4-32g': { base: 499, name: 'DDR4 32GB' },
  
  // SSD prices
  '990pro-2t': { base: 1299, name: '三星 990 Pro 2TB' },
  'sn850x-2t': { base: 1199, name: 'WD Black SN850X 2TB' },
  'p7000z-2t': { base: 799, name: '致态 P7000Z 2TB' },
  
  // Monitor prices
  'lg-27gp95r': { base: 3999, name: 'LG 27GP95R' },
  'dell-g3223q': { base: 5999, name: 'Dell G3223Q' },
  'samsung-odyssey': { base: 4999, name: '三星 Odyssey G7' }
};

// Generate price history with realistic variations
function generatePriceHistory(productId, days = 30) {
  const product = DEMO_PRICES[productId];
  if (!product) return [];
  
  const history = [];
  const now = new Date();
  let price = product.base;
  
  // Generate price trend with some randomness
  const trend = (Math.random() - 0.5) * 0.02; // Slight downward bias
  const volatility = 0.03; // 3% daily volatility
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Random walk with mean reversion
    const change = price * (trend + (Math.random() - 0.5) * volatility);
    price = Math.max(product.base * 0.7, Math.min(product.base * 1.2, price - change));
    
    // Weekend slight dip
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      price *= 0.98;
    }
    
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

  const { product } = req.query;

  if (!product) {
    // Return all available products
    const products = Object.entries(DEMO_PRICES).map(([id, data]) => ({
      id,
      name: data.name,
      basePrice: data.base
    }));
    return res.status(200).json({ products });
  }

  // Validate product ID
  if (!DEMO_PRICES[product]) {
    return res.status(404).json({ 
      error: 'Product not found',
      availableProducts: Object.keys(DEMO_PRICES)
    });
  }

  // In production, this would:
  // 1. Check cache (Redis/Vercel KV) for recent data
  // 2. If stale, fetch from price API (JD.com, etc.)
  // 3. Store new data in cache
  // For demo, generate realistic price history
  
  const history = generatePriceHistory(product, 30);
  const current = history[history.length - 1];
  const yesterday = history[history.length - 2];
  const weekAgo = history[history.length - 8];
  const monthAgo = history[0];
  
  return res.status(200).json({
    product: DEMO_PRICES[product].name,
    current: current.price,
    change: {
      daily: {
        value: current.price - yesterday.price,
        percent: ((current.price - yesterday.price) / yesterday.price * 100).toFixed(2)
      },
      weekly: {
        value: current.price - weekAgo.price,
        percent: ((current.price - weekAgo.price) / weekAgo.price * 100).toFixed(2)
      },
      monthly: {
        value: current.price - monthAgo.price,
        percent: ((current.price - monthAgo.price) / monthAgo.price * 100).toFixed(2)
      }
    },
    history,
    updatedAt: new Date().toISOString()
  });
};
