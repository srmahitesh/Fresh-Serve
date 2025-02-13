import { useContext } from "react";
import { PiShoppingCartDuotone } from "react-icons/pi";
import { FaReceipt, FaMotorcycle, FaShoppingBag } from "react-icons/fa";
import { cartContext } from "../Store/Cart-store";
import styles from './CartLogo.module.css'; // Import the CSS module

const CartLogo = () => {
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

        {amount > 0 && <div className="offcanvas-body">
          <ul>
            {cartList.map((item) => (
              <li
                key={item.id}
                className={styles.cartItem} // Use CSS module class
              >
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
              <span>{amount < mrp ? <><del>₹{mrp}</del> ₹{amount}</> : <>{amount}</>}</span>
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
        </div>}
      </div>
    </>
  );
};

export default CartLogo;