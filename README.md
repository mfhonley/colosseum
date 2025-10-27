# 🌊 SuCount - Water Management on Solana

Blockchain-based water quota management system for Colosseum hackathon

---

## 🎯 Что это?

Децентрализованная система управления водными ресурсами для фермеров на Solana:

- **WaterCredits (WC)** - SPL токены для квот воды (1 WC = 1 литр)
- **NFT сертификаты** - награды за эффективное использование
- **IoT Oracle** - автоматический мониторинг расхода
- **Автоматическое сжигание** - токены сжигаются при использовании воды
- **Прозрачность** - все транзакции на Solana Devnet

---

## 🚀 Быстрый старт

### 1. Настроить окружение

Создай `back/.env`:
```env
SOLANA_NETWORK=devnet
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_AUTHORITY_KEY=<твой_base58_приватный_ключ>
WATERCREDITS_MINT=<mint_address_токена>

DATABASE_URL=sqlite:///./water_management.db
DEFAULT_WATER_LIMIT_LITERS=100000
WATER_CREDIT_RATE=1.0
DEBUG=True
```

### 2. Профинансировать authority

```bash
# Solana CLI
solana airdrop 5 <твой_адрес>

# Или веб-фаусет: https://faucet.solana.com/
```

### 3. Запустить систему

```bash
# Запуск всех сервисов
docker-compose up -d

# Проверить логи
docker-compose logs -f

# Открыть фронтенд
# http://localhost:5173
```

### 4. Создать WaterCredits токен

```bash
# Создать токен (один раз)
curl -X POST http://localhost:8000/api/watercredits/create-token

# Добавить mint_address в back/.env
# WATERCREDITS_MINT=<полученный_mint_address>

# Перезапустить backend
docker-compose restart backend
```

---

## 📊 Архитектура

```
Frontend (React) ◄──► Backend (FastAPI) ◄──► Solana Devnet
                            ▲
                            │
                      Oracle (IoT)
```

**Компоненты:**
- Backend: FastAPI + SQLite + Solana SDK
- Frontend: React + Vite + TailwindCSS
- Oracle: IoT simulator (данные каждые 30 сек)
- Blockchain: Solana Devnet (WaterCredits + NFTs)

---

## 🎮 Использование

### Farmer Dashboard

1. Открой http://localhost:5173
2. Выбери **"I'm a Farmer"** → Farm ID: 1

**Вкладки:**
- **Overview** - статистика воды + blockchain status
- **WaterCredits** - минт квоты, баланс on-chain
- **NFT Certificates** - минт сертификатов
- **History** - история использования

### API

```bash
# Минт квоты (100k токенов)
POST /api/watercredits/mint-quota?farm_id=1&amount=100000

# Проверить баланс on-chain
GET /api/watercredits/balance/1

# Минт NFT сертификата
POST /api/nft/mint?farm_id=1&water_consumed=5000&efficiency_score=0.95

# Dashboard всех ферм
GET /api/dashboard
```

---

## 🔍 Проверка on-chain

**WaterCredits Token:**
```
https://explorer.solana.com/address/<WATERCREDITS_MINT>?cluster=devnet
```

**NFT Certificate:**
```
https://explorer.solana.com/address/<nft_address>?cluster=devnet
```

**Transaction:**
```
https://explorer.solana.com/tx/<signature>?cluster=devnet
```

---

## 🛠️ Команды

### Управление

```bash
# Запустить
docker-compose up -d

# Остановить
docker-compose down

# Пересобрать
docker-compose build

# Логи
docker-compose logs -f backend
docker-compose logs -f oracle

# Перезапустить сервис
docker-compose restart backend
```

### Локальная разработка

```bash
# Backend
cd back
poetry install
poetry run uvicorn app.main:app --reload

# Frontend
cd front
npm install
npm run dev

# Oracle
poetry run python scripts/oracle_simulator.py
```

---

## 📁 Структура

```
colosseum/
├── back/                   # Backend
│   ├── app/
│   │   ├── services/      # WaterCredits + NFT
│   │   ├── api/           # Routes
│   │   └── models/        # Database
│   ├── scripts/
│   │   └── oracle_simulator.py
│   └── .env
├── front/                  # Frontend
│   └── src/components/
├── data/                   # SQLite + NFT images
└── docker-compose.yml
```

---

## 🎯 Features

✅ Real Solana blockchain (не mock)
✅ SPL Token (decimals=6) + NFTs (supply=1)
✅ Automatic token burning
✅ Professional UI с blockchain status
✅ IoT simulation (10 ферм)
✅ Verifiable on Solana Explorer

---

## 🐛 Troubleshooting

**Insufficient SOL:**
```bash
solana airdrop 2 <address>
```

**Token not created:**
```bash
curl -X POST http://localhost:8000/api/watercredits/create-token
# Добавь mint_address в .env → restart backend
```

**Logs:**
```bash
docker-compose logs -f backend
```

---

## 🏆 Colosseum Hackathon

**Stack:** React + FastAPI + Solana + Docker
**Network:** Solana Devnet
**Features:** SPL Tokens, NFTs, IoT Oracle, Real-time monitoring

All transactions verifiable on Solana Explorer ✅

---

**Ports (DEV):**
- Frontend Dev: http://localhost:5173 (npm run dev)
- Backend Dev: http://localhost:8000 (local)
- API Docs: http://localhost:8000/docs

**Ports (PROD - Docker):**
- Frontend: http://localhost:8473
- Backend: http://localhost:7483
- API Docs: http://localhost:7483/docs
