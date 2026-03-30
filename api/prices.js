/**
 * api/prices.js — 价格查询 API（Vercel Serverless Function）
 *
 * GET /api/prices → 返回所有分类最新价格 + 历史记录
 * GET /api/prices?id=cpu-1 → 返回单个商品历史
 * POST /api/prices → 爬虫写入新价格（需要 SCRAPER_SECRET 验证）
 */

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(process.cwd(), 'data', 'price-history.json');

/** 读取价格历史文件 */
function readHistory() {
 try {
 if (!fs.existsSync(DATA_FILE)) return getDefaultData();
 const raw = fs.readFileSync(DATA_FILE, 'utf-8');
 return JSON.parse(raw);
 } catch {
 return getDefaultData();
 }
}

/** 写入价格历史文件 */
function writeHistory(data) {
 const dir = path.dirname(DATA_FILE);
 if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
 fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

/** 默认骨架数据（首次运行时初始化） */
function getDefaultData() {
 return {
 lastUpdated: null,
 categories: {
 cpu: [
 { id: 'cpu-1', name: 'Intel i9-14900K', price: 3899, history: [] },
 { id: 'cpu-2', name: 'AMD Ryzen 9 7950X', price: 4199, history: [] },
 { id: 'cpu-3', name: 'Intel i5-14600K', price: 1899, history: [] },
 { id: 'cpu-4', name: 'AMD Ryzen 5 7600X', price: 1599, history: [] },
 ],
 gpu: [
 { id: 'gpu-1', name: 'RTX 4090 24G', price: 13999, history: [] },
 { id: 'gpu-2', name: 'RX 7900 XTX', price: 6499, history: [] },
 { id: 'gpu-3', name: 'RTX 4070 Ti', price: 5699, history: [] },
 { id: 'gpu-4', name: 'RTX 4060 8G', price: 2399, history: [] },
 ],
 ram: [
 { id: 'ram-1', name: '芝奇 DDR5 32G', price: 699, history: [] },
 { id: 'ram-2', name: '海力士 DDR5 16G', price: 349, history: [] },
 { id: 'ram-3', name: '金士顿 DDR4 32G', price: 399, history: [] },
 ],
 ssd: [
 { id: 'ssd-1', name: '三星 990 Pro 2T', price: 1199, history: [] },
 { id: 'ssd-2', name: '西数 SN850X 1T', price: 699, history: [] },
 { id: 'ssd-3', name: '致态 TiPlus7100 2T', price: 599, history: [] },
 ],
 mb: [
 { id: 'mb-1', name: 'ROG Z790 APEX', price: 3499, history: [] },
 { id: 'mb-2', name: '微星 MAG X670E', price: 1999, history: [] },
 { id: 'mb-3', name: '华硕 B660M-K', price: 799, history: [] },
 ],
 cool: [
 { id: 'cool-1', name: '猫头鹰 NH-D15', price: 699, history: [] },
 { id: 'cool-2', name: '海盗船 H150i Elite', price: 999, history: [] },
 { id: 'cool-3', name: '利民 FC140', price: 349, history: [] },
 ],
 },
 };
}

/** 组装客户端响应格式 */
function buildResponse(data, itemId) {
 // 单商品历史查询
 if (itemId) {
 for (const items of Object.values(data.categories)) {
 const found = items.find(i => i.id === itemId);
 if (found) {
 return {
 id: found.id,
 name: found.name,
 currentPrice: found.price,
 history: found.history.slice(-100), // 最近100条
 };
 }
 }
 return null;
 }

 // 全量数据，精简历史（最近30条）
 const result = { lastUpdated: data.lastUpdated, categories: {} };
 for (const [cat, items] of Object.entries(data.categories)) {
 result.categories[cat] = items.map(item => ({
 id: item.id,
 name: item.name,
 price: item.price,
 // 用于前端折线图的 trend 数组
 trend: (item.history || []).slice(-30).map(h => ({
 time: h.time,
 price: h.price,
 })),
 historyLow: Math.min(...(item.history.map(h => h.price)), item.price),
 historyHigh: Math.max(...(item.history.map(h => h.price)), item.price),
 }));
 }
 return result;
}

module.exports = async (req, res) => {
 // ── CORS ────────────────────────────────────────────────
 res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
 res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
 if (req.method === 'OPTIONS') return res.status(200).end();

 // ── GET: 返回价格数据 ────────────────────────────────────
 if (req.method === 'GET') {
 const { id } = req.query;
 const data = readHistory();
 const payload = buildResponse(data, id);

 if (id && !payload) {
 return res.status(404).json({ error: '商品不存在', id });
 }

 res.setHeader('Cache-Control', 'no-store');
 return res.status(200).json(payload);
 }

 // ── POST: 爬虫写入新价格 ─────────────────────────────────
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

 // 仅当价格有变化时记录历史
 if (local.price !== newPrice) {
 local.history.push({ time: now, price: newPrice, source: incoming.source || 'unknown' });
 // 保留最近 500 条历史
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
