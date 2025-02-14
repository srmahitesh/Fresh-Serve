import express from "express";
import axios from "axios";
import cors from "cors";
import mysql from "mysql2/promise";
import bodyParser from "body-parser";
import bcrypt from "bcrypt"
import session from "express-session";
import passport from "passport";
import LocalStrategy from "passport-local";
import { configDotenv } from "dotenv";
configDotenv();

const App = express();
const PORT = process.env.PORT;
const saltRounds = await bcrypt.genSalt(10);

App.use(cors());
App.use(bodyParser.json());
App.use(session({
  secret: `HS`,
  resave: true,
  saveUninitialized: true,
  cookie: {maxAge: 1000 * 3600 * 24 * 30}, //valid for 30 Days, relogin required after 30 days
}))


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
  res.send("Hello, Welcome to Fresh Serve");
});


App.get('/get_items', async(req, res)=>{
  let items;
  try{
    const conn = await activateDb();
    let result = await conn.query(`SELECT * FROM products`);
    // console.log(result);
    conn.close();
    res.send(result[0]);
  }
  catch(error){
    console.log(`Error while fetching Items ${error.stack}`);
    res.send([]);
  }
});



App.post('/newUser', async(req, res)=>{
  let {email, mobile, password} = req.body;
  if(!email || !mobile || !password) return res.send(`Please enter all required details`);
  let hashedPass = await bcrypt.hash(password, saltRounds);
  //first of all duplicate user check by mobile number & email
  let conn;
  try{
    conn = await activateDb();
    //now check for duplicacy
    try{
      let [result] = await conn.query(`SELECT * from customerCred WHERE mobile = ? OR email = ?`, [mobile, email]);
      if(result.length > 0){
        return res.send(`User already exists with same Email or Mobile Number.`)
      }
      //now inser new use
      try{
        await conn.query(`INSERT INTO customerCred (email, mobile, password) VALUES (?, ?, ?)`,
          [email, mobile, hashedPass]);
        return res.send(`Registration Successful, Please use same password to login again.`);
      }
      catch(error){
        return res.status(500).send(`Unable to register at a moment, Please try Again Later`);
      }
    }
    catch(error){
      return res.status(500).send(`Unable to Verify your details at the Moment.`);
    }
  }
  catch(error){
    return res.send(`Unable to Connect to Server, Please Try again.`);
  }
});


App.post("/login", passport.authenticate('local'), (req, res)=>{
  res.send(`SUCCESS`);
})



passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password", passReqToCallback: true }, 
    async (req, username, password, done) => {
      try {
        const conn = await activateDb(); // Activate DB Connection
        try {
          const [rows] = await conn.query(
            `SELECT email, password FROM customerCred WHERE email = ?`, 
            [username]
          );

          if (rows.length === 0) {
            return done(null, false, { message: `User doesn't exist. Please register first.` });
          }

          const savedPass = rows[0].password;
          const match = await bcrypt.compare(password, savedPass);

          if (match) {
            return done(null, rows[0]); // Success - User found
          } else {
            return done(null, false, { message: `Incorrect Password` });
          }
        } catch (error) {
          return done(error);
        } finally {
          conn.close();
        }
      } catch (error) {
        console.log(`Error connecting to DB`, error);
        return done(error);
      }
    }
  )
);


passport.serializeUser((user, done) => {
  done(null, user.email);
});


passport.deserializeUser(async (email, done) => {
  try {
    const conn = await activateDb();
    const [rows] = await conn.query(`SELECT email FROM customerCred WHERE email = ?`, [email]);

    if (rows.length === 0) {
      return done(null, false);
    }
    
    return done(null, rows[0]);
  } catch (error) {
    return done(error);
  }
});





App.listen(PORT, ()=>{
  console.log(`http://localhost:${PORT}`);
});