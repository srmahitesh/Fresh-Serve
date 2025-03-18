import React, { useContext } from "react";
import styles from "./OrderDetailedPage.module.css";
import { addressContext } from "../Store/Address-store";

const OrderDetailedPage = ({ order }) => {
  // Extract date from order_id (milliseconds format)
  const orderDate = new Date(parseInt(order.order_id.slice(2))).toLocaleString();
  const {address} = useContext(addressContext);

  // console.log(JSON.stringify(address));
  let currAddress;
  for(let i = 0; i < address.length; i++){
    if(address[i].add_id === order.address_id){
      currAddress = address[i];
    }
  }

  // Parse the items JSON
  const items = JSON.parse(order.item);

  // Calculate item price
  let itemPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

  // Fees
  const handlingFee = 5;
  const deliveryFee = itemPrice > 500 ? 0 : 25;
  const grandTotal = itemPrice + handlingFee + deliveryFee;

  return (
    <div className={styles.orderContainer}>
      {/* Order Header */}
      <div className={styles.orderHeader}>
        <h2>ORDER #{order.order_id}</h2>
        <p className={styles.status}>{order.payment_status}</p>
      </div>
      <p className={styles.orderDate}>{orderDate}</p>

      {/* Item Details */}
      <div className={styles.section}>
        <h3>ITEM DETAILS</h3>
        <ul className={styles.itemList}>
          {items.map((item, index) => (
            <li key={index} className={styles.item}>
              ✅ {item.quantity} x {item.name} <span className={styles.price}>₹{item.price * item.quantity}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Bill Details */}
      <div className={styles.section}>
        <h3>BILL DETAILS</h3>
        <p>Item Bill: <span className={styles.amount}>₹{itemPrice}</span></p>
        <p>Delivery Fee: <span className={styles.amount}>{deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}</span></p>
        <p>Handling Fee: <span className={styles.amount}>₹{handlingFee}</span></p>
        <p className={styles.total}>Grand Total: <span>₹{grandTotal}</span></p>
      </div>

      {currAddress && <> Delivery Address: {currAddress.street_add}, {currAddress.landmark}</>}
    </div>
  );
};

export default OrderDetailedPage;