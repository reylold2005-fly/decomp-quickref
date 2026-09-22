#!/usr/bin/env python3
"""生成 PWA 图标:蓝紫渐变圆角方块 + 白色'释压'字样"""
from PIL import Image, ImageDraw, ImageFont

FONTS = [
    "/System/Library/Fonts/PingFang.ttc",
    "/System/Library/Fonts/Hiragino Sans GB.ttc",
    "/System/Library/Fonts/STHeiti Medium.ttc",
]

def load_font(size):
    for f in FONTS:
        try:
            return ImageFont.truetype(f, size)
        except Exception:
            continue
    return None

def make_icon(px, out):
    img = Image.new("RGB", (px, px))
    d = ImageDraw.Draw(img)
    # 对角渐变 #0b62d6 → #5a3bd6
    c1, c2 = (11, 98, 214), (90, 59, 214)
    for y in range(px):
        t = y / px
        d.line([(0, y), (px, y)], fill=tuple(int(a + (b - a) * t) for a, b in zip(c1, c2)))
    # 圆角遮罩
    mask = Image.new("L", (px, px), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, px, px], radius=int(px * 0.22), fill=255)
    base = Image.new("RGBA", (px, px), (0, 0, 0, 0))
    base.paste(img, (0, 0), mask)
    d = ImageDraw.Draw(base)
    # 白色飞机(下降姿态三角)
    cx, cy = px * 0.5, px * 0.30
    s = px * 0.10
    plane = [(cx, cy - s * 1.1), (cx + s * 0.7, cy + s * 0.9), (cx, cy + s * 0.45), (cx - s * 0.7, cy + s * 0.9)]
    d.polygon(plane, fill=(255, 255, 255, 235))
    # 文字
    font = load_font(int(px * 0.30))
    if font:
        d.text((px * 0.5, px * 0.63), "释压", font=font, fill="white", anchor="mm")
        f2 = load_font(int(px * 0.09))
        d.text((px * 0.5, px * 0.85), "程三土版", font=f2, fill=(255, 255, 255, 200), anchor="mm")
    base.save(out)
    print("wrote", out, f"{px}x{px}")

import os
os.makedirs("assets", exist_ok=True)
for px, name in [(512, "assets/icon-512.png"), (192, "assets/icon-192.png"), (180, "assets/icon-180.png")]:
    make_icon(px, name)
