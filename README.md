# 释压应急程序速查(程三土版)

离线可用的释压应急程序速查网页(PWA)。仅供参考学习,运行中一切以公司现行有效版本程序简令为准。

- 在线地址（HP 服务器 + Cloudflare Tunnel）：https://decomp.reylold2005.com/
- 备用地址（GitHub Pages）：https://reylold2005-fly.github.io/decomp-quickref/
- iPad:Safari 打开 → 分享 → 添加到主屏幕,之后完全离线可用

## 部署

服务器使用 `compose.yaml` 启动静态文件服务，仅监听宿主机
`127.0.0.1:8082`；Cloudflare Tunnel 将
`decomp.reylold2005.com` 转发到 `http://localhost:8082`。
