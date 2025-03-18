import styles from "./SignUpPage.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const SignUpPage = () => {

  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [name, setName] = useState("");

  let [error, setError] = useState("");
  const navigate = useNavigate();



  //Function to save user details
  const handleSignup = async(event) =>{
    event.preventDefault();

    const credentials = {
      name: name,
      password: password,
      email: email,
    }; ///object to be sent to backend
    // console.log(credentials);

    try{
      const result = await fetch(`https://backend-freshserve.onrender.com/newUser`, {
        method: "POST",
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(credentials),
      });

      const data = await result.json();
      //console.log(data.msg);

      if(data.msg === `Success`){
        setError(`Registration Successful, Redirecting to Login Page in 2 Seconds`);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
      else{
        setError(data.msg);
      }
    }
    catch(error){
      //console.log(`Error while Saving user ${error.stack}`);
    }
  }


  return (
    <div className={styles.formContainer}>
      <form className={styles.form} onSubmit={handleSignup}>
        <center><div><p style={{color: "red"}}>{error}</p></div></center>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name:</label>
          <input type="text" className="form-control" id="name" onChange={(event)=>setName(event.target.value)} required/>
        </div>

        <div>
          <label htmlFor="email" className="form-label">Email address:</label>
          <input type="email" className="form-control" id="email" onChange={(event)=>setEmail(event.target.value)} required/>
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password:</label>
          <input type="password" className="form-control" id="password" onChange={(event)=>setPassword(event.target.value)} required/>
        </div>

        <button type="submit" className="btn btn-primary">Submit</button>

        Already Have any account? <Link to={"/login"}>SignIn</Link>
      </form>
    </div>
  );
};

export default SignUpPage;