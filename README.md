# 释压应急程序速查（程三土版）

> 仅供参考学习；运行中一切以公司现行有效版本程序简令为准。数据校验状态见 [`docs/current-state.md`](docs/current-state.md)，AI 修改规则见 [`AGENTS.md`](AGENTS.md)。

输入两个航路点后显示对应航段的释压应急程序、飞行演示和决策流程图。网页可完全离线使用。

- 在线地址：<https://reylold2005-fly.github.io/decomp-quickref/>
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

输出为 `dist/释压程序速查_程三土版_v0.6.html` 和 `dist/site/`。发布前必须核对当前有效资料、保留待验证标记，并测试离线重载。
