// 简单的 Node.js 服务器
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 初始化数据文件
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// 保存数据
app.post('/api/save-data', (req, res) => {
  try {
    const newData = {
      ...req.body,
      timestamp: new Date().toISOString(),
      ip: req.ip
    };
    
    // 读取现有数据
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    
    // 添加新数据
    data.push(newData);
    
    // 保存到文件
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    
    res.json({
      success: true,
      message: '数据保存成功',
      total: data.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '保存失败',
      error: error.message
    });
  }
});

// 获取所有数据
app.get('/api/get-data', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    res.json({
      success: true,
      data: data,
      total: data.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '读取失败',
      error: error.message
    });
  }
});

// 清空数据
app.delete('/api/clear-data', (req, res) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
    res.json({
      success: true,
      message: '数据已清空'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '清空失败',
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
