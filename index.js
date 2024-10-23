const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./database.js");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.listen(PORT,() =>{
    console.log(`Server is running on port ${PORT}`);
});

app.get("/", (req, res) =>{
    res.send("Hello World How Are You!");
});

// Add New Transaction
app.post("/transactions", (req, res) =>{
    const {type, category, amount, date, description} = req.body;
    db.run(
        `INSERT INTO transactions (type, category, amount, date, description)
        VALUES(?,?,?,?,?)`, 
        [type, category, amount, date, description],
        function(err) {
            if (err) {
                return res.status(400).json({error: err.message});  // Corrected line
            }
            res.json({id: this.lastID});
        }
    );
});


// Get All Transactions
app.get("/transactions", (req, res) =>{
    db.all (`SELECT * FROM transactions`, [], (err, rows) =>{
        if(err){
            return res.status(400).json({error: err.message});
        }
        res.json({transactions: rows});
    });
});

// Get a Single Transaction

app.get("/transactions/:id", (req, res) =>{
    const {id} = req.params;
    db.get(`SELECT * FROM transactions WHERE id = ?`, [id], (err, row)=>{
        if(err){
            return res.status(400).json({error: err.message});
        }
        res.json({transaction: row});
    });
});

// Update Transaction by ID
app.put("/transactions/:id", (req, res) =>{
    const {id} = req.params;
    const {type, category, amount, date, description} = req.body;
    db.run(`UPDATE transactions SET type = ?, category = ?, amount = ?, date = ?, description = ? WHERE id = ?`,
        [type, category, amount, date, description, id],
        function(err){
            if(err){
                return res.status(400).json({error: err.message});
            }
            res.json({updated: this.changes})
    });
});

//Delete Transaction by ID
app.delete("/transactions/:id", (req, res) =>{
    const {id} = req.params;
    db.run(`DELETE FROM transactions WHERE id = ?`, [id], function(err){
        if(err){
            return res.status(400).json({error: err.message});
        }
        res.json({message: "Transaction deleted successfully"});
    });
});

// Get Summary of Transactions 
app.get("/summary", (req, res) =>{
    db.all (`SELECT SUM(amount) as total FROM transactions`, [], (err, rows) =>{
        if(err){
            return res.status(400).json({error: err.message});
        }

        const summary = {
            income : rows.find(row =>row.type === "income")?.total ||0,
            expense : rows.find(row =>row.type === "expense")?.total ||0
        }
        summary.balance = summary.income - summary.expense;
        res.json({summary});
    });
});