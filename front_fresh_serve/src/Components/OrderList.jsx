import { useContext, useEffect, useState } from "react";
import { loginContext } from "../Store/Login-Context";
import { useNavigate } from "react-router-dom";
import styles from "./OrderList.module.css"; // Importing CSS module
import OrderCard from "./OrderCard";

const OrderList = () => {

  const [orderListArray, setOrderListArray] = useState([]);
  let [msg, setMsg] = useState("No Order Placed, Try Placing a new one now.");

  const { userData } = useContext(loginContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);


  const fetchOrders = async () => {
    if (!userData.token) {
      navigate("/login");
      return;
    }

    try {
      const result = await fetch("https://backend-freshserve.onrender.com/get-orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      let data = await result.json();
      if(data.msg === `Success`){
        console.log(data.result);
        setOrderListArray(data.result);
      }
      else{
        setMsg(data.msg);
      }
    } catch (error) {
      console.log(error.stack);
    }
  };

  return (
    <div className={styles.container}>
      {orderListArray.length === 0 ? (
        <h1 className={styles.noOrderText}>
          {msg}
        </h1>
      ) : (
        <ul className={styles.orderList}>
          {orderListArray.map((order) => (
            <OrderCard order = {order}/>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderList;