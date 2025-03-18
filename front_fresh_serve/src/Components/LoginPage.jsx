import { useContext, useEffect, useRef, useState } from "react";
import styles from "./SignUpPage.module.css";
import {Link, useNavigate} from "react-router-dom"
import { loginContext } from "../Store/Login-Context";

const LoginPage = ()=>{

  let {setUserData, userData} = useContext(loginContext);
  const navigate = useNavigate();

  // useEffect(()=>{
  //   console.log(userData)
  // }, [userData]);


  let email = useRef();
  let password = useRef();
  let [error, setError] = useState(``);

  const handleLogin = async(event) => {
    event.preventDefault();

    const credentials = {
      email: email.current.value,
      password: password.current.value,
    }

    try{
      let result = await fetch("https://backend-freshserve.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type" : "application/json",
        },
        body: JSON.stringify(credentials),
      });

      result = await result.json();
      if(result.msg === `Success`){

        //extract details like token & id
        setUserData({
          email: result.data.email,
          token: result.data.token,
          name: result.data.name,
        });
        
        localStorage.setItem("userData", JSON.stringify({
          email: result.data.email,
          token: result.data.token,
          name: result.data.name,
        }));

        navigate("/shop/all");
      }
      else{
        setError(result.msg);
      }
    }
    catch(error){
      //console.log("Error while initiating authentication" + error.stack);
    }
  };

  return <div className={styles.formContainer}>

      <form className={styles.form} onSubmit={handleLogin}>

      <center><div><p style={{color: "red"}}>{error}</p></div></center>

        <div>
          <label htmlFor="email" className="form-label">Email address:</label>
          <input type="email" ref={email} className="form-control" id="email" required/>
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password:</label>
          <input type="password" ref={password} className="form-control" id="password" required/>
        </div>

        <button type="submit" className="btn btn-primary">Submit</button>

        Don't Have any account? <Link to={"/signup"}>SignUp</Link>
      </form>

    </div>
}

export default LoginPage;
