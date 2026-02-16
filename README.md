# NewAPI 状态监控页面

这是一个基于 Node.js 和 Vue 3 的轻量级状态监控页面，用于展示 NewAPI 的调用统计信息。

## 功能

- **实时数据**：展示最近 24 小时和 7 天的调用次数和 Token 消耗。
- **排行榜**：按模型调用次数和 Token 数排序。
- **可视化**：24 小时请求趋势折线图。
- **关键指标**：计算平均 TPM (Tokens Per Minute) 和 RPM (Requests Per Minute)。
- **响应式设计**：视图适配电脑和手机端。
> 如需添加可以提issues或者pr哦~

## 配置教程（先进行配置再部署！）

1.  **下载**：
    - 下载本项目所有文件并解压
    - 打开解压的文件夹

2.  **配置环境变量.env**：
    - 编辑文件夹中 `.env` 文件，填入你的 API 密钥（系统访问令牌）和站点名称

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/2abd01f0-34c6-4cbe-990c-e4cd732ee511" />

## 部署指南

推荐使用 **Docker** 进行部署，真的很方便。

### 方式一：Docker 部署 (最推荐)

如果你服务器上有 Docker，这是最简单的。我们提供了 **Docker Compose** 和 **Docker CLI** 两种方式。

#### A. 使用 Docker Compose (推荐，测试过)

1.  确保你已安装 `docker` 和 `docker-compose`。
2.  确保项目根目录下有 `.env` 配置文件（参考 `.env.example` 或直接使用现有的）。
3.  在项目根目录下，直接运行：
    ```bash
    docker-compose up -d
    ```
4.  如果要停止服务：`docker-compose down`

#### B. 使用 Docker CLI

1.  **构建镜像**：
    ```bash
    docker build -t newapi-status .
    ```

2.  **运行容器** (带环境变量配置)：
    ```bash
    docker run -d \
      --name newapi-status \
      -p 3000:3000 \
      -e NEWAPI_URL="https://api.xinjianya.top/api/data/" \
      -e NEWAPI_KEY="你的API_KEY" \
      -e NEWAPI_ADMIN_ID="1" \
      -e SITE_TITLE="星见雅API" \
      --restart always \
      newapi-status
    ```
    
### 备注：.env更新后需要删除容器重新运行！

### 方式二：常规部署 (Node.js + PM2)

如果你服务器没有 Docker，可以直接在系统里跑。

#### 1. 环境准备
确保服务器安装了 **Node.js** (v14 或更高版本) 和 npm。
*   CentOS: `yum install nodejs`
*   Ubuntu: `apt install nodejs`

#### 2. 上传代码
将整个项目文件夹上传到服务器。

#### 3. 安装依赖
在项目根目录下运行：
```bash
npm install
```

#### 4. 启动服务
使用 PM2 让服务在后台运行并在崩溃后自动重启。

1. **安装 PM2** (如果尚未安装)：
   ```bash
   npm install pm2 -g
   ```

2. **启动服务**：
   ```bash
   pm2 start server.js --name "newapi-status"
   ```

3. **设置开机自启**：
   ```bash
   pm2 save
   pm2 startup
   ```

### 方式三：Nginx 反向代理 (可选)
如果你希望通过域名（如 `status.yourdomain.com`）访问，可以在 Nginx 配置文件中添加：

```nginx
server {
    listen 80;
    server_name status.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 项目结构

- `server.js`: Node.js 后端，负责代理 API 请求。
- `public/index.html`: 前端页面，包含 Vue 3 逻辑和 UI。
- `package.json`: 项目依赖配置。
