import { Children, createContext, useContext, useEffect, useState } from "react";
import { loginContext } from "./Login-Context";

export const addressContext = createContext();

const AddressProvider = ({children})=>{
  let {userData} = useContext(loginContext);
  let [address, setAddress] = useState([]);



  const fetchAddresses = async () => {
    try {
      let result = await fetch("https://backend-freshserve.onrender.com/get_address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
        body: JSON.stringify(userData),
      });

      result = await result.json();

      setAddress(result);
      console.log(address);
      
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  useEffect(()=>{
    fetchAddresses();
  }, [userData.email]);

  return <addressContext.Provider value = {{address, setAddress, fetchAddresses}}>
    {children}
  </addressContext.Provider>
}

export default AddressProvider;