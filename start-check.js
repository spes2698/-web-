const http = require('http');
const { MongoClient } = require('mongodb');
const { exec } = require('child_process');

// 检查MongoDB连接
async function checkMongoDB() {
    try {
        const client = await MongoClient.connect('mongodb://localhost:27017');
        await client.close();
        console.log('✅ MongoDB连接正常');
        return true;
    } catch (error) {
        console.error('❌ MongoDB连接失败:', error.message);
        return false;
    }
}

// 检查后端服务
function checkBackend() {
    return new Promise((resolve) => {
        http.get('http://localhost:3001/health', (res) => {
            if (res.statusCode === 200) {
                console.log('✅ 后端服务运行正常');
                resolve(true);
            } else {
                console.error('❌ 后端服务异常');
                resolve(false);
            }
        }).on('error', () => {
            console.error('❌ 后端服务未启动');
            resolve(false);
        });
    });
}

// 检查前端服务
function checkFrontend() {
    return new Promise((resolve) => {
        http.get('http://localhost:3000', (res) => {
            if (res.statusCode === 200) {
                console.log('✅ 前端服务运行正常');
                resolve(true);
            } else {
                console.error('❌ 前端服务异常');
                resolve(false);
            }
        }).on('error', () => {
            console.error('❌ 前端服务未启动');
            resolve(false);
        });
    });
}

// 主检查函数
async function main() {
    console.log('开始检查服务状态...');
    
    const mongoOk = await checkMongoDB();
    if (!mongoOk) {
        console.log('提示: 请确保MongoDB已安装并运行');
        console.log('运行命令: mongod --port 27017');
    }
    
    const backendOk = await checkBackend();
    if (!backendOk) {
        console.log('提示: 请启动后端服务');
        console.log('运行命令: cd question-bank-server && npm run dev');
    }
    
    const frontendOk = await checkFrontend();
    if (!frontendOk) {
        console.log('提示: 请启动前端服务');
        console.log('运行命令: cd question-bank && npm run dev');
    }
    
    if (mongoOk && backendOk && frontendOk) {
        console.log('🎉 所有服务运行正常！');
        console.log('可以通过 http://localhost:3000 访问网站');
    } else {
        console.log('⚠️ 部分服务未正常运行，请按提示进行处理');
    }
}

main(); 