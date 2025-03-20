# 题库管理系统访问指南

## 解决连接问题

如果您遇到"拒绝连接"的问题，请按照以下步骤操作：

### 1. 检查服务状态

运行检查脚本查看各服务运行状态：

```bash
node start-check.js
```

### 2. 解决端口占用问题

如果端口被占用，可以使用以下命令查找并关闭占用端口的进程（需要管理员权限）：

```powershell
# 查找占用3000端口的进程
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue).OwningProcess

# 关闭占用3000端口的进程
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue).OwningProcess | Stop-Process -Force
```

### 3. 启动服务

按顺序启动以下服务：

```bash
# 启动MongoDB
mongod

# 启动后端服务（新终端）
cd question-bank-server
npm run dev

# 启动前端服务（新终端）
cd question-bank
npm run dev
```

### 4. 使用替代端口

我们已将前端配置为使用8080端口，可通过以下地址访问：

```
http://localhost:8080
```

后端API地址仍为：

```
http://localhost:3001
```

## 可用页面

- 首页: http://localhost:8080/
- 仪表盘: http://localhost:8080/dashboard
- 题目管理: http://localhost:8080/questions
- 统计分析: http://localhost:8080/statistics
- 练习页面: http://localhost:8080/practice
- 历史记录: http://localhost:8080/history
- 个人中心: http://localhost:8080/profile
- 管理员控制台: http://localhost:8080/admin
- 数据导入导出: http://localhost:8080/import-export 