#!/usr/bin/env python3
"""Build the Jollygunj banquet booklet in the same form as the BYG celebrations menu."""

import math
from pathlib import Path

import pymupdf

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "files" / "Jollygunj_Banquet_Menu.pdf"

W, H = 595.28, 841.89
PLUM = (76 / 255, 20 / 255, 54 / 255)
CREAM = (246 / 255, 239 / 255, 228 / 255)
GOLD = (198 / 255, 138 / 255, 28 / 255)
INK = (36 / 255, 16 / 255, 24 / 255)
SERIF = "/System/Library/Fonts/Supplemental/Georgia.ttf"
SERIFB = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"
SANS = "/System/Library/Fonts/Supplemental/GillSans.ttc"


def font(page, name, file):
    if file.endswith(".ttc"):
        face = pymupdf.Font(fontfile=file)
        page.insert_font(fontname=name, fontbuffer=face.buffer, set_simple=True)
    else:
        page.insert_font(fontname=name, fontfile=file, set_simple=True)


def use(page):
    font(page, "serif", SERIF)
    font(page, "serifb", SERIFB)
    font(page, "sans", SANS)


def sheet(page, inset=26):
    page.draw_rect(page.rect, color=PLUM, fill=PLUM)
    rect = pymupdf.Rect(inset, inset, W - inset, H - inset)
    page.draw_rect(rect, color=CREAM, fill=CREAM)
    step, rad = 14, 6.5
    x = rect.x0
    while x <= rect.x1 + 1:
        page.draw_circle(pymupdf.Point(x, rect.y0), rad, color=PLUM, fill=PLUM)
        page.draw_circle(pymupdf.Point(x, rect.y1), rad, color=PLUM, fill=PLUM)
        x += step
    y = rect.y0
    while y <= rect.y1 + 1:
        page.draw_circle(pymupdf.Point(rect.x0, y), rad, color=PLUM, fill=PLUM)
        page.draw_circle(pymupdf.Point(rect.x1, y), rad, color=PLUM, fill=PLUM)
        y += step
    return pymupdf.Rect(rect.x0 + 22, rect.y0 + 22, rect.x1 - 22, rect.y1 - 22)


def bar(page, cx, y, text, width=300, height=30):
    rect = pymupdf.Rect(cx - width / 2, y, cx + width / 2, y + height)
    page.draw_rect(rect, color=GOLD, fill=GOLD)
    page.insert_textbox(rect, text, fontname="serifb", fontsize=13, color=PLUM, align=1)
    return y + height


def label(page, x, y, text, width):
    page.insert_textbox(
        pymupdf.Rect(x, y, x + width, y + 16),
        " ".join(text),
        fontname="sans",
        fontsize=9,
        color=GOLD,
        align=1,
    )
    return y + 16


def paragraph(page, rect, text, size=10.5, align=1, fontname="sans", color=INK):
    page.insert_textbox(rect, text, fontname=fontname, fontsize=size, color=color, align=align)
    return rect.y1


def simple_package(page, y, inner, title, drinks, food):
    y = bar(page, (inner.x0 + inner.x1) / 2, y, title, width=inner.width - 36)
    y += 12
    y = label(page, inner.x0, y, "BEVERAGES", inner.width)
    y = paragraph(page, pymupdf.Rect(inner.x0 + 28, y, inner.x1 - 28, y + 36), drinks) + 6
    y = label(page, inner.x0, y, "FOOD", inner.width)
    y = paragraph(page, pymupdf.Rect(inner.x0 + 24, y, inner.x1 - 24, y + 48), food)
    return y + 18


