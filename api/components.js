// api/components.js
// 提供电脑配件列表和相关数据

export default function handler(req, res) {
  // CORS 支持
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 获取所有配件列表
  if (req.method === 'GET') {
    const action = req.query.action;

    // 获取配件分类和列表
    if (!action || action === 'list') {
      const components = {
        cpu: [
          {
            id: 'cpu-1',
            name: 'Intel Core Ultra 9 285K',
            specs: '24核 / 3.7-5.7GHz',
            price: 3949,
            basePrice: 3949,
            color: '#FF6B9D',
            emote: '💻',
            category: 'CPU处理器',
          },
          {
            id: 'cpu-2',
            name: 'Intel Core Ultra 7 265K',
            specs: '16核 / 3.5-5.5GHz',
            price: 2799,
            basePrice: 2799,
            color: '#FF85B4',
            emote: '💻',
            category: 'CPU处理器',
          },
          {
            id: 'cpu-3',
            name: 'AMD Ryzen 9 9950X',
            specs: '16核 / 3.0-5.7GHz',
            price: 4499,
            basePrice: 4499,
            color: '#FFB3D9',
            emote: '💻',
            category: 'CPU处理器',
          },
          {
            id: 'cpu-4',
            name: 'AMD Ryzen 7 9700X',
            specs: '12核 / 3.8-5.6GHz',
            price: 2299,
            basePrice: 2299,
            color: '#FFBE6F',
            emote: '💻',
            category: 'CPU处理器',
          },
        ],
        gpu: [
          {
            id: 'gpu-1',
            name: 'NVIDIA RTX 5090 D',
            specs: '32GB GDDR7 / 420W',
            price: 16499,
            basePrice: 16499,
            color: '#00D4FF',
            emote: '🎮',
            category: 'GPU显卡',
          },
          {
            id: 'gpu-2',
            name: 'NVIDIA RTX 5080',
            specs: '16GB GDDR7 / 320W',
            price: 8299,
            basePrice: 8299,
            color: '#00E5FF',
            emote: '🎮',
            category: 'GPU显卡',
          },
          {
            id: 'gpu-3',
            name: 'NVIDIA RTX 5070 Ti',
            specs: '12GB GDDR7 / 250W',
            price: 6299,
            basePrice: 6299,
            color: '#00F0FF',
            emote: '🎮',
            category: 'GPU显卡',
          },
          {
            id: 'gpu-4',
            name: 'AMD RX 9070 XT',
            specs: '16GB GDDR6 / 280W',
            price: 4999,
            basePrice: 4999,
            color: '#00F7FF',
            emote: '🎮',
            category: 'GPU显卡',
          },
        ],
        ram: [
          {
            id: 'ram-1',
            name: 'DDR5 32GB (2x16GB) 6000MHz',
            specs: '3600 CAS',
            price: 699,
            basePrice: 699,
            color: '#4ECDC4',
            emote: '🧠',
            category: '内存条',
          },
          {
            id: 'ram-2',
            name: 'DDR5 64GB (2x32GB) 6000MHz',
            specs: '3600 CAS',
            price: 1399,
            basePrice: 1399,
            color: '#5FD8CC',
            emote: '🧠',
            category: '内存条',
          },
          {
            id: 'ram-3',
            name: 'DDR4 32GB (2x16GB) 3200MHz',
            specs: '经典型号',
            price: 359,
            basePrice: 359,
            color: '#70E5D8',
            emote: '🧠',
            category: '内存条',
          },
        ],
        ssd: [
          {
            id: 'ssd-1',
            name: '三星 990 Pro 2TB',
            specs: 'PCIe Gen4 / 7100MB/s',
            price: 1299,
            basePrice: 1299,
            color: '#95E1D3',
            emote: '💾',
            category: '固态硬盘',
          },
          {
            id: 'ssd-2',
            name: 'WD Black SN850X 2TB',
            specs: 'PCIe Gen4 / 7100MB/s',
            price: 1099,
            basePrice: 1099,
            color: '#A8E8DC',
            emote: '💾',
            category: '固态硬盘',
          },
          {
            id: 'ssd-3',
            name: '致态 TiPlus7100 2TB',
            specs: 'PCIe Gen4 / 5000MB/s',
            price: 799,
            basePrice: 799,
            color: '#BCEFE5',
            emote: '💾',
            category: '固态硬盘',
          },
        ],
        mb: [
          {
            id: 'mb-1',
            name: 'ROG STRIX Z890-E',
            specs: 'Intel Z890 / ATX',
            price: 3999,
            basePrice: 3999,
            color: '#FFD700',
            emote: '🔌',
            category: '主板',
          },
          {
            id: 'mb-2',
            name: 'ROG CROSSHAIR X870E HERO',
            specs: 'AMD X870E / ATX',
            price: 4999,
            basePrice: 4999,
            color: '#FFC700',
            emote: '🔌',
            category: '主板',
          },
          {
            id: 'mb-3',
            name: '华硕 B850M-K',
            specs: 'AMD B850 / mATX',
            price: 799,
            basePrice: 799,
            color: '#FFED4E',
            emote: '🔌',
            category: '主板',
          },
        ],
        cool: [
          {
            id: 'cool-1',
            name: '猫头鹰 NH-D15',
            specs: '双塔风冷 / 140W',
            price: 799,
            basePrice: 799,
            color: '#A8D8FF',
            emote: '❄️',
            category: '散热器',
          },
          {
            id: 'cool-2',
            name: '猫头鹰 NH-U12A',
            specs: '单塔风冷 / 120W',
            price: 699,
            basePrice: 699,
            color: '#C5E0FF',
            emote: '❄️',
            category: '散热器',
          },
          {
            id: 'cool-3',
            name: '海盗船 H150i Elite',
            specs: '360mm 一体水冷 / 120W',
            price: 1299,
            basePrice: 1299,
            color: '#E1EEFF',
            emote: '❄️',
            category: '散热器',
          },
        ],
      };

      res.status(200).json({ success: true, data: components });
    }
    // 获取单个配件详情
    else if (action === 'detail') {
      const { id } = req.query;
      // 这里可以从数据库获取详细信息
      res.status(200).json({ success: true, id: id });
    }
    // 获取推荐组合
    else if (action === 'recommend') {
      const combos = [
        {
          name: '高端办公/设计组合',
          components: ['cpu-1', 'gpu-2', 'ram-2', 'ssd-1', 'mb-1', 'cool-1'],
          totalPrice: 38394,
          description: '适合专业内容创作者',
        },
        {
          name: '游戏主机组合',
          components: ['cpu-3', 'gpu-1', 'ram-1', 'ssd-2', 'mb-4', 'cool-1'],
          totalPrice: 28394,
          description: '超高性能游戏体验',
        },
        {
          name: '家庭入门组合',
          components: ['cpu-4', 'gpu-4', 'ram-3', 'ssd-3', 'mb-3', 'cool-2'],
          totalPrice: 9194,
          description: '日常办公娱乐够用',
        },
      ];

      res.status(200).json({ success: true, recommendations: combos });
    }
    // 获取价格趋势
    else if (action === 'trends') {
      const { category } = req.query;
      // 这里可以从数据库获取价格趋势数据
      res.status(200).json({ success: true, category: category });
    }
  }

  res.status(404).json({ success: false, message: 'Not found' });
}
