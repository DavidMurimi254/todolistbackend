const express = require('express')
const mysql = require('mysql2')
require('dotenv').config()
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

//PROVIDING CREDENTIALS FOR YOUR DATABASE
let conct = mysql.createConnection({
    host: process.env.HOST,
    port: process.env.PORT,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE_NAME,
    ssl: { ca: process.env.MYSQL_CA_CERT }
})

//CONNECTING TO DATABASE
conct.connect( err => {
    if(err) throw err;
    console.log("database connected");
})

conct.query(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tasks VARCHAR(255) NOT NULL
  )
`, err => {
  if (err) throw err
  console.log("✅ Table 'tasks' is ready")
})

//EXTRACTING ALL DATA
app.get('/tasks', (req, res) => {
    conct.query("SELECT * FROM tasks", (err, result) => {
        if(err) throw err
        console.log(result);
        res.json(result)
    })
})

//INSERTING AND DISPLAYING THE SAVED DATA
app.post('/tasks', (req, res) => {
    let todo = req.body.tasks

    const sql = "INSERT INTO tasks (tasks) VALUES (?)";
    conct.query(sql, [todo], (err) => {
        if(err) throw err
 
        conct.query("SELECT * FROM tasks", (err, result) => {
            if(err) throw err
            res.json(result)
        })
    })
})

module.exports = app