def spirit_block(page, y, inner, title, columns, extras, food):
    y = bar(page, (inner.x0 + inner.x1) / 2, y, title, width=inner.width - 36)
    y += 10
    y = label(page, inner.x0, y, "BEVERAGES", inner.width)
    y += 4
    gap = 8
    col_w = (inner.width - gap * (len(columns) - 1)) / len(columns)
    heights = []
    for i, (head, items) in enumerate(columns):
        x = inner.x0 + i * (col_w + gap)
        page.insert_textbox(
            pymupdf.Rect(x, y, x + col_w, y + 14),
            head,
            fontname="sans",
            fontsize=10,
            color=INK,
            align=1,
        )
        yy = y + 16
        for item in items:
            page.insert_textbox(
                pymupdf.Rect(x, yy, x + col_w, yy + 28),
                item,
                fontname="sans",
                fontsize=9,
                color=INK,
                align=1,
            )
            yy += 13 if len(item) < 22 else 24
        heights.append(yy)
    y = max(heights) + 4
    page.insert_textbox(
        pymupdf.Rect(inner.x0 + 16, y, inner.x1 - 16, y + 32),
        extras,
        fontname="sans",
        fontsize=9.5,
        color=INK,
        align=1,
    )
    y += 30
    y = label(page, inner.x0, y, "FOOD", inner.width)
    y = paragraph(page, pymupdf.Rect(inner.x0 + 20, y, inner.x1 - 20, y + 46), food)
    return y + 14


def dish_columns(page, inner, y, groups):
    n = len(groups)
    gap = 14
    col_w = (inner.width - gap * (n - 1)) / n
    for i, (title, items) in enumerate(groups):
        x = inner.x0 + i * (col_w + gap)
        page.insert_textbox(
            pymupdf.Rect(x, y, x + col_w, y + 16),
            " ".join(title),
            fontname="sans",
            fontsize=8.5,
            color=GOLD,
            align=1,
        )
        yy = y + 22
        for item in items:
            page.insert_textbox(
                pymupdf.Rect(x + 2, yy, x + col_w - 2, yy + 28),
                item,
                fontname="sans",
                fontsize=10,
                color=INK,
                align=0,
            )
            yy += 16 if len(item) < 28 else 28
    return y


def cover(doc):
    page = doc.new_page(width=W, height=H)
    use(page)
    page.draw_rect(page.rect, color=PLUM, fill=PLUM)
    cx, cy = W / 2, 128
    for i in range(28):
        angle = i * math.pi / 14
        page.draw_line(
            pymupdf.Point(cx + math.cos(angle) * 16, cy + math.sin(angle) * 16),
            pymupdf.Point(cx + math.cos(angle) * 46, cy + math.sin(angle) * 46),
            color=GOLD,
            width=2.2,
        )
    page.draw_circle(pymupdf.Point(cx, cy), 9, color=GOLD, fill=GOLD)
    page.insert_textbox(
        pymupdf.Rect(60, 188, W - 60, 214),
        "JOLLYGUNJ CELEBRATIONS",
        fontname="sans",
        fontsize=13,
        color=GOLD,
        align=1,
    )
    page.insert_textbox(
        pymupdf.Rect(40, 214, W - 40, 340),
        "MENU",
        fontname="serifb",
        fontsize=84,
        color=CREAM,
        align=1,
    )
    card = pymupdf.Rect(118, 390, W - 118, 540)
    page.draw_rect(card, color=CREAM, fill=CREAM)
    page.insert_textbox(
        pymupdf.Rect(card.x0 + 22, card.y0 + 48, card.x1 - 22, card.y1 - 28),
        "Unleashing the Spirit\nof the City of Joy",
        fontname="sans",
        fontsize=16,
        color=PLUM,
        align=1,
    )
    page.insert_textbox(
        pymupdf.Rect(40, 760, W - 40, 800),
        "J P Nagar   ·   Whitefield   ·   Yelahanka",
        fontname="sans",
        fontsize=11,
        color=GOLD,
        align=1,
    )


def summary(doc):
    page = doc.new_page(width=W, height=H)
    use(page)
    inner = sheet(page)
    y = inner.y0 + 8
    y = simple_package(
        page, y, inner, "The Adda Package",
        "Soft Drinks",
        "3 Veg & 2 Non-Veg Starters, 3 Veg & 2 Non-Veg Main Course,\nAny 3 Among Salad & Staples, 2 Desserts & 1 Ice-Cream",
    )
    y = simple_package(
        page, y, inner, "The Para Package",
        "Soft Drinks, Mocktails, Canned Juice",
        "3 Veg & 3 Non-Veg Starters, 3 Veg & 2 Non-Veg Main Course,\nAny 3 Among Salad & Staples, 2 Desserts & 1 Ice-Cream",
    )
    simple_package(
        page, y, inner, "The Highball Package",
        "Beer on the evening's list, Mocktails, Canned Juice, Soft Drinks",
        "3 Veg & 3 Non-Veg Starters, 3 Veg & 3 Non-Veg Main Course,\nAny 3 Among Salad & Staples, 3 Desserts & 1 Ice-Cream",
    )


