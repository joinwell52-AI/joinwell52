from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


OUT = Path(__file__).with_name("03-visuals")
W, H = 1600, 900

BG = "#F6F9FC"
PAPER = "#FFFFFF"
INK = "#17324D"
MUTED = "#60758A"
LINE = "#B8C8D6"
TEAL = "#25A8B5"
TEAL_SOFT = "#DDF4F5"
ORANGE = "#F29B4B"
ORANGE_SOFT = "#FFF0DF"
AMBER = "#DFAF3E"
AMBER_SOFT = "#FFF7D8"
NAVY_SOFT = "#E7EFF6"
GREEN = "#4FAE82"
GREEN_SOFT = "#E2F4EB"

FONT_REGULAR = Path(r"C:\Windows\Fonts\segoeui.ttf")
FONT_SEMIBOLD = Path(r"C:\Windows\Fonts\seguisb.ttf")
FONT_MONO = Path(r"C:\Windows\Fonts\consola.ttf")


def font(size: int, *, bold: bool = False, mono: bool = False) -> ImageFont.FreeTypeFont:
    path = FONT_MONO if mono else FONT_SEMIBOLD if bold else FONT_REGULAR
    return ImageFont.truetype(str(path), size)


def make_canvas(title: str, subtitle: str) -> tuple[Image.Image, ImageDraw.ImageDraw]:
    image = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle((54, 44, W - 54, H - 44), radius=34, fill=PAPER, outline="#D9E4EC", width=2)
    draw.text((96, 78), title, font=font(39, bold=True), fill=INK)
    draw.text((98, 132), subtitle, font=font(22), fill=MUTED)
    draw.line((98, 178, W - 98, 178), fill="#DDE7EE", width=2)
    return image, draw


def centered(draw: ImageDraw.ImageDraw, bounds: tuple[int, int, int, int], text: str, *, size: int = 24,
             fill: str = INK, bold: bool = False, mono: bool = False) -> None:
    x1, y1, x2, y2 = bounds
    f = font(size, bold=bold, mono=mono)
    box = draw.multiline_textbbox((0, 0), text, font=f, spacing=7, align="center")
    tw, th = box[2] - box[0], box[3] - box[1]
    draw.multiline_text(((x1 + x2 - tw) / 2, (y1 + y2 - th) / 2), text, font=f, fill=fill,
                        spacing=7, align="center")


def box(draw: ImageDraw.ImageDraw, bounds: tuple[int, int, int, int], text: str, *, fill: str = NAVY_SOFT,
        outline: str = LINE, text_fill: str = INK, radius: int = 22, size: int = 24, bold: bool = True,
        mono: bool = False, width: int = 2) -> None:
    x1, y1, x2, y2 = bounds
    draw.rounded_rectangle((x1 + 7, y1 + 9, x2 + 7, y2 + 9), radius=radius, fill="#DDE6ED")
    draw.rounded_rectangle(bounds, radius=radius, fill=fill, outline=outline, width=width)
    centered(draw, bounds, text, size=size, fill=text_fill, bold=bold, mono=mono)


def arrow(draw: ImageDraw.ImageDraw, start: tuple[int, int], end: tuple[int, int], *, color: str = TEAL,
          width: int = 5, head: int = 14) -> None:
    draw.line((start, end), fill=color, width=width)
    angle = math.atan2(end[1] - start[1], end[0] - start[0])
    left = (end[0] - head * math.cos(angle - math.pi / 6), end[1] - head * math.sin(angle - math.pi / 6))
    right = (end[0] - head * math.cos(angle + math.pi / 6), end[1] - head * math.sin(angle + math.pi / 6))
    draw.polygon((end, left, right), fill=color)


def poly_arrow(draw: ImageDraw.ImageDraw, points: list[tuple[int, int]], *, color: str = TEAL, width: int = 5,
               head: int = 14) -> None:
    draw.line(points, fill=color, width=width, joint="curve")
    arrow(draw, points[-2], points[-1], color=color, width=width, head=head)


