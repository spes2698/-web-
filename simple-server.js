const http = require('http');

// 尝试不同的端口
const ports = [3000, 3001, 8080, 8000, 5000];
let currentPortIndex = 0;

// 创建一个简单的HTTP服务器
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>测试服务器</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; line-height: 1.6; }
          .container { max-width: 800px; margin: 0 auto; }
          h1 { color: #333; }
          .success { color: green; }
          .box { padding: 15px; border: 1px solid #ddd; border-radius: 5px; margin-bottom: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>服务器测试页面</h1>
          <div class="box">
            <p class="success">✅ 服务器运行正常</p>
            <p>当前时间: ${new Date().toLocaleString()}</p>
            <p>请求路径: ${req.url}</p>
            <p>服务器端口: ${server.address().port}</p>
          </div>
          <div class="box">
            <h2>可用页面</h2>
            <ul>
              <li><a href="/">首页</a></li>
              <li><a href="/dashboard">仪表盘</a></li>
              <li><a href="/questions">题目管理</a></li>
              <li><a href="/statistics">统计分析</a></li>
              <li><a href="/practice">练习页面</a></li>
              <li><a href="/history">历史记录</a></li>
              <li><a href="/profile">个人中心</a></li>
              <li><a href="/admin">管理员控制台</a></li>
              <li><a href="/import-export">数据导入导出</a></li>
            </ul>
          </div>
        </div>
      </body>
    </html>
  `);
});

// 尝试在不同端口启动服务器
function tryPort() {
  if (currentPortIndex >= ports.length) {
    console.error('所有端口都被占用，无法启动服务器');
    return;
  }
  
  const port = ports[currentPortIndex];
  
  server.listen(port, () => {
    console.log(`测试服务器运行在 http://localhost:${port}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`端口 ${port} 被占用，尝试下一个端口...`);
      currentPortIndex++;
      tryPort();
    } else {
      console.error('启动服务器时出错:', err);
    }
  });
}

tryPort(); 