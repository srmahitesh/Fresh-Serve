import { useContext, useRef } from "react";
import { PiShoppingCartDuotone } from "react-icons/pi";
import { FaReceipt, FaMotorcycle, FaShoppingBag } from "react-icons/fa";
import { cartContext } from "../Store/Cart-store";
import styles from './CartLogo.module.css'; // Import the CSS module
import { loginContext } from "../Store/Login-Context";
import { Link, useNavigate } from "react-router-dom";
import { addressContext } from "../Store/Address-store";

const CartLogo = () => {

  const {userData} = useContext(loginContext);
  const navigate = useNavigate();
  const selectAddressId = useRef();



  const handleCheckout = async (event) => {
    event.preventDefault();
  
    let tempCart = [];
    cartList.forEach((item) => {
      let itemObj = {
        name: item.name,
        price: item.curr_price,
        quantity: item.cart_quantity
      };
      tempCart.push(itemObj);
    });
    console.log(tempCart);
  
    try {
      let response = await fetch("https://backend-freshserve.onrender.com/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: grandTotal, cart: tempCart, address_id: selectAddressId.current.value, email: userData.email }),
      });
  
      let data = await response.json();
  
      if (data.success) {
        console.log("Order Created:", data.order);
        openRazorpay(data.order);
      } else {
        alert("Failed to create order");
      }
    } catch (error) {
      console.error("Checkout Error:", error);
    }
  };
  
  const openRazorpay = (order) => {
    const options = {
      key: import.meta.env.VITE_razorpay_key_id,
      amount: order.amount,
      currency: order.currency,
      order_id: order.id, // Use Razorpay order ID
      name: "Fresh Serve",
      description: "Test Transaction",
      handler: async function (response) {
        console.log("Payment Successful:", response);
  
        let verifyRes = await fetch("https://backend-freshserve.onrender.com/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(response),
        });
  
        let verifyData = await verifyRes.json();
  
        if (verifyData.success) {
          alert("Payment Verified!");
        } else {
          alert("Payment Verification Failed!");
        }
      },
      modal: {
        ondismiss: async function () {
          alert("Payment Cancelled by User");
          // Call /verify-payment with order id and null payment details to mark as Failed
          await fetch("https://backend-freshserve.onrender.com/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: order.id, // Use Razorpay order id
              razorpay_payment_id: null,
              razorpay_signature: null,
            }),
          });
        }
      },
      prefill: {
        name: "Hitesh Sharma",
        email: "kashyaphitesh456@gmail.com",
        contact: "9816567367",
      },
    };
  
    const rzp = new window.Razorpay(options);
    rzp.open();
  };
  





  const { cartList, dispatch } = useContext(cartContext);
  let amount = 0;
  let quantity = 0;
  let mrp = 0;

  cartList.forEach((item) => {
    amount += item.cart_quantity * item.curr_price;
    quantity += item.cart_quantity;
    mrp += item.mrp * item.cart_quantity;
  });

  let delivery = amount < 500 ? 25 : 0;
  let handlingCharge = 5;
  let grandTotal = amount + delivery + handlingCharge;

  const addItem = (item, prevQuantity) => {
    dispatch({
      type: "Increase",
      payload: { item, prevQuantity },
    });
  };

  const subtractItem = (item, prevQuantity) => {
    dispatch({
      type: "Decrease",
      payload: { item, prevQuantity },
    });
  };


  let {address, setAddress, fetchAddresses} = useContext(addressContext);

  return (
    <>
      <button
        className="btn btn-primary"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasRight"
        aria-controls="offcanvasRight"
      >
        <PiShoppingCartDuotone />
        {cartList.length === 0 ? (
          <>My Cart</>
        ) : (
          <>
            Rs.{amount}
            <br /> {quantity} Items
          </>
        )}
      </button>

      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="offcanvasRight"
        aria-labelledby="offcanvasRightLabel"
      >
        <div className="offcanvas-header">
          <h5 id="offcanvasRightLabel">My Cart</h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>

        {amount > 0 && (
          <div className="offcanvas-body">
            <ul>
              {cartList.map((item) => (
                <li key={item.id} className={styles.cartItem}>
                  <img
                    src={item.image}
                    alt={item.name}
                    width="60"
                    height="60"
                    className={styles.productImage}
                  />
                  <div className={styles.productDetails}>
                    <p className={styles.productName}>{item.name}</p>
                    <p className={styles.productUnits}>{item.units}</p>
                    <p className={styles.productPrice}>₹{item.curr_price}</p>
                  </div>
                  <div className={styles.quantityButtons}>
                    <button
                      onClick={() => subtractItem(item, item.cart_quantity)}
                      className={styles.quantityButton}
                    >
                      -
                    </button>
                    <span className={styles.quantityCount}>
                      {item.cart_quantity}
                    </span>
                    <button
                      onClick={() => addItem(item, item.cart_quantity)}
                      className={styles.quantityButton}
                    >
                      +
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className={styles.billingCard}>
              <h4 className={styles.billDetailsHeading}>Bill details</h4>
              <div className={styles.billItem}>
                <span>
                  <FaReceipt className={styles.billIcon} /> Items total
                </span>
                <span>
                  {amount < mrp ? (
                    <>
                      <del>₹{mrp}</del> ₹{amount}
                    </>
                  ) : (
                    <>{amount}</>
                  )}
                </span>
              </div>

              <div className={styles.billItem}>
                <span>
                  <FaMotorcycle className={styles.billIcon} /> Delivery charge
                </span>
                <span>
                  {delivery === 0 ? (
                    <>
                      <del>₹25</del> Free
                    </>
                  ) : (
                    <>₹{delivery}</>
                  )}
                </span>
              </div>

              <div className={styles.billItem}>
                <span>
                  <FaShoppingBag className={styles.billIcon} /> Handling charge
                </span>
                <span>₹{handlingCharge}</span>
              </div>

              <hr className={styles.billDivider} />

              <div className={styles.billTotal}>
                <span>Grand total</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>
            
              {userData.email ? <>
              <form onSubmit={handleCheckout}>
              <select name="address" id="address" ref={selectAddressId} required>
              <option value="" hidden>Select Address</option>

              {Array.isArray(address) && address.map(add => (
                <option key={add.add_id} value={add.add_id}>
                  {add.street_add}
                </option>
              ))}
            </select>


            <div className={styles.checkoutContainer}>
              <button className={styles.checkoutButton}>
                Checkout
              </button>
            </div>
            </form>
            </> : <Link to={'login'}><button className={styles.checkoutButton}>Login</button></Link> }
          </div>

        )}
      </div>
    </>
  );
};

export default CartLogo;