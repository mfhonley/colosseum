"""
ML Oracle Simulator for Water Management System

Симулирует ML-оракул, который:
- Мониторит 10 хозяйств (ферм)
- Генерирует реалистичные данные о потреблении воды
- Учитывает погодные условия (осадки влияют на потребление)
- Симулирует дневные/ночные циклы
- Отправляет данные в backend каждые X минут

Для демо на хакатоне.
"""

import httpx
import random
import asyncio
from datetime import datetime
import logging
from typing import Dict
import os

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Configuration
API_URL = os.getenv("API_URL", "http://localhost:8000/api/water-usage")
NUM_FARMS = 10

# Для быстрого тестирования используйте DEMO_MODE = True (30 секунд)
# Для реального использования DEMO_MODE = False (5 минут)
DEMO_MODE = True

if DEMO_MODE:
    INTERVAL_SECONDS = 30  # 30 секунд для демо
    INTERVAL_MINUTES = INTERVAL_SECONDS / 60
else:
    INTERVAL_MINUTES = 5  # 5 минут для production
    INTERVAL_SECONDS = INTERVAL_MINUTES * 60

# Farm profiles с разными характеристиками
FARM_PROFILES = {
    1: {"name": "Зерновая ферма A", "size_hectares": 50, "base_water": 150},
    2: {"name": "Овощная ферма B", "size_hectares": 30, "base_water": 200},
    3: {"name": "Фруктовый сад C", "size_hectares": 40, "base_water": 180},
    4: {"name": "Зерновая ферма D", "size_hectares": 60, "base_water": 160},
    5: {"name": "Животноводческая ферма E", "size_hectares": 35, "base_water": 220},
    6: {"name": "Овощная ферма F", "size_hectares": 25, "base_water": 190},
    7: {"name": "Зерновая ферма G", "size_hectares": 55, "base_water": 170},
    8: {"name": "Фруктовый сад H", "size_hectares": 45, "base_water": 175},
    9: {"name": "Овощная ферма I", "size_hectares": 28, "base_water": 210},
    10: {"name": "Зерновая ферма J", "size_hectares": 50, "base_water": 165},
}

# Координаты ферм (Алматинская область, Казахстан)
FARM_LOCATIONS = {
    1: (43.2220, 76.8512),
    2: (43.3050, 76.9100),
    3: (43.1900, 76.7800),
    4: (43.2580, 76.8950),
    5: (43.2100, 76.8200),
    6: (43.2800, 76.9200),
    7: (43.2400, 76.8700),
    8: (43.1950, 76.8350),
    9: (43.2650, 76.8850),
    10: (43.2150, 76.8450),
}


def get_time_of_day_multiplier() -> float:
    """
    Возвращает множитель потребления воды в зависимости от времени суток

    - Ночь (00:00-06:00): минимальное потребление (0.3x)
    - Утро (06:00-10:00): среднее потребление (0.8x)
    - День (10:00-18:00): максимальное потребление (1.2x)
    - Вечер (18:00-00:00): среднее потребление (0.7x)
    """
    hour = datetime.now().hour

    if 0 <= hour < 6:
        return 0.3  # Ночь - минимум полива
    elif 6 <= hour < 10:
        return 0.8  # Утро - средний полив
    elif 10 <= hour < 18:
        return 1.2  # День - максимальный полив
    else:
        return 0.7  # Вечер - средний полив


def simulate_weather() -> Dict[str, float]:
    """
    Симулирует погодные условия

    Логика:
    - Если есть дождь → меньше нужно поливать
    - Высокая температура → больше нужно воды
    - Низкая влажность → больше нужно воды
    """
    # Генерируем погоду с корреляцией
    has_rain = random.random() > 0.7  # 30% вероятность дождя

    if has_rain:
        rainfall_mm = round(random.uniform(2, 15), 2)
        humidity_percent = round(random.uniform(60, 90), 1)
        temperature_c = round(random.uniform(15, 25), 1)
    else:
        rainfall_mm = 0.0
        humidity_percent = round(random.uniform(30, 70), 1)
        temperature_c = round(random.uniform(20, 35), 1)

    return {
        "rainfall_mm": rainfall_mm,
        "temperature_c": temperature_c,
        "humidity_percent": humidity_percent
    }


def calculate_water_consumption(
    farm_id: int,
    weather: Dict[str, float],
    time_multiplier: float
) -> float:
    """
    Вычисляет реалистичное потребление воды

    Факторы:
    1. Базовое потребление фермы (зависит от типа и размера)
    2. Погода (дождь уменьшает потребление)
    3. Температура (жара увеличивает потребление)
    4. Влажность (сухость увеличивает потребление)
    5. Время суток (день/ночь)
    """
    profile = FARM_PROFILES[farm_id]
    base_water = profile["base_water"]

    # 1. Базовое потребление
    water = base_water * time_multiplier

    # 2. Влияние дождя (если дождь, меньше поливаем)
    if weather["rainfall_mm"] > 0:
        rain_reduction = min(0.5, weather["rainfall_mm"] / 20)  # до 50% снижения
        water *= (1 - rain_reduction)

    # 3. Влияние температуры (жара = больше воды)
    if weather["temperature_c"] > 25:
        temp_increase = (weather["temperature_c"] - 25) * 0.03  # +3% на каждый градус
        water *= (1 + temp_increase)

    # 4. Влияние влажности (сухость = больше воды)
    if weather["humidity_percent"] < 50:
        humidity_increase = (50 - weather["humidity_percent"]) * 0.02  # +2% на каждый %
        water *= (1 + humidity_increase)

    # 5. Случайный фактор (±15%)
    random_factor = random.uniform(0.85, 1.15)
    water *= random_factor

    return round(water, 2)


