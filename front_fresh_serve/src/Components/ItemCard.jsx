import styles from "./ItemCard.module.css";
import { cartContext } from "../Store/Cart-store";
import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";


const ItemCard = ({item})=>{
  let {dispatch, cartMap} = useContext(cartContext);
  

  const addItem = (event, item, prevQuantity) =>{
    event.preventDefault();
    dispatch({
      type: "Increase",
      payload: {item, prevQuantity}
    });
  }

  const subtractItem = (event, item, prevQuantity) =>{
    event.preventDefault(); //helping to avoid opening detailed page, stops the flow control
    dispatch({
      type: "Decrease",
      payload: {item, prevQuantity}
    });
  }

  let discount = item.mrp - item.curr_price;
  let off = Math.floor( (discount / item.mrp) * 100);
  return <div>

  <Link to={`/product/${item.id}`}className={`${styles.noUnderline}`}>
  <div className="card" style={{width: "18rem"}}>
  <img src={item.image} className="card-img-top" alt="item_picture" height={"190px"} width={"100px"}/>
  <div className="card-body" key={item.id}>
    <h5 className="card-title">{item.name}</h5>
    <h6 className="card-text">Net Qty: {item.units}</h6>
    <p >₹{item.curr_price} <span style={{ fontSize: 'medium', color: 'green' }}>{off}% Off</span> </p>
    <p style={{fontSize: "medium"}}><del>₹{item.mrp}</del></p>


      {cartMap.has(item.id) ? (
        <>
          <button onClick={(event) => subtractItem(event, item, cartMap.get(item.id))} type="button" class="btn btn-light">-</button>
          <span style={{ fontSize: "medium" }}>{cartMap.get(item.id)}</span>
        <button onClick={(event) => addItem(event, item, cartMap.get(item.id))} type="button" class="btn btn-light">+</button>

        </>
      ) : (
        <button className="btn btn-primary" onClick={(event) => addItem(event, item, 0)}>Add to Cart</button>
      )}


  </div>
</div>
</Link>

  </div>
}

export default ItemCard;
