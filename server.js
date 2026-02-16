const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 配置
const API_URL = process.env.NEWAPI_URL;
const API_KEY = process.env.NEWAPI_KEY;
const ADMIN_ID = process.env.NEWAPI_ADMIN_ID || '1';
const SITE_TITLE = process.env.SITE_TITLE || 'NewAPI Status';

// 检查配置
if (!process.env.NEWAPI_KEY || !process.env.NEWAPI_URL) {
    console.error('错误: 未检测到必要的环境变量。请在 .env 文件中配置 NEWAPI_URL 和 NEWAPI_KEY。');
    process.exit(1);
}

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// 获取配置信息
app.get('/api/config', (req, res) => {
    res.json({
        siteTitle: SITE_TITLE
    });
});

// API 路由
app.get('/api/stats', async (req, res) => {
    try {
        const { range } = req.query;
        let startTime, endTime;

        endTime = Math.floor(Date.now() / 1000);

        if (range === '7d') {
            startTime = endTime - (7 * 24 * 60 * 60);
        } else {
            // 默认 24h
            startTime = endTime - (24 * 60 * 60);
        }

        const response = await axios.get(API_URL, {
            params: {
                start_timestamp: startTime,
                end_timestamp: endTime
            },
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'New-Api-User': ADMIN_ID,
                'Content-Type': 'application/json'
            }
        });

        if (response.data.success) {
            res.json({
                success: true,
                data: response.data.data,
                meta: {
                    startTime,
                    endTime,
                    range
                }
            });
        } else {
            res.status(500).json({ success: false, message: response.data.message });
        }

    } catch (error) {
        console.error('API Error:', error.message);
        res.status(500).json({ success: false, message: 'Failed to fetch data' });
    }
});

// 所有其他请求返回 404
app.use((req, res) => {
    res.status(404).send('Not Found');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
