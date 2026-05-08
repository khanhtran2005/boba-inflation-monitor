# 清心福全通膨觀測站 — Boba Inflation Monitor

追蹤清心福全飲品價格，觀察 7/26 漲價後的個人通膨率。

---

## 功能 Features

- 新增 / 刪除飲品價格紀錄
- 搜尋飲品名稱（即時過濾）
- 飲品展示卡片，顯示漲幅百分比
- 動畫效果：浮泡泡、3D tilt、confetti、打字機

---

## 技術架構 Tech Stack

| Layer    | Technology          |
|----------|---------------------|
| Backend  | Node.js + Express   |
| Database | SQLite (`sqlite3`)  |
| Frontend | Vanilla JS + CSS    |
| Calendar | Flatpickr (zh_TW)   |

---

## 本地執行 How to Run Locally

### 1. 安裝依賴

```bash
npm install
```

### 2. 初始化資料庫（首次執行）

```bash
node db.js
```

這會建立 `db/chingshin.db` 並插入 10 筆範例資料。

### 3. 啟動伺服器

```bash
node app.js
```

開啟瀏覽器前往：**http://localhost:3000**

---

## API 端點 API Endpoints

| Method   | Path               | 說明                  |
|----------|--------------------|-----------------------|
| `GET`    | `/api/prices`      | 查詢所有價格紀錄       |
| `GET`    | `/api/prices?q=關鍵字` | 依飲品名稱搜尋    |
| `POST`   | `/api/insert`      | 新增一筆紀錄           |
| `DELETE` | `/api/prices/:id`  | 刪除指定紀錄           |

詳細 request / response 格式請參閱 [`openapi.yaml`](./openapi.yaml)。

---

## 資料庫結構 Database Schema

```sql
CREATE TABLE prices (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    date      TEXT    NOT NULL,
    item_name TEXT    NOT NULL,
    price     REAL    NOT NULL
);
```

---

## 專案結構 Project Structure

```
taiwan-food-cpi/
├── app.js          # Express 伺服器 + API 路由
├── db.js           # 資料庫初始化 & 種子資料
├── openapi.yaml    # API 規格表 (OpenAPI 3.0)
├── package.json
├── db/
│   └── chingshin.db  # SQLite 資料庫（git ignored）
└── public/
    ├── index.html
    ├── style.css
    └── script.js
```
