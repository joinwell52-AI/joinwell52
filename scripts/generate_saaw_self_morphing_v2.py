from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

OUT = Path('docs/public/assets/covers/03-saaw-self-morphing-loop-fixed-v2.png')
FONT_REG = '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'
FONT_BOLD = '/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'

def font(size, bold=False):
    return ImageFont.truetype(FONT_BOLD if bold else FONT_REG, size=size)

def center(draw, xy, text, fnt, fill):
    draw.text(xy, text, font=fnt, fill=fill, anchor='mm')

def arrow_right(draw, x1, y, x2, color, width=6):
    draw.line((x1, y, x2 - 20, y), fill=color, width=width)
    draw.polygon([(x2, y), (x2 - 26, y - 16), (x2 - 26, y + 16)], fill=color)

def arrow_left(draw, x1, y, x2, color, width=6):
    draw.line((x1, y, x2 + 20, y), fill=color, width=width)
    draw.polygon([(x2, y), (x2 + 26, y - 16), (x2 + 26, y + 16)], fill=color)

def arrow_down(draw, x, y1, y2, color, width=6):
    draw.line((x, y1, x, y2 - 20), fill=color, width=width)
    draw.polygon([(x, y2), (x - 16, y2 - 28), (x + 16, y2 - 28)], fill=color)

W, H = 1500, 940
img = Image.new('RGB', (W, H), (8, 16, 29))
d = ImageDraw.Draw(img)
d.rounded_rectangle((0, 0, W - 1, H - 1), radius=36, fill=(10, 18, 33))

d.text((90, 55), 'Self-Morphing: Development Runtime → Work Runtime', font=font(46, True), fill='white')
d.text((90, 122), '“自己开发自己”不是无限自改，而是受治理地开发、验证、部署新的数字员工形态',
       font=font(27), fill=(160, 178, 207))

rects = [
    (90, 280, 410, 460, (20, 41, 65), (95, 220, 255)),
    (500, 280, 865, 460, (23, 33, 58), (141, 156, 255)),
    (970, 280, 1410, 460, (33, 29, 57), (170, 140, 255)),
    (920, 590, 1410, 770, (21, 40, 66), (97, 217, 255)),
    (385, 590, 760, 770, (23, 34, 57), (139, 154, 255)),
]
for r in rects:
    d.rounded_rectangle(r[:4], radius=28, fill=r[4], outline=r[5], width=2)

center(d, (250, 322), 'META-DEV RUNTIME', font(23, True), (100, 223, 255))
center(d, (250, 380), 'PM · DEV · QA · OPS', font(30, True), 'white')
center(d, (250, 425), '元开发团队', font(22), (190, 204, 225))
arrow_right(d, 410, 370, 500, (105, 216, 255), 6)

center(d, (682, 322), 'WORKER PACKAGE', font(23, True), (170, 180, 255))
center(d, (682, 370), 'Role · Workflow · Skills', font(27, True), 'white')
center(d, (682, 414), 'Permissions · Policies', font(20), (190, 204, 225))
center(d, (682, 440), 'Human Decision Gates', font(20), (190, 204, 225))
arrow_right(d, 865, 370, 970, (145, 154, 255), 6)

center(d, (1190, 322), 'VALIDATE + DECISION', font(23, True), (195, 168, 255))
center(d, (1190, 370), 'QA · Governance', font(27, True), 'white')
center(d, (1190, 408), 'Human Authorization Gate', font(22, True), 'white')
center(d, (1190, 440), '验证、治理与授权', font(20), (190, 204, 225))
arrow_down(d, 1190, 460, 588, (168, 143, 255), 6)

center(d, (1165, 630), 'DOMAIN WORKER RUNTIME', font(23, True), (103, 221, 255))
center(d, (1165, 682), 'Contract · Finance', font(26, True), 'white')
center(d, (1165, 718), 'Operations', font(26, True), 'white')
center(d, (1165, 750), '领域数字员工团队持续履职', font(19), (190, 204, 225))
# One clean leftward transition into work evidence; the earlier raster had a doubled arrowhead here.
arrow_left(d, 920, 680, 760, (117, 207, 255), 6)

center(d, (572, 630), 'WORK EVIDENCE', font(23, True), (169, 179, 255))
center(d, (572, 685), 'Reports · Issues · Results', font(27, True), 'white')
center(d, (572, 730), '工作事实、问题与成果', font(20), (190, 204, 225))

d.line((385, 680, 235, 680), fill=(100, 216, 255), width=6)
d.line((235, 680, 235, 485), fill=(100, 216, 255), width=6)
d.polygon([(235, 460), (219, 488), (251, 488)], fill=(100, 216, 255))

d.text((120, 825), 'Develop → Validate → Deploy → Work → Observe → Improve',
       font=font(28, True), fill=(225, 235, 248))
d.text((120, 872), '软件开发与软件履职开始进入同一个可治理生命周期。',
       font=font(22), fill=(160, 178, 205))

OUT.parent.mkdir(parents=True, exist_ok=True)
img.save(OUT, 'PNG')
print(f'wrote {OUT} {img.size}')
