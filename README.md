# 释压应急程序速查

> 仅供参考学习；运行中一切以公司现行有效版本程序简令为准。数据校验状态见 [`docs/current-state.md`](docs/current-state.md)，AI 修改规则见 [`AGENTS.md`](AGENTS.md)。

输入两个航路点后显示对应航段的释压应急程序、飞行演示和决策流程图。网页可完全离线使用。

- 正式地址（HP + Cloudflare Tunnel）：<https://decomp.reylold2005.com/>
- 备用地址（GitHub Pages）：<https://reylold2005-fly.github.io/decomp-quickref/>
- iPad：Safari 打开 → 分享 → 添加到主屏幕

## 仓库结构

- 根目录 `index.html`、图标、manifest 和 service worker：当前 GitHub Pages 交付物
- `src/index.html`：程序与数据源
- `archify/gen-dg.mjs`、`archify/spec-*.json`：决策图生成源
- `build.mjs`：生成离线单文件与 `dist/site`
- `docs/current-state.md`：当前版本、数据验证边界和安全更新流程

## 构建

先按需要生成 `archify/dg-*.html`，再在仓库根目录运行：

```bash
node build.mjs
```

输出为 `dist/释压程序速查_V1.5.html` 和 `dist/site/`。发布前必须核对当前有效资料、保留待验证标记，并测试离线重载。

## 部署

服务器使用 `compose.yaml` 启动静态文件服务，仅监听宿主机
`127.0.0.1:8082`；Cloudflare Tunnel 将
`decomp.reylold2005.com` 转发到 `http://localhost:8082`。

## 更新与验证

V1.5 在页面上方显示当前版本及“检查更新”按钮。检查成功且完整缓存了新版本后，点击“刷新使用新版”加载；离线或下载失败时保留已有离线版本。

修改 `src/index.html` 或 `src/sw.js` 后运行 `node build.mjs`，构建指纹会自动变化，即使显示版本号不变也能检测更新。正式版本号由 HTML 中的 `app-version` 标记定义；发布时同时同步生成的 HTML 和 service worker。

更新回归测试：安装 Python Playwright 及 Chromium 后运行 `python3 tests/test_pwa_update.py`（会启动本机临时 HTTP 服务，验证旧版迁移、离线、新版确认及下载失败）。
