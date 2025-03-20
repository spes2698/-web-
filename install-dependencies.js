const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function installDependencies(directory) {
    console.log(`正在安装 ${directory} 的依赖...`);
    try {
        execSync('npm install', {
            cwd: directory,
            stdio: 'inherit'
        });
        console.log(`✅ ${directory} 依赖安装完成`);
    } catch (error) {
        console.error(`❌ ${directory} 依赖安装失败:`, error.message);
        process.exit(1);
    }
}

function checkMongoDB() {
    try {
        execSync('mongod --version', { stdio: 'ignore' });
        console.log('✅ MongoDB已安装');
    } catch (error) {
        console.error('❌ MongoDB未安装，请先安装MongoDB');
        console.log('下载地址: https://www.mongodb.com/try/download/community');
        process.exit(1);
    }
}

function main() {
    console.log('开始检查环境...');
    
    // 检查MongoDB
    checkMongoDB();
    
    // 安装后端依赖
    if (fs.existsSync(path.join(__dirname, 'question-bank-server'))) {
        installDependencies('question-bank-server');
    } else {
        console.error('❌ 未找到后端项目目录');
        process.exit(1);
    }
    
    // 安装前端依赖
    if (fs.existsSync(path.join(__dirname, 'question-bank'))) {
        installDependencies('question-bank');
    } else {
        console.error('❌ 未找到前端项目目录');
        process.exit(1);
    }
    
    console.log('\n🎉 所有依赖安装完成！');
    console.log('\n启动说明:');
    console.log('1. 启动MongoDB: mongod');
    console.log('2. 启动后端: cd question-bank-server && npm run dev');
    console.log('3. 启动前端: cd question-bank && npm run dev');
    console.log('\n完成后访问 http://localhost:3000');
}

main(); 