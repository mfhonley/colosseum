"""
NFT Certificate Image Generator

Создает изображения для NFT сертификатов водной эффективности
"""

from PIL import Image, ImageDraw, ImageFont
import io
import base64
from datetime import datetime


def generate_certificate_image(
    farm_id: int,
    water_consumed: float,
    efficiency_score: float,
    timestamp: str
) -> bytes:
    """
    Генерирует изображение сертификата NFT

    Returns:
        bytes: PNG изображение в виде байтов
    """
    # Размер изображения
    width, height = 800, 600

    # Создаем изображение с градиентом
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)

    # Рисуем градиентный фон (синий -> голубой)
    for y in range(height):
        r = int(59 + (135 - 59) * y / height)
        g = int(130 + (206 - 130) * y / height)
        b = int(246 + (235 - 246) * y / height)
        draw.line([(0, y), (width, y)], fill=(r, g, b))

    # Заголовок
    try:
        title_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 48)
        subtitle_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 32)
        text_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 24)
    except:
        # Fallback на default font
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()
        text_font = ImageFont.load_default()

    # Рисуем белый прямоугольник для контента
    padding = 40
    draw.rectangle([padding, padding, width-padding, height-padding],
                   fill='white', outline='#3B82F6', width=3)

    # Заголовок
    title_text = "🏆 WATER EFFICIENCY"
    title_bbox = draw.textbbox((0, 0), title_text, font=title_font)
    title_width = title_bbox[2] - title_bbox[0]
    title_x = (width - title_width) // 2
    draw.text((title_x, 80), title_text, fill='#1E40AF', font=title_font)

    # Подзаголовок
    subtitle_text = "CERTIFICATE"
    subtitle_bbox = draw.textbbox((0, 0), subtitle_text, font=subtitle_font)
    subtitle_width = subtitle_bbox[2] - subtitle_bbox[0]
    subtitle_x = (width - subtitle_width) // 2
    draw.text((subtitle_x, 140), subtitle_text, fill='#3B82F6', font=subtitle_font)

    # Данные
    y_offset = 220
    line_height = 40

    data_items = [
        f"Farm ID: #{farm_id}",
        f"Water Consumed: {water_consumed:,.1f}L",
        f"Efficiency Score: {efficiency_score * 100:.0f}%",
        f"Date: {datetime.fromisoformat(timestamp).strftime('%Y-%m-%d')}",
    ]

    for item in data_items:
        item_bbox = draw.textbbox((0, 0), item, font=text_font)
        item_width = item_bbox[2] - item_bbox[0]
        item_x = (width - item_width) // 2
        draw.text((item_x, y_offset), item, fill='#1F2937', font=text_font)
        y_offset += line_height

    # Footer
    footer_text = "SuCount Water Management • Solana Blockchain"
    footer_bbox = draw.textbbox((0, 0), footer_text, font=text_font)
    footer_width = footer_bbox[2] - footer_bbox[0]
    footer_x = (width - footer_width) // 2
    draw.text((footer_x, height - 80), footer_text, fill='#6B7280', font=text_font)

    # Конвертируем в bytes
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='PNG')
    img_byte_arr = img_byte_arr.getvalue()

    return img_byte_arr


def image_to_base64(image_bytes: bytes) -> str:
    """Конвертирует изображение в base64 для хранения"""
    return base64.b64encode(image_bytes).decode('utf-8')


def save_certificate_image(image_bytes: bytes, filename: str):
    """Сохраняет изображение в файл"""
    with open(filename, 'wb') as f:
        f.write(image_bytes)
