#!/usr/bin/env python3
"""把透明底菜品图统一摆进 1000x1000 画布: 外接框面积占 60%, 长边不超过 85%, 居中。
用法: python3 scripts/fit-dish.py <输入 png/webp> <输出 webp> [--wide]
--wide: 给「招牌卡」(分区只有 1 张配图,横向 2:1 大图框,框里只露出画布中间一半高度)用——宽不超过 80%、高不超过 40%(图框高度的八成)。
放大会糊, 所以输入比目标小时只居中不放大(重做请拿 1024 原始 PNG)。"""
import sys
from PIL import Image

CANVAS, AREA, LONG = 1000, 0.60, 0.85

def fit(src, dst, wide=False):
    im = Image.open(src).convert('RGBA')
    box = im.split()[3].point(lambda v: 255 if v > 20 else 0).getbbox()
    im = im.crop(box)
    w, h = im.size
    s = min((AREA * CANVAS * CANVAS / (w * h)) ** 0.5, LONG * CANVAS / max(w, h))
    if wide:
        s = min(0.80 * CANVAS / w, 0.40 * CANVAS / h)
    if src.lower().endswith('.webp'):
        s = min(s, 1)
    im = im.resize((round(w * s), round(h * s)), Image.LANCZOS)
    out = Image.new('RGBA', (CANVAS, CANVAS), (0, 0, 0, 0))
    out.alpha_composite(im, ((CANVAS - im.width) // 2, (CANVAS - im.height) // 2))
    out.save(dst, 'WEBP', quality=88, method=6)
    print(f'{dst}: {im.width}x{im.height} area={im.width * im.height / CANVAS ** 2:.0%}')

if __name__ == '__main__':
    fit(sys.argv[1], sys.argv[2], '--wide' in sys.argv)
