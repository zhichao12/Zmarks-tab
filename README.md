# Zmarks-tab

一个基于 Material You 设计风格的浏览器新标签页扩展，提供简洁、现代的书签管理体验。

## ✨ 特性

- 🎨 **Material You 设计** - 采用 Google Material You 设计语言，界面简洁现代
- 🔖 **智能书签管理** - 快速访问和管理常用网站书签
- 🔍 **多搜索引擎支持** - 支持 Google、DuckDuckGo、Brave、Wikipedia 等搜索引擎
- 📱 **响应式设计** - 适配不同屏幕尺寸和设备
- ⚡ **轻量高效** - 占用资源少，响应速度快
- 🔒 **隐私保护** - 注重用户隐私，不收集个人数据

## 🚀 安装

### Chrome/Edge 安装

1. 下载本项目到本地
2. 打开 Chrome/Edge 浏览器，进入扩展管理页面 (`chrome://extensions/`)
3. 开启"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择项目文件夹中的 `dist` 目录

### Firefox 安装

1. 下载本项目到本地
2. 打开 Firefox 浏览器，进入附加组件管理页面 (`about:addons`)
3. 点击齿轮图标，选择"从文件安装附加组件"
4. 选择项目文件夹中的 `dist/manifest.json` 文件

## 🛠️ 开发

### 环境要求

- Node.js 16+
- pnpm

### 本地开发

```bash
# 进入项目目录
cd zmarks-tab

# 安装依赖
pnpm install

# 构建项目
pnpm build

# 启动开发服务器
pnpm dev
```

## ☁️ 云端部署（GitHub + Cloudflare Pages + D1/KV）

> 需求：希望像 marks 项目一样，通过 GitHub 连接 Cloudflare，一键拉起 Pages + D1 + KV。下面是 Zmarks 的完整步骤（后端目录为 `tmarks/tmarks`，云书签 API 用于本扩展的 Cloud Bookmarks 面板）。

1. **Fork 仓库**
   - 在 GitHub Fork 本仓库，后续 Cloudflare 直接连接你的 Fork。

2. **Cloudflare Pages 连接 GitHub**
   - Cloudflare Dashboard → Workers & Pages → 创建项目 → 连接到 GitHub 选择 Fork。
   - 构建设置：
     - 根目录：`tmarks/tmarks`
     - 构建命令：`pnpm install && pnpm build:deploy`
     - 构建输出目录：`.deploy`
   - 保存后先让它跑一遍（首次可能因资源未配置而失败，继续下一步）。

3. **创建 D1 数据库**
   - Workers & Pages → D1 SQL Database → Create database
   - 名称建议：`tmarks-prod-db`

4. **创建 KV 命名空间（推荐）**
   - Workers & Pages → KV → Create a namespace
   - 推荐两个：
     - `RATE_LIMIT_KV`（API 访问限流，可防滥用）
     - `PUBLIC_SHARE_KV`（公开页缓存，加速分享页）

5. **绑定 D1/KV 到 Pages Functions**
   - 进入你的 Pages 项目 → 设置 → 函数 → 绑定：
     - D1：变量名 `DB`，选择第 3 步的 `tmarks-prod-db`
     - KV（可选）：变量名 `RATE_LIMIT_KV` → 选择对应命名空间
     - KV（可选）：变量名 `PUBLIC_SHARE_KV` → 选择对应命名空间

6. **配置环境变量**
   - 路径：项目设置 → 环境变量 → 生产环境
   - 业务变量（可直接写 Dashboard）：
     - `ALLOW_REGISTRATION`：是否开放注册，推荐 `"true"`（关闭则删掉该变量或设为非 "true"）
     - `ENVIRONMENT`：`production`
     - `JWT_ACCESS_TOKEN_EXPIRES_IN`：如 `"365d"`
     - `JWT_REFRESH_TOKEN_EXPIRES_IN`：如 `"365d"`
   - 敏感变量（只在 Dashboard 填写真实值，不要提交到代码）：
     - `JWT_SECRET`：至少 48 位随机字符串
     - `ENCRYPTION_KEY`：至少 48 位随机字符串

7. **初始化数据库**
   - Workers & Pages → D1 SQL Database → 打开 `tmarks-prod-db` → Console
   - 打开仓库文件 `tmarks/tmarks/migrations/d1_console_pure.sql`，复制全部 SQL，粘贴执行。

8. **重新部署**
   - 回到 Pages 项目 → 部署 → 重新触发部署（或点击“重试”）。
   - 部署完成后得到你的站点域名（如 `https://xxxx.pages.dev`），该地址即后端 API Base。

9. **在扩展中配置 Cloud Bookmarks**
   - 打开新标签页界面，点击左上角云朵图标 → 在弹出的配置区填写：
     - API 基址：上一步的 Pages 域名（如 `https://xxxx.pages.dev`）
     - X-API-Key：如后端启用了 API Key，则填写；未启用可留空
   - 点击“保存”后再点“↻”即可加载云书签。

### 项目结构

```
zmarks-tab/
├── dist/                 # 构建输出目录
├── favicon/             # 图标文件
├── fonts/               # 字体文件
├── images/              # 图片资源
├── locales/             # 国际化文件
├── scripts/             # 脚本文件
├── svgs/                # SVG 图标
├── build.js             # 构建脚本
├── index.html           # 主页面
├── manifest.json        # 扩展配置文件
├── package.json         # 项目配置
├── style.css            # 样式文件
└── README.md            # 项目说明
```

## 🌐 功能特性

### 书签管理
- 快速添加和管理书签
- 书签分类和搜索
- 自定义书签图标

### 搜索集成
- 支持多个搜索引擎
- 搜索建议和自动完成
- 快捷键搜索

### 主题定制
- 响应系统主题
- 自定义颜色方案
- 字体大小调节

## 📄 许可证

本项目基于 [MIT 许可证](LICENSE) 开源。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 📞 联系方式

如果你有任何问题或建议，欢迎通过以下方式联系：

- 提交 [Issue](../../issues)
- 发送邮件至：[your-email@example.com]

## 🙏 致谢

- 感谢 [Material Design](https://material.io/) 提供的设计指南
- 感谢所有贡献者的支持

---

⭐ 如果这个项目对你有帮助，请给它一个 Star！
