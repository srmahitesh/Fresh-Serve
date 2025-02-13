import express from "express";
import axios from "axios";
import cors from "cors";
import mysql from "mysql2/promise";
import { configDotenv } from "dotenv";
configDotenv();

const App = express();
const PORT = process.env.PORT;

App.use(cors());

async function activateDb() {
  try {
    let conn = await mysql.createConnection({
      host: process.env.db_host,
      user: process.env.db_user,
      password: process.env.db_password,
      database: process.env.db_name,
      port: process.env.db_port
    });
    console.log('Success');
    return conn;
  } catch (error) {
    console.log(`Error while Connecting to DB ${error.stack}`);
  }
}


App.get('/', async(req,res)=>{
  const conn = await activateDb();
  console.log(conn)
  res.send("Hello, Welcome to Fresh Serve");
});


App.get('/get_items', async(req, res)=>{
  let items;
  try{
    const conn = await activateDb();
    let result = await conn.query(`SELECT * FROM products`);
    console.log(result);
    conn.close();
    res.send(result[0]);
  }
  catch(error){
    console.log(`Error while fetching Items ${error.stack}`);
    res.send([]);
  }
});




App.listen(PORT, ()=>{
  console.log(`http://localhost:${PORT}`);
});