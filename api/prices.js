/**
 * api/prices.js — 价格查询 API（Vercel Serverless Function）
 *
 * GET /api/prices → 返回所有分类最新价格 + 历史记录
 * GET /api/prices?id=cpu-1 → 返回单个商品历史
 * POST /api/prices → 爬虫写入新价格（需要 SCRAPER_SECRET 验证）
 */

const fs = require('fs');
const path = require('path');

// Data file path - use absolute path from __dirname
const DATA_FILE = path.join(__dirname, '..', 'data', 'price-history.json');

const DATA_FILE_CONTENTS = {
 lastUpdated: new Date().toISOString(),
 categories: {
 cpu: [
 { id: 'cpu-1', name: 'Intel Core Ultra 9 285K', price: 4999, history: [] },
 { id: 'cpu-2', name: 'Intel Core Ultra 7 265K', price: 3299, history: [] },
 { id: 'cpu-3', name: 'Intel Core Ultra 5 245K', price: 2299, history: [] },
 { id: 'cpu-4', name: 'AMD Ryzen 9 9950X', price: 4499, history: [] },
 { id: 'cpu-5', name: 'AMD Ryzen 9 9900X', price: 3299, history: [] },
 { id: 'cpu-6', name: 'AMD Ryzen 7 9700X', price: 2299, history: [] },
 { id: 'cpu-7', name: 'AMD Ryzen 5 9600X', price: 1699, history: [] },
 { id: 'cpu-8', name: 'AMD Ryzen 7 9800X3D', price: 3799, history: [] }
 ],
 gpu: [
 { id: 'gpu-1', name: 'NVIDIA RTX 5090', price: 19999, history: [] },
 { id: 'gpu-2', name: 'NVIDIA RTX 5080', price: 9999, history: [] },
 { id: 'gpu-3', name: 'NVIDIA RTX 5070 Ti', price: 6999, history: [] },
 { id: 'gpu-4', name: 'NVIDIA RTX 5070', price: 5499, history: [] },
 { id: 'gpu-5', name: 'AMD RX 9070 XT', price: 5999, history: [] },
 { id: 'gpu-6', name: 'AMD RX 9070', price: 4499, history: [] },
 { id: 'gpu-7', name: 'NVIDIA RTX 4090 D', price: 15999, history: [] },
 { id: 'gpu-8', name: 'AMD RX 7900 XTX', price: 7999, history: [] }
 ],
 ram: [
 { id: 'ram-1', name: 'DDR5 32GB (2x16GB) 6000MHz', price: 699, history: [] },
 { id: 'ram-2', name: 'DDR5 64GB (2x32GB) 6000MHz', price: 1399, history: [] },
 { id: 'ram-3', name: 'DDR5 128GB (4x32GB) 6000MHz', price: 2799, history: [] },
 { id: 'ram-4', name: 'DDR4 32GB (2x16GB) 3200MHz', price: 399, history: [] },
 { id: 'ram-5', name: 'DDR5 96GB (2x48GB) 6400MHz', price: 1899, history: [] }
 ],
 ssd: [
 { id: 'ssd-1', name: '三星 990 Pro 2TB', price: 1299, history: [] },
 { id: 'ssd-2', name: '三星 990 Pro 4TB', price: 2299, history: [] },
 { id: 'ssd-3', name: 'WD Black SN850X 2TB', price: 1199, history: [] },
 { id: 'ssd-4', name: '致态 TiPlus7100 2TB', price: 799, history: [] },
 { id: 'ssd-5', name: '海力士 P41 2TB', price: 1099, history: [] },
 { id: 'ssd-6', name: '三星 9100 Pro 2TB', price: 1599, history: [] }
 ],
 mb: [
 { id: 'mb-1', name: 'ROG MAXIMUS Z890 APEX', price: 6999, history: [] },
 { id: 'mb-2', name: 'ROG STRIX Z890-E', price: 3999, history: [] },
 { id: 'mb-3', name: 'MSI MEG Z890 ACE', price: 5499, history: [] },
 { id: 'mb-4', name: 'ROG CROSSHAIR X870E HERO', price: 4999, history: [] },
 { id: 'mb-5', name: 'MSI MAG X870 TOMAHAWK', price: 1999, history: [] },
 { id: 'mb-6', name: '华硕 B850M-K', price: 899, history: [] }
 ],
 cool: [
 { id: 'cool-1', name: '猫头鹰 NH-D15', price: 799, history: [] },
 { id: 'cool-2', name: '猫头鹰 NH-U12A', price: 699, history: [] },
 { id: 'cool-3', name: '利民 FC140', price: 399, history: [] },
 { id: 'cool-4', name: '海盗船 H150i Elite', price: 1199, history: [] },
 { id: 'cool-5', name: '华硕 龙神3代 360', price: 1699, history: [] }
 ]
 }
};

/** 读取价格历史文件 */
function readHistory() {
 try {
 if (!fs.existsSync(DATA_FILE)) {
 writeHistory(DATA_FILE_CONTENTS);
 return DATA_FILE_CONTENTS;
 }
 const raw = fs.readFileSync(DATA_FILE, 'utf-8');
 const data = JSON.parse(raw);
 if (!data.lastUpdated) {
 data.lastUpdated = new Date().toISOString();
 writeHistory(data);
 }
 return data;
 } catch {
 return DATA_FILE_CONTENTS;
 }
}

