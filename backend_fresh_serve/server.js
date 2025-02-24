import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import bodyParser from "body-parser";
import bcrypt from "bcrypt"
import Jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
configDotenv();



const App = express();
const PORT = process.env.PORT;
const saltRounds = await bcrypt.genSalt(10);



App.use(cors());
App.use(bodyParser.json());


async function activateDb() {
  try {
    let conn = await mysql.createConnection({
      host: process.env.db_host,
      user: process.env.db_user,
      password: process.env.db_password,
      database: process.env.db_name,
      port: process.env.db_port
    });
    return conn;
  } catch (error) {
    console.log(`Error while Connecting to DB ${error.stack}`);
  }
}



App.get('/', async(req,res)=>{
  res.send("Hello, Welcome to Fresh Serve");
});


App.get('/get_items', async(req, res)=>{
  let items;
  try{
    const conn = await activateDb();
    let result = await conn.query(`SELECT * FROM products`);
    conn.close();
    res.send(result[0]);
  }
  catch(error){
    console.log(`Error while fetching Items ${error.stack}`);
    res.send([]);
  }
});



App.post('/newUser', async(req, res)=>{

  let {email, name, password} = req.body;
  if(!email || !name || !password) return res.send(`Please enter all required details`);
  let hashedPass = await bcrypt.hash(password, saltRounds);
  //first of all duplicate user check by mobile number & email
  let conn;
  try{
    conn = await activateDb();
    //now check for duplicacy
    try{
      let [result] = await conn.query(`SELECT * from customerCred WHERE email = ?`, [email]);
      if(result.length > 0){
        return res.json({msg: `User already exists with same Email.`})
      }
      //now inser new use
      try{
        await conn.query(`INSERT INTO customerCred (email, name, password) VALUES (?, ?, ?)`,
          [email, name, hashedPass]);
        return res.json({msg: `Success`});
      }
      catch(error){
        return res.status(500).json({msg: `Unable to register at a moment, Please try Again Later`});
      }
    }
    catch(error){
      return res.status(500).json({msg: `Unable to Verify your details at the Moment.`});
    }
  }
  catch(error){
    return res.json({msg: `Unable to Connect to Server, Please Try again.`});
  }
});



App.post("/login", async(req, res)=>{
  const {email, password} = req.body;
  if(!email || !password) return res.json({msg: `Incomplete Details.`});

  let token;

  //first fetch user data & then match password
  try{
    const conn = await activateDb();
    try{
      const query = `SELECT * FROM customerCred WHERE email = '${email}'`;
      var [result] = await conn.query(query);
      
      if(result[0].length === 0) res.json({msg: `User not found, Signup if you don't have any account.`});

      const match = await bcrypt.compare(password, result[0].password);
      if(!match) return res.json({msg: `Incorrect Password, Please Enter Correct One.`});

      //now create token and return that token
      try{
        token = Jwt.sign({
          email: email
        },
        "hitesharma",
        {expiresIn: "720h"}) //30 days validity token
      }
      catch(error){
        res.json({msg: `Unable to Create Token`});
      }
    }
    catch(error){
      return res.json({msg: "Error While Searching for your Data"});
    }
  }
  catch(error){
    return res.json({msg: `Error While trying to establish connection with DB.`});
  }
  return res.status(200).json({msg: `Success`, success: true, data: {email: email, token: token, name: result[0].name}});
});



App.listen(PORT, ()=>{
  console.log(`http://localhost:${PORT}`);
});