def spirits_one(doc):
    page = doc.new_page(width=W, height=H)
    use(page)
    inner = sheet(page)
    y = inner.y0 + 6
    y = spirit_block(
        page, y, inner, "The Tram Package",
        [
            ("Whisky", ["House whisky"]),
            ("Rum", ["House rum"]),
            ("Vodka", ["House vodka"]),
            ("Gin", ["House gin"]),
        ],
        "Signature cocktails and shots    ·    Canned juices, mocktails, soft drinks",
        "3 Veg & 3 Non-Veg Starters, 3 Veg & 3 Non-Veg Main Course,\nAny 3 Among Salad & Staples, 3 Desserts & 1 Ice-Cream",
    )
    spirit_block(
        page, y, inner, "The Elgin Package",
        [
            ("Whisky", ["Call whisky"]),
            ("Rum", ["Call rum"]),
            ("Vodka", ["Call vodka"]),
            ("Gin", ["Call gin"]),
            ("Wines", ["Domestic wines"]),
        ],
        "Signature cocktails    ·    Beer on the evening's list\nCanned juices, mocktails and soft drinks",
        "4 Veg & 3 Non-Veg Starters, 4 Veg & 3 Non-Veg Main Course,\nAny 3 Among Salad & Staples, 3 Desserts & 1 Ice-Cream",
    )


def spirits_two(doc):
    page = doc.new_page(width=W, height=H)
    use(page)
    inner = sheet(page)
    y = inner.y0 + 6
    y = spirit_block(
        page, y, inner, "The Victoria Package",
        [
            ("Whisky", ["Extended call list"]),
            ("Vodka", ["Premium vodka", "Call vodka"]),
            ("Gin", ["Extended call gin"]),
            ("Rum", ["Call rum"]),
            ("Wines", ["Imported wines", "Domestic wines"]),
        ],
        "Signature cocktails    ·    Beer on the evening's list\nCanned juices and mocktails",
        "4 Veg & 4 Non-Veg Starters, 4 Veg & 4 Non-Veg Main Course,\nAny 4 Among Salad & Staples, 4 Desserts & 1 Ice-Cream",
    )
    y = spirit_block(
        page, y, inner, "The City of Joy Package",
        [
            ("Whisky", ["Reserve malts"]),
            ("Vodka", ["Premium vodka"]),
            ("Gin", ["Premium gin"]),
            ("Wines", ["Imported wines", "Domestic wines"]),
        ],
        "The full signature cocktail and shot card\nBeer on the evening's list    ·    Canned juices, mocktails, soft drinks",
        "5 Veg & 5 Non-Veg Starters, 5 Veg & 5 Non-Veg Main Course,\nAny 4 Among Salad & Staples, 5 Desserts & 1 Ice-Cream",
    )
    note = pymupdf.Rect(inner.x0 + 8, y + 4, inner.x1 - 8, inner.y1 - 4)
    page.insert_textbox(note, "Note", fontname="sans", fontsize=13, color=INK, align=1)
    page.insert_textbox(
        pymupdf.Rect(note.x0 + 8, note.y0 + 22, note.x1 - 8, note.y1),
        "Every sitting runs three hours. Choose the stated number of dishes from the card that follows.\n"
        "The outlet confirms the evening's bottles before the booking is held.\n"
        "One pork or seafood dish can sit inside the non-veg count. Anything beyond that is agreed with the kitchen.",
        fontname="sans",
        fontsize=9.5,
        color=INK,
        align=0,
    )