/** 写入价格历史文件 */
function writeHistory(data) {
 const dir = path.dirname(DATA_FILE);
 if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
 fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

/** 组装客户端响应格式 */
function buildResponse(data, itemId) {
	if (itemId) {
		for (const items of Object.values(data.categories)) {
			const found = items.find(i => i.id === itemId);
			if (found) {
				const historyLast30 = (found.history || []).slice(-30);
				return {
					id: found.id,
					name: found.name,
					currentPrice: found.price,
					history: found.history.slice(-100),
					trend: calculateTrend(historyLast30),
					minPrice: Math.min(...historyLast30.map(h => h.price)),
					maxPrice: Math.max(...historyLast30.map(h => h.price)),
					avgPrice: calculateAverage(historyLast30),
				};
			}
		}
		return null;
	}
  
	const result = { lastUpdated: data.lastUpdated, categories: {} };
	for (const [cat, items] of Object.entries(data.categories)) {
		result.categories[cat] = items.map(item => {
			const historyLast30 = (item.history || []).slice(-30);
			return {
				id: item.id,
				name: item.name,
				price: item.price,
				trend: calculateTrend(historyLast30),
				historyLow: historyLast30.length > 0 ? Math.min(...historyLast30.map(h => h.price)) : item.price,
				historyHigh: historyLast30.length > 0 ? Math.max(...historyLast30.map(h => h.price)) : item.price,
				avgPrice: calculateAverage(historyLast30),
			};
		});
	}
	return result;
}

/** 计算价格趋势百分比 */
function calculateTrend(history) {
	if (!history || history.length < 2) return 0;
	const first = history[0].price;
	const last = history[history.length - 1].price;
	return ((last - first) / first) * 100;
}

/** 计算平均价格 */
function calculateAverage(history) {
	if (!history || history.length === 0) return 0;
	const sum = history.reduce((acc, h) => acc + h.price, 0);
	return Math.round((sum / history.length) * 100) / 100;
}

/** 搜索配件 */
function searchComponents(data, query) {
	const results = [];
	for (const [cat, items] of Object.entries(data.categories)) {
		items.forEach(item => {
			if (item.name.toLowerCase().includes(query.toLowerCase())) {
				results.push({
					id: item.id,
					name: item.name,
					category: cat,
					price: item.price,
					trend: calculateTrend((item.history || []).slice(-30)),
				});
			}
		});
	}
	return results;
}

/** 获取价格统计 */
function getPricingStats(data) {
	const stats = {
		mostExpensive: null,
		cheapest: null,
		averageByCategory: {},
		categoryCount: {},
	};
  
	let maxPrice = 0, minPrice = Infinity;
  
	for (const [cat, items] of Object.entries(data.categories)) {
		const prices = items.map(i => i.price);
		stats.categoryCount[cat] = items.length;
		stats.averageByCategory[cat] = Math.round((prices.reduce((a, b) => a + b, 0) / prices.length) * 100) / 100;
    
		items.forEach(item => {
			if (item.price > maxPrice) {
				maxPrice = item.price;
				stats.mostExpensive = { id: item.id, name: item.name, price: item.price, category: cat };
			}
			if (item.price < minPrice) {
				minPrice = item.price;
				stats.cheapest = { id: item.id, name: item.name, price: item.price, category: cat };
			}
		});
	}
  
	return stats;
}
module.exports = async (req, res) => {
 res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
 res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
 if (req.method === 'OPTIONS') return res.status(200).end();

 if (req.method === 'GET') {
		const { id, action, query, category } = req.query;
 const data = readHistory();
    
		// 搜索功能
		if (action === 'search' && query) {
			const results = searchComponents(data, query);
			return res.status(200).json({ success: true, results, count: results.length });
		}
    
		// 统计功能
		if (action === 'stats') {
			const stats = getPricingStats(data);
			return res.status(200).json({ success: true, ...stats });
		}
    
		// 按分类获取
		if (action === 'category' && category) {
			if (!data.categories[category]) {
				return res.status(404).json({ error: '分类不存在' });
			}
			const categoryData = data.categories[category].map(item => ({
				id: item.id,
				name: item.name,
				price: item.price,
				trend: calculateTrend((item.history || []).slice(-30)),
			}));
			return res.status(200).json({ success: true, category, data: categoryData });
		}
    
		const payload = id ? buildResponse(data, id) : buildResponse(data, null);

 if (id && !payload) {
	return res.status(404).json({ error: '商品不存在', id, success: false });
 }

 res.setHeader('Cache-Control', 'no-store');
 return res.status(200).json(payload);
 }

 if (req.method === 'POST') {
 const secret = req.headers['authorization'];
 if (!secret || secret !== `Bearer ${process.env.SCRAPER_SECRET}`) {
 return res.status(401).json({ error: '未授权' });
 }

 let body;
 try {
 body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
 } catch {
 return res.status(400).json({ error: '请求体格式错误' });
 }

 if (!body || !body.categories) {
 return res.status(400).json({ error: '缺少 categories 字段' });
 }

 const data = readHistory();
 const now = new Date().toISOString();

 for (const [cat, items] of Object.entries(body.categories)) {
 if (!data.categories[cat]) continue;
 items.forEach(incoming => {
 const local = data.categories[cat].find(i => i.id === incoming.id);
 if (!local) return;

 const newPrice = Number(incoming.price);
 if (isNaN(newPrice) || newPrice <= 0) return;

 if (local.price !== newPrice) {
 local.history.push({ time: now, price: newPrice, source: incoming.source || 'unknown' });
 if (local.history.length > 500) local.history.shift();
 }
 local.price = newPrice;
 });
 }

 data.lastUpdated = now;
 writeHistory(data);

 return res.status(200).json({ success: true, updatedAt: now });
 }

 return res.status(405).json({ error: 'Method Not Allowed' });
};
