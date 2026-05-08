const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// ============================================================
// 使用 sqlite3 來操作資料庫，並開啟位置在 db/sqlite.db 的資料庫
// 不要用匯入 db.js 的方式
// (Mở DB trực tiếp tại db/sqlite.db, không import db.js)
// ============================================================
const dbPath = path.join(__dirname, "db", "chingshin.db");
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("無法開啟資料庫 (Không thể mở database):", err.message);
    } else {
        console.log("成功連線到 SQLite 資料庫 (Kết nối DB thành công):", dbPath);
    }
});

// ============================================================
// GET /api/prices - 查詢 prices table 所有資料，回傳 json
// (Truy vấn tất cả dữ liệu từ bảng prices, trả về JSON)
// ============================================================
app.get("/api/prices", (req, res) => {
    const keyword = req.query.q || "";
    let sql;
    let params;

    if (keyword) {
        sql = "SELECT * FROM prices WHERE item_name LIKE ? ORDER BY date DESC";
        params = ["%" + keyword + "%"];
    } else {
        sql = "SELECT * FROM prices ORDER BY date DESC";
        params = [];
    }

    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// ============================================================
// POST /api/insert - 新增一筆物價資料 (date, item_name, price)
// 回傳文字的訊息，不要 json
// (Thêm 1 bản ghi giá mới, trả về plain text, không phải JSON)
// ============================================================
app.post("/api/insert", (req, res) => {
    const { date, item_name, price } = req.body;

    if (!date || !item_name || !price) {
        return res.status(400).send("新增失敗：請填寫完整的日期、商品名稱和價格！");
    }

    const sql = "INSERT INTO prices (date, item_name, price) VALUES (?, ?, ?)";
    db.run(sql, [date, item_name, parseFloat(price)], function (err) {
        if (err) {
            return res.status(500).send("新增失敗：" + err.message);
        }
        res.send("新增成功！已新增「" + item_name + "」，價格 NT$" + price + "，日期 " + date);
    });
});

// ============================================================
// DELETE /api/prices/:id - 刪除一筆資料 (選用功能)
// ============================================================
app.delete("/api/prices/:id", (req, res) => {
    const sql = "DELETE FROM prices WHERE id = ?";
    db.run(sql, [req.params.id], function (err) {
        if (err) {
            return res.status(500).send("刪除失敗：" + err.message);
        }
        res.send("已成功刪除 1 筆資料");
    });
});

// 啟動伺服器 (Khởi động server)
app.listen(PORT, () => {
    console.log("伺服器運行於 (Server đang chạy tại): http://localhost:" + PORT);
});