def generate_water_usage_data(farm_id: int) -> dict:
    """
    Генерирует реалистичные данные о потреблении воды для фермы

    Учитывает:
    - Тип фермы и ее размер
    - Погодные условия
    - Время суток
    - Корреляции между параметрами
    """
    # Симулируем погоду
    weather = simulate_weather()

    # Получаем множитель времени суток
    time_multiplier = get_time_of_day_multiplier()

    # Вычисляем реалистичное потребление воды
    water_liters = calculate_water_consumption(farm_id, weather, time_multiplier)

    return {
        "farm_id": farm_id,
        "timestamp": datetime.now().isoformat(),
        "water_liters": water_liters,
        "rainfall_mm": weather["rainfall_mm"],
        "temperature_c": weather["temperature_c"],
        "humidity_percent": weather["humidity_percent"],
    }


async def send_usage_data(client: httpx.AsyncClient, data: dict) -> bool:
    """Отправляет данные о потреблении воды в backend API"""
    try:
        response = await client.post(API_URL, json=data, timeout=10.0)
        response.raise_for_status()

        result = response.json()
        profile = FARM_PROFILES[data['farm_id']]

        logger.info(
            f"✓ {profile['name']} (ID:{data['farm_id']}): "
            f"{data['water_liters']}L | "
            f"🌡️{data['temperature_c']}°C | "
            f"💧{data['humidity_percent']}% | "
            f"🌧️{data['rainfall_mm']}mm | "
            f"Tokens: {result['tokens_consumed']} | "
            f"TX: {result['solana_tx_id']}"
        )
        return True

    except httpx.HTTPError as e:
        logger.error(f"✗ Farm {data['farm_id']}: Failed to send data - {e}")
        return False
    except Exception as e:
        logger.error(f"✗ Farm {data['farm_id']}: Unexpected error - {e}")
        return False


async def run_oracle_simulation():
    """
    Главный цикл симуляции ML-оракула

    Непрерывно генерирует и отправляет данные о потреблении воды для всех ферм
    """
    logger.info("=" * 80)
    logger.info("🌊 ML Oracle Simulator Started")
    logger.info("=" * 80)
    logger.info(f"📍 Region: Алматинская область, Казахстан")
    logger.info(f"🚜 Monitoring {NUM_FARMS} farms")
    logger.info(f"⏰ Sending data every {INTERVAL_MINUTES} minutes ({INTERVAL_SECONDS}s)")
    logger.info(f"🎯 Target API: {API_URL}")
    logger.info("=" * 80)

    # Показываем список ферм
    logger.info("\n📋 Farm Profiles:")
    for farm_id, profile in FARM_PROFILES.items():
        logger.info(
            f"  {farm_id}. {profile['name']} - "
            f"{profile['size_hectares']}ha - "
            f"Base: {profile['base_water']}L/cycle"
        )
    logger.info("=" * 80)

    iteration = 0
    total_water_sent = 0.0

    async with httpx.AsyncClient(timeout=15.0) as client:
        while True:
            iteration += 1
            current_time = datetime.now()
            time_of_day = get_time_of_day_multiplier()

            logger.info(
                f"\n📊 Iteration #{iteration} - "
                f"{current_time.strftime('%Y-%m-%d %H:%M:%S')} - "
                f"Time multiplier: {time_of_day}x"
            )
            logger.info("-" * 80)

            # Генерируем и отправляем данные для всех ферм
            all_data = []
            for farm_id in range(1, NUM_FARMS + 1):
                data = generate_water_usage_data(farm_id)
                all_data.append(data)

            # Отправляем все запросы параллельно
            tasks = [send_usage_data(client, data) for data in all_data]
            results = await asyncio.gather(*tasks, return_exceptions=True)

            # Подсчитываем статистику
            success_count = sum(1 for r in results if r is True)
            total_water_this_round = sum(data["water_liters"] for data in all_data)
            total_water_sent += total_water_this_round

            # Выводим сводку
            logger.info("-" * 80)
            logger.info(
                f"✅ Sent: {success_count}/{NUM_FARMS} farms | "
                f"💧 Water this round: {total_water_this_round:.1f}L | "
                f"📈 Total sent: {total_water_sent:.1f}L"
            )
            logger.info(f"⏳ Next update in {INTERVAL_MINUTES} minutes...")
            logger.info("=" * 80)

            # Ждем перед следующей итерацией
            await asyncio.sleep(INTERVAL_SECONDS)


def main():
    """Entry point"""
    import asyncio

    try:
        asyncio.run(run_oracle_simulation())
    except KeyboardInterrupt:
        logger.info("\n\n🛑 Oracle simulator stopped by user")
    except Exception as e:
        logger.error(f"\n\n❌ Oracle simulator crashed: {e}")


if __name__ == "__main__":
    main()
