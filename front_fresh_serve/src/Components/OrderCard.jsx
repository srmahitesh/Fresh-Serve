import { useState } from "react";
import styles from "./OrderCard.module.css";
import OrderDetailedPage from "./OrderDetailedPage";

const OrderCard = ({ order }) => {
  const [showDetails, setShowDetails] = useState(false);

  function getDateFromString(milisecondsDate) {
    let date = new Date(parseInt(milisecondsDate.substr(2)));
    return date.toDateString();
  }

  return (
    <>
      <li
        className={styles.orderItem}
        onClick={() => setShowDetails(true)} // ✅ Correct onClick usage
      >
        <img
          src="https://th.bing.com/th/id/OIP.OWgzRfLTUIOoEbZ4TlpZ-wHaEF?rs=1&pid=ImgDetMain"
          alt="Order Icon"
          className={styles.orderIcon}
        />
        <div className={styles.orderDetails}>
          <h3 className={styles.orderId}>Order ID: {order.order_id}</h3>
          <p className={styles.orderAmount}>Amount: ₹{order.amount}</p>
          <p>{getDateFromString(order.order_id)}</p>
          <p
            className={`${styles.paymentStatus} ${
              order.payment_status === "Successful"
                ? styles.paid
                : order.payment_status === "PENDING"
                ? styles.pending
                : styles.failed
            }`}
          >
            {order.payment_status}
          </p>
        </div>
      </li>

      {/* ✅ Show Order Details when clicked */}
      {showDetails && <OrderDetailedPage order={order} />}
    </>
  );
};

export default OrderCard;
