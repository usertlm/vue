const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/priceData.json');

/**
 * 读取价格数据
 */
function loadPriceData() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading price data:', error);
    return { components: {} };
  }
}

/**
 * 保存价格数据
 */
function savePriceData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving price data:', error);
    return false;
  }
}

/**
 * 获取所有配件
 */
function getAllComponents() {
  const data = loadPriceData();
  return Object.values(data.components || {}).map(comp => ({
    id: comp.id,
    name: comp.name,
    category: comp.category,
    price: comp.price,
    trend: calculateTrend(comp)
  }));
}

/**
 * 计算价格趋势百分比（与30天前比较）
 */
function calculateTrend(component) {
  if (!component.history || component.history.length < 2) return 0;

  const oldest = component.history[0].price;
  const newest = component.history[component.history.length - 1].price;
  const change = ((newest - oldest) / oldest) * 100;

  return parseFloat(change.toFixed(2));
}

/**
 * 获取指定配件的历史数据
 */
function getComponentHistory(componentId) {
  const data = loadPriceData();
  const component = data.components[componentId];

  if (!component) {
    return null;
  }

  return {
    id: component.id,
    name: component.name,
    category: component.category,
    currentPrice: component.price,
    history: component.history,
    trend: calculateTrend(component)
  };
}

/**
 * 更新组件价格（模拟爬虫更新）
 */
function updateComponentPrice(componentId, newPrice) {
  const data = loadPriceData();
  const component = data.components[componentId];

  if (!component) {
    return false;
  }

  // 添加到历史记录
  const today = new Date().toISOString().split('T')[0];
  const lastEntry = component.history[component.history.length - 1];

  if (lastEntry.date !== today) {
    component.history.push({
      date: today,
      price: newPrice
    });

    // 保持最多30条记录
    if (component.history.length > 30) {
      component.history.shift();
    }
  }

  component.price = newPrice;
  data.lastUpdate = new Date().toISOString();

  return savePriceData(data);
}

/**
 * 模拟爬虫更新所有配件价格
 * 真实环境中这里会调用淘宝爬虫或API
 */
function simulateScrapeTaobao() {
  const data = loadPriceData();
  const today = new Date().toISOString().split('T')[0];

  Object.keys(data.components).forEach(componentId => {
    const component = data.components[componentId];
    const lastPrice = component.history[component.history.length - 1].price;

    // 模拟价格波动 ±2%
    const volatility = component.price * 0.02;
    const newPrice = lastPrice + (Math.random() - 0.5) * volatility * 2;

    updateComponentPrice(componentId, Math.round(newPrice));
  });

  console.log(`[${new Date().toISOString()}] 价格更新完成`);
}

/**
 * 按类别获取配件
 */
function getComponentsByCategory(category) {
  const data = loadPriceData();
  const components = Object.values(data.components || {})
    .filter(comp => comp.category === category)
    .map(comp => ({
      id: comp.id,
      name: comp.name,
      category: comp.category,
      price: comp.price,
      trend: calculateTrend(comp)
    }));

  return components;
}

module.exports = {
  loadPriceData,
  savePriceData,
  getAllComponents,
  getComponentHistory,
  updateComponentPrice,
  simulateScrapeTaobao,
  getComponentsByCategory
};
