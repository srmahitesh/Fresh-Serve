import { useContext, useEffect, useState } from "react";
import { loginContext } from "../Store/Login-Context";
import { useNavigate } from "react-router-dom";
import styles from "./Address.module.css";
import AddAddress from "./AddAddress";
import { addressContext } from "../Store/Address-store";

const Address = () => {
  const { userData } = useContext(loginContext);
  let {address, setAddress, fetchAddresses} = useContext(addressContext);


  return (
    <div className={styles.container}>
      <h1>Saved Addresses:</h1>

      {address.length === 0 && <h5>No Saved Address!</h5>}

      {address.map((add, index) => (
        <div key={index} className={styles.addressCard}>
          <p><strong>Street:</strong> {add.street_add}</p>
          <p><strong>Landmark:</strong> {add.landmark}</p>
          <p><strong>Phone No: </strong>{add.phone_no}</p>
        </div>
      ))}

      <div className={styles.addAddress}>
        <AddAddress fetchAddresses = {fetchAddresses}/>
      </div>
    </div>
  );
};

export default Address;