def bites(doc):
    page = doc.new_page(width=W, height=H)
    use(page)
    inner = sheet(page)
    bar(page, (inner.x0 + inner.x1) / 2, inner.y0, "From the Kitchen", width=240)
    groups = [
        ("VEGETARIAN", [
            "Aam Aadmi",
            "Achari Aloo",
            "Khova Mushroom",
            "Veg Wonton",
            "Thele Bhaja Sandwich",
            "Agwaini Paneer Roll",
            "Veg Kathi",
        ]),
        ("CHICKEN", [
            "Chicken Fry",
            "Angara Kebab",
            "Chicken a la Kiev Bomb",
            "Chilli Chicken Gravy",
            "Chicken Bharta",
            "Chicken Chap",
        ]),
        ("SEAFOOD", [
            "Fish Fry",
            "Fish Kobiraji",
            "Butter Garlic Prawn",
            "Chingri Macher Makha",
        ]),
    ]
    dish_columns(page, inner, inner.y0 + 48, groups)
    y = inner.y0 + 48 + 22 + max(len(items) for _, items in groups) * 16 + 28
    page.insert_textbox(
        pymupdf.Rect(inner.x0, y, inner.x1, y + 16),
        "P O R K   &   B E E F",
        fontname="sans",
        fontsize=9,
        color=GOLD,
        align=1,
    )
    page.insert_textbox(
        pymupdf.Rect(inner.x0, y + 24, inner.x1, y + 70),
        "Tangra Pork Stew          Beef Pasanda Kebab",
        fontname="sans",
        fontsize=11,
        color=INK,
        align=1,
    )
    bar(page, (inner.x0 + inner.x1) / 2, y + 90, "Mains", width=160)
    dish_columns(
        page, inner, y + 136,
        [
            ("WITH RICE", [
                "Aloo Gobi Pulao",
                "Chicken Bharta with Rice",
                "Chicken Chap with Rice",
            ]),
            ("GRAVY", [
                "Chilli Chicken Gravy",
                "Chingri Macher Makha",
                "Tangra Pork Stew",
            ]),
            ("STAPLES", [
                "Dal Makhni with Naan",
                "Dal Makhni with Rice",
            ]),
        ],
    )


def last(doc):
    page = doc.new_page(width=W, height=H)
    use(page)
    inner = sheet(page)
    bar(page, (inner.x0 + inner.x1) / 2, inner.y0, "Desserts", width=180)
    page.insert_textbox(
        pymupdf.Rect(inner.x0, inner.y0 + 48, inner.x1, inner.y0 + 90),
        "Baked Rosogolla          Nariyal Bomb",
        fontname="sans",
        fontsize=12,
        color=INK,
        align=1,
    )
    bar(page, (inner.x0 + inner.x1) / 2, inner.y0 + 120, "Signature Shots", width=220)
    shots = [
        ("Studio Cut", "Tequila + Passion fruit + Grapefruit"),
        ("Elgin Charge", "Vodka + Lime + Orgeat + Orange Litchi"),
        ("Grand Trunk Drop", "Gin + Lime + Watermelon + Apple Juice"),
        ("Red Tram 75", "Vodka + Lime + Peach + Cranberry"),
        ("Fizzy Feriwala", "Pistola Rosa + Pineapple Pickle Brine"),
        ("Bubble Trouble", "Beefeater Gin + Skinos + Tonic water + Mango Bobas"),
        ("Brine & Shine", "Pistola Rosa, Three citrus foam"),
    ]
    y = inner.y0 + 168
    for name, build in shots:
        page.insert_textbox(
            pymupdf.Rect(inner.x0 + 36, y, inner.x0 + 230, y + 16),
            name,
            fontname="sans",
            fontsize=11,
            color=INK,
            align=0,
        )
        page.insert_textbox(
            pymupdf.Rect(inner.x0 + 240, y, inner.x1 - 28, y + 16),
            build,
            fontname="sans",
            fontsize=10,
            color=INK,
            align=0,
        )
        y += 22
    y += 16
    bar(page, (inner.x0 + inner.x1) / 2, y, "Shot Platters", width=190)
    page.insert_textbox(
        pymupdf.Rect(inner.x0 + 30, y + 44, inner.x1 - 30, y + 110),
        "Platters for 4, 8 and 10.\nBuilt for a round at the table, counted inside the package's cocktail and shot list.",
        fontname="sans",
        fontsize=11,
        color=INK,
        align=1,
    )
    page.insert_textbox(
        pymupdf.Rect(inner.x0, inner.y1 - 28, inner.x1, inner.y1),
        "Jollygunj  ·  A Byg Ventures LLP bar  ·  Bengaluru",
        fontname="sans",
        fontsize=9,
        color=GOLD,
        align=1,
    )


def main():
    doc = pymupdf.open()
    cover(doc)
    summary(doc)
    spirits_one(doc)
    spirits_two(doc)
    bites(doc)
    last(doc)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    doc.save(OUT)
    print(OUT, "pages", doc.page_count)


if __name__ == "__main__":
    main()