def dashed(draw: ImageDraw.ImageDraw, start: tuple[int, int], end: tuple[int, int], *, color: str = MUTED,
           width: int = 4, dash: int = 13, gap: int = 9) -> None:
    dx, dy = end[0] - start[0], end[1] - start[1]
    length = math.hypot(dx, dy)
    ux, uy = dx / length, dy / length
    pos = 0.0
    while pos < length:
        a = pos
        b = min(pos + dash, length)
        draw.line((start[0] + ux * a, start[1] + uy * a, start[0] + ux * b, start[1] + uy * b),
                  fill=color, width=width)
        pos += dash + gap


def footer(draw: ImageDraw.ImageDraw, text: str) -> None:
    draw.rounded_rectangle((98, 806, W - 98, 838), radius=16, fill="#EEF4F8")
    centered(draw, (110, 806, W - 110, 838), text, size=17, fill=MUTED)


def save(image: Image.Image, name: str) -> None:
    path = OUT / name
    image.save(path, format="PNG", optimize=True)
    assert image.size == (W, H)


def shared_ledger() -> None:
    image, draw = make_canvas(
        "FILES AS A SHARED WORKING LEDGER",
        "One inspectable fact surface for humans, agents, and tools",
    )

    box(draw, (555, 235, 1045, 675), "", fill="#FAFCFE", outline="#8DA8BA", radius=34, width=3)
    draw.rounded_rectangle((605, 275, 995, 375), radius=20, fill=TEAL_SOFT, outline=TEAL, width=3)
    centered(draw, (605, 275, 995, 375), "TASK / REPORT / ISSUE / REVIEW", size=23, bold=True, mono=True)
    draw.rounded_rectangle((605, 405, 995, 505), radius=20, fill=ORANGE_SOFT, outline=ORANGE, width=3)
    centered(draw, (605, 405, 995, 505), "PATH = CURRENT STATE", size=25, bold=True, mono=True)
    draw.rounded_rectangle((605, 535, 995, 635), radius=20, fill=AMBER_SOFT, outline=AMBER, width=3)
    centered(draw, (605, 535, 995, 635), "EVENTS = HISTORY", size=25, bold=True, mono=True)

    source_nodes = [
        ((130, 250, 390, 330), "PM"),
        ((130, 365, 390, 445), "DEV"),
        ((130, 480, 390, 560), "OPS"),
        ((130, 595, 390, 675), "QA"),
    ]
    for bounds, label in source_nodes:
        box(draw, bounds, label, fill="#F1F6FA", size=24)
        arrow(draw, (bounds[2], (bounds[1] + bounds[3]) // 2), (555, 455), color=TEAL, width=4)

    reader_nodes = [
        ((1210, 250, 1470, 330), "HUMAN REVIEW"),
        ((1210, 365, 1470, 445), "AGENT ACTION"),
        ((1210, 480, 1470, 560), "CLI CHECK"),
        ((1210, 595, 1470, 675), "PWA VIEW"),
    ]
    for bounds, label in reader_nodes:
        box(draw, bounds, label, fill="#F1F6FA", size=21)
        arrow(draw, (1045, 455), (bounds[0], (bounds[1] + bounds[3]) // 2), color=ORANGE, width=4)

    draw.text((174, 211), "WRITERS", font=font(18, bold=True), fill=MUTED)
    draw.text((1280, 211), "READERS", font=font(18, bold=True), fill=MUTED)
    footer(draw, "COORDINATION FACTS  •  NOT EXECUTION  •  NOT DISTRIBUTED CONSISTENCY")
    save(image, "figure-shared-working-ledger.png")


def lifecycle() -> None:
    image, draw = make_canvas(
        "FCoP V3: LOCATION DEFINES STATE",
        "Seven legal transitions; evidence and governance artifacts remain separate",
    )
    y1, y2 = 310, 430
    nodes = [
        ((130, y1, 350, y2), "inbox/", TEAL_SOFT, TEAL),
        ((420, y1, 640, y2), "active/", NAVY_SOFT, "#6A8FAA"),
        ((710, y1, 930, y2), "review/", ORANGE_SOFT, ORANGE),
        ((1000, y1, 1220, y2), "done/", GREEN_SOFT, GREEN),
        ((1290, y1, 1510, y2), "archive/", "#F0EEF8", "#8B7AB8"),
    ]
    for bounds, label, fill_color, outline in nodes:
        box(draw, bounds, label, fill=fill_color, outline=outline, size=29, mono=True)

    transitions = [
        ((350, 370), (420, 370), "claim_task"),
        ((640, 370), (710, 370), "submit_task"),
        ((930, 370), (1000, 370), "approve_task"),
        ((1220, 370), (1290, 370), "archive_task"),
    ]
    for start, end, label in transitions:
        arrow(draw, start, end, color=INK, width=4, head=12)
        tw = draw.textbbox((0, 0), label, font=font(15, mono=True))[2]
        draw.text(((start[0] + end[0] - tw) / 2, 336), label, font=font(15, mono=True), fill=MUTED)

    poly_arrow(draw, [(530, 430), (530, 500), (1110, 500), (1110, 430)], color=GREEN, width=4)
    centered(draw, (680, 466, 960, 502), "finish_task", size=16, fill=GREEN, mono=True)
    poly_arrow(draw, [(820, 430), (820, 545), (530, 545), (530, 430)], color=ORANGE, width=4)
    centered(draw, (610, 516, 760, 548), "reject_task", size=16, fill=ORANGE, mono=True)

    box(draw, (270, 640, 630, 735), "reports/REPORT-*\nexecution evidence", fill=TEAL_SOFT, outline=TEAL,
        size=20, mono=True)
    box(draw, (970, 640, 1330, 735), "reviews/REVIEW-*\ngovernance judgment", fill=AMBER_SOFT, outline=AMBER,
        size=20, mono=True)
    dashed(draw, (630, 688), (810, 430), color=TEAL, width=4)
    dashed(draw, (970, 688), (830, 430), color=AMBER, width=4)
    draw.text((685, 620), "evidence only", font=font(17, bold=True), fill=TEAL)
    draw.text((845, 620), "separate decision", font=font(17, bold=True), fill=AMBER)
    draw.text((99, 352), "CREATE", font=font(16, bold=True), fill=MUTED)
    arrow(draw, (92, 370), (130, 370), color=TEAL, width=4, head=11)
    footer(draw, "WRITING A REPORT OR REVIEW DOES NOT MOVE A TASK BY ITSELF")
    save(image, "figure-fcop-lifecycle-and-artifacts.png")


def atomic_commit() -> None:
    image, draw = make_canvas(
        "WRITE — FSYNC — REPLACE — CLEANUP",
        "Destination publication is atomic; the complete cross-directory move is not one syscall",
    )
    columns = [
        (245, "SOURCE", "active/TASK.md"),
        (610, "CLIENT", "memory"),
        (990, "TARGET TEMP", "review/.fcop-*.tmp"),
        (1350, "DESTINATION", "review/TASK.md"),
    ]
    for x, title, path in columns:
        centered(draw, (x - 150, 210, x + 150, 248), title, size=18, fill=MUTED, bold=True)
        centered(draw, (x - 160, 249, x + 160, 291), path, size=18, fill=INK, mono=True)
        draw.line((x, 300, x, 742), fill="#CFDAE3", width=3)

    steps = [
        (330, (245, 330), (610, 330), "1  READ SOURCE", TEAL),
        (400, (610, 400), (610, 400), "2  APPEND TRANSITION IN MEMORY", ORANGE),
        (475, (610, 475), (990, 475), "3  WRITE COMPLETE NEW TASK", TEAL),
        (550, (990, 550), (990, 550), "4  FSYNC TEMP FILE", AMBER),
        (625, (990, 625), (1350, 625), "5  OS.REPLACE → DESTINATION", GREEN),
        (700, (610, 700), (245, 700), "6  UNLINK SOURCE AFTER COMMIT", ORANGE),
    ]
    for y, start, end, label, color in steps:
        if start == end:
            draw.ellipse((start[0] - 9, y - 9, start[0] + 9, y + 9), fill=color)
            draw.line((start[0] + 12, y, start[0] + 60, y), fill=color, width=4)
            draw.text((start[0] + 72, y - 16), label, font=font(19, bold=True), fill=color)
        else:
            arrow(draw, start, end, color=color, width=5, head=14)
            x = min(start[0], end[0]) + 26
            draw.rounded_rectangle((x, y - 31, x + 330, y + 1), radius=15, fill=PAPER)
            draw.text((x + 8, y - 27), label, font=font(18, bold=True), fill=color)

    draw.rounded_rectangle((1234, 646, 1466, 680), radius=17, fill=GREEN_SOFT, outline=GREEN, width=2)
    centered(draw, (1234, 646, 1466, 680), "COMMIT POINT", size=17, fill=GREEN, bold=True)
    footer(draw, "SAME-MOUNT SEMANTICS REQUIRED  •  FILE FSYNC ≠ DIRECTORY DURABILITY  •  EXACTLY-ONCE NOT IMPLIED")
    save(image, "figure-fcop-atomic-commit.png")


def accepted_delivery() -> None:
    image, draw = make_canvas(
        "FROM REQUEST TO ACCEPTED DELIVERY",
        "Parallel agents become a team only when ownership, evidence, and decision rights stay distinct",
    )
    top = 300
    nodes = [
        ((95, top, 315, top + 120), "REQUIREMENT\nCARD", TEAL_SOFT, TEAL),
        ((365, top, 585, top + 120), "PM\nTASK SPLIT", NAVY_SOFT, "#6A8FAA"),
        ((635, 250, 895, 470), "DEV\nOPS\nQA", ORANGE_SOFT, ORANGE),
        ((945, top, 1165, top + 120), "DIFF + TESTS\n+ REPORTS", AMBER_SOFT, AMBER),
        ((1215, top, 1465, top + 120), "PM DECISION\nACCEPT / REWORK", GREEN_SOFT, GREEN),
    ]
    for bounds, label, fill_color, outline in nodes:
        box(draw, bounds, label, fill=fill_color, outline=outline, size=22)
    for start, end in [((315, 360), (365, 360)), ((585, 360), (635, 360)), ((895, 360), (945, 360)),
                       ((1165, 360), (1215, 360))]:
        arrow(draw, start, end, color=INK, width=5, head=14)

    box(draw, (1030, 600, 1250, 700), "PM FINAL\nREPORT", fill=GREEN_SOFT, outline=GREEN, size=21)
    box(draw, (1300, 600, 1510, 700), "HUMAN\nAPPROVAL", fill="#F0EEF8", outline="#8B7AB8", size=21)
    arrow(draw, (1340, 420), (1140, 600), color=GREEN, width=5)
    arrow(draw, (1250, 650), (1300, 650), color="#8B7AB8", width=5)

    box(draw, (650, 610, 900, 710), "EVAL\nOBSERVATION", fill=TEAL_SOFT, outline=TEAL, size=21)
    dashed(draw, (1030, 650), (900, 660), color=TEAL, width=4)
    centered(draw, (900, 700, 1110, 736), "side channel", size=16, fill=TEAL, bold=True)

    poly_arrow(draw, [(1340, 420), (1340, 520), (475, 520), (475, 420)], color=ORANGE, width=4)
    centered(draw, (780, 486, 1040, 524), "rework creates a new TASK", size=16, fill=ORANGE, bold=True)
    footer(draw, "WORKER 'DONE' = A CLAIM  •  QA TESTS INDEPENDENTLY  •  HUMANS OWN FINAL RISK")
    save(image, "figure-cursor-accepted-delivery.png")


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    shared_ledger()
    lifecycle()
    atomic_commit()
    accepted_delivery()
    print("Rendered 4 explanatory figures to", OUT)
