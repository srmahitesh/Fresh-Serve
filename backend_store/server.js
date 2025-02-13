import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import { configDotenv } from "dotenv";
import bodyParser from "body-parser";
configDotenv();

const App = express();
const PORT = process.env.PORT;
App.use(express.json());
App.use(bodyParser.urlencoded({extended: false}));
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

App.get('/', (req, res)=>{
    res.send("Yes, We are working & Coming soon");
});


App.post('/add_item', async (req, res) => { 
    let item = req.body;
    console.log(item);
    let query = `INSERT INTO products VALUES (
        null, 
        '${item.name.toUpperCase()}', 
        '${item.brand?.toUpperCase() || null}', 
        ${item.mrp}, 
        ${item.price}, 
        '${item.category.toUpperCase()}', 
        '${item.seller || null}', 
        '${item.keywords?.toUpperCase() || null}', 
        '${item.descrp}', 
        ${item.stock}, 
        '${item.url || null}',
        '${item.quantity}',
        ${item.barcode_id}
    )`;

    console.log(query);

    try {
        let conn = await activateDb();
        let result = await conn.query(query);
        console.log(result[0]);
        conn.close();
        res.send(`Product Added Successfully`);
    } catch (error) {
        console.log(`Error while saving the product: ${error.stack}`);
        res.send(`Error while adding product`);
    }
});


App.listen(PORT, ()=>{
    console.log(`working on the Port ${PORT} with URL http://localhost:${PORT}/`);
});