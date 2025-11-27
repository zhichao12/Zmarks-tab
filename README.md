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
