const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

// 確認 db 資料夾存在，若不存在就新增
// (Đảm bảo thư mục db tồn tại, nếu không thì tạo mới)
const dbDir = path.join(__dirname, "db");
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
    console.log("已建立 db 資料夾");
}

// (Mở database tại db/chingshin.db, xác nhận mở thành công)
const dbPath = path.join(__dirname, "db", "chingshin.db");
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("無法開啟資料庫 (Không thể mở database):", err.message);
        return;
    }
    console.log("成功連線到 SQLite 資料庫 (Kết nối SQLite thành công):", dbPath);

    // 使用 serialize 確保 SQL 按順序執行
    db.serialize(() => {

        // 若 prices table 不存在，則自動建立
        db.run(`CREATE TABLE IF NOT EXISTS prices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            item_name TEXT NOT NULL,
            price REAL NOT NULL
        )`, (err) => {
            if (err) {
                console.error("建立 table 失敗 (Tạo bảng thất bại):", err.message);
            } else {
                console.log("prices table 已確認存在 (Bảng prices đã sẵn sàng)");
            }
        });

        // 檢查是否已有資料，避免重複新增
        db.get("SELECT COUNT(*) as count FROM prices", (err, row) => {
            if (err) {
                console.error("查詢失敗:", err.message);
                db.close();
                return;
            }

            if (row && row.count > 0) {
                console.log("資料庫已有 " + row.count + " 筆資料，跳過新增");
                db.close(() => console.log("資料庫連線已關閉"));
                return;
            }

            // 新增初始資料
            const seedData = [
                ["2024-01-15", "珍珠奶茶", 50],
                ["2024-07-26", "珍珠奶茶", 55],
                ["2024-01-15", "梅子綠茶", 40],
                ["2024-07-26", "梅子綠茶", 45],
                ["2024-01-15", "優多綠茶", 50],
                ["2024-07-26", "優多綠茶", 55],
                ["2024-01-15", "原鄉四季", 30],
                ["2024-07-26", "原鄉四季", 35],
                ["2024-01-15", "冰淇淋紅茶", 50],
                ["2024-07-26", "冰淇淋紅茶", 55]
            ];

            const stmt = db.prepare("INSERT INTO prices (date, item_name, price) VALUES (?, ?, ?)");
            seedData.forEach((data) => {
                stmt.run(data);
            });
            stmt.finalize(() => {
                console.log("成功新增 " + seedData.length + " 筆初始資料");
                db.close(() => console.log("資料庫連線已關閉"));
            });
        });
    });
});
