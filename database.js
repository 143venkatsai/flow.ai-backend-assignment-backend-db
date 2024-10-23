const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./expenses.db", (error) =>{
    if(error){
        console.log(error.message);
    }
    console.log("Connected to the Expenses Database");
});

db.serialize(() =>{
    db.run(`CREATE TABLE IF NOT EXISTS categories(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT CHECK(type IN ('income', 'expense')) NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS transactions(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT CHECK(type IN ('income', 'expense')) NOT NULL,
        category TEXT NOT NULL,
        amount REAL NOT NULL,
        date TEXT NOT NULL,
        description TEXT
    )`);

    db.run(`INSERT INTO categories (name, type) VALUES ('Salary', 'income'), ('Groceries', 'expense')`);
});

module.exports = db;