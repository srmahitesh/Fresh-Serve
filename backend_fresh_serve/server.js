import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs"
import Jwt from "jsonwebtoken";
import Razorpay from "razorpay";
import CryptoJS from "crypto-js";
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


    const razorpayInstance = new Razorpay({
      key_id: process.env.razorpay_key_id,
      key_secret: process.env.razorpay_key_secret,
    });



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
      conn.close();
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


App.post('/get_address', async(req, res)=>{

  let {email, token} = req.body;

  try{
    const data = Jwt.verify(token, "hitesharma");
    if(data.email !== email) return res.json({msg: `Suspicious Activity Detected, Account may be block for security purposes.`});
  }
  catch(error){
    return res.json({msg: `Session expired, Please Login Again.`})
  }
  
  

  if(!email) return res.json({msg: `Invalid User`});

  try{
    const conn = await activateDb();
    //now fetch the address list from backend
    try{
      let query = `SELECT * FROM  addressess where userMail = '${email}'`;
      const result = await conn.query(query);
      conn.close();
      res.json(result[0]);
    }
    catch(error){
      return res.json({msg: `unable to connect with db`});
    }
  }
  catch(error){
    res.json({msg: `Unable to establish connection with Database.`});
  }
});



App.post("/add-address", async(req, res)=>{
  let {latitude, longitude, street, landmark, email, phone} = req.body;
  if(!latitude || !longitude || !street || !email || !phone) return res.json({msg : `Incomplete Details.`});

  let query = `INSERT INTO addressess VALUES (null, '${email}', '${latitude}', '${longitude}', '${street}', '${landmark}', '${phone}')`;
  console.log(query);

  try{
    const conn = await activateDb();

    try{
      const result = await conn.query(query);
      console.log(result);
      conn.close();
      res.json({msg: `Success`});
    }
    catch(error){
      return res.json({msg: `Unable to Add Address to Db`});
    }
  }
  catch(error){
    return res.json({msg: `Unable to Contact with DB`});
  }
});





App.post("/create-order", async (req, res) => {
  let { amount, cart, address_id, email } = req.body;
  cart = JSON.stringify(cart);

  try {
    let orderId = `FS${Date.now()}`;

    const result = await razorpayInstance.orders.create({
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: orderId,
      notes: JSON.stringify(req.body.cart)
    });

    // Now, store the order in your database
    try {
      const conn = await activateDb();
      try {
        let query = `INSERT INTO orders VALUES('${orderId}', '${cart}', '${email}', '${address_id}', 'PENDING', '${amount}', '${result.id}')`;
        await conn.query(query);
        conn.close();
      } catch (error) {
        return res.json({ msg: `Error while Saving your order.` });
      }
    } catch (error) {
      return res.json({ msg: `Unable to connect with DB` });
    }

    console.log(result);
    res.json({ success: true, order: result });

  } catch (error) {
    console.error("Error Creating Order:", error);
    res.status(500).json({ success: false, msg: "Unable to create order" });
  }
});

// Verify Payment Route
App.post("/verify-payment", async (req, res) => {
  console.log("Verification payload:", req.body);
  try {
    const { receipt, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    let conn;
    try {
      conn = await activateDb();
    } catch (error) {
      return res.json({ msg: `Unable to update payment status. Any amount debited will be refunded within 5-7 working days.` });
    }

    // If payment details are missing, consider it as a cancelled/failed payment
    if (!razorpay_payment_id || !razorpay_signature) {
      let query = `UPDATE orders SET payment_status = 'Failed' WHERE razorpay_order_id = '${razorpay_order_id}'`;
      try {
        await conn.query(query);
        conn.close();
        return res.json({ success: false, msg: "Payment Cancelled" });
      } catch (error) {
        return res.json({ msg: `Unable to update payment status. Please try again.` });
      }
    }

    // Generate server-side signature using crypto-js
    const generated_signature = CryptoJS.HmacSHA256(
      `${razorpay_order_id}|${razorpay_payment_id}`,
      process.env.razorpay_key_secret
    ).toString(CryptoJS.enc.Hex);

    if (generated_signature === razorpay_signature) {
      // Payment is successful; update the database accordingly
      let query = `UPDATE orders SET payment_status = 'Successful' WHERE razorpay_order_id = '${razorpay_order_id}'`;
      try {
        await conn.query(query);
        return res.json({ success: true, msg: "Payment Verified" });
      } catch (error) {
        return res.json({ msg: `Unable to update payment status. Please contact support.` });
      }
    } else {
      // Payment verification failed; update status to Failed
      let query = `UPDATE orders SET payment_status = 'Failed' WHERE razorpay_order_id = '${razorpay_order_id}'`;
      try {
        await conn.query(query);
        return res.json({ success: false, msg: "Payment Verification Failed" });
      } catch (error) {
        return res.json({ msg: `Unable to update payment status. Please try again.` });
      }
    }
  } catch (error) {
    console.error("Error Verifying Payment:", error);
    res.status(500).json({ success: false, msg: "Server Error" });
  }
});


App.post("/get-orders", async(req, res)=>{

  let {email, token} = req.body;

  try{
    const data = Jwt.verify(token, "hitesharma");
    if(data.email !== email) return res.json({msg: `Suspicious Activity Detected, Account may be block for security purposes.`});
  }
  catch(error){
    return res.json({msg: `Session expired, Please Login Again.`})
  }
  
  try{
    const conn = await activateDb();
    try{
      let query = `SELECT * FROM orders WHERE email = '${email}' ORDER BY order_id DESC`;
      const result = await conn.query(query);
      conn.close();
      console.log(result[0]); 
      return res.json({msg: "Success", result: result[0]});
    }
    catch(error){
      res.json({msg: `Unable to fetch orders`});
    }
  }
  catch(error){
    res.json({msg: `Unable to connect with Database.`});
  }
});



App.listen(PORT, ()=>{
  console.log(`http://localhost:${PORT}`);
});