import { useContext } from "react";
import { useParams } from "react-router-dom";
import { itemsContext } from "../Store/Context-store";
import styles from "./Product_Detailed.module.css"
import NotFound from "./NotFound";
import { cartContext } from "../Store/Cart-store";

/*
bardcode_id
: 
855874555
brand
: 
"COCA COLA"
category
: 
"BEVERAGES"
curr_price
: 
38
descrp
: 
"Coca-Cola, also known as Coke, is a carbonated soft drink with a cola flavor. It was developed in 1886 by pharmacist John Stith Pemberton and originally contained cocaine from coca leaves and caffeine from kola nuts. The Coca-Cola Company, which sells the beverage in more than 200 countries, is a total beverage company with multiple billion-dollar brands worldwide."
id
: 
1
image
: 
"http://res.cloudinary.com/dqgsc4m4c/image/upload/v1739084072/kz31ftg7slcsii21cscg.webp"
keywords
: 
"COLD DRINK"
mrp
: 
40
name
: 
"COCA-COLA SOFT DRINK"
seller
: 
"Coca-Cola India Pvt Ltd"
stock
: 
196
units
: 
"750 ml"
*/

const Product_Detailed = () => {



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



  let {productId} = useParams();
  let product;
  let {items} = useContext(itemsContext);

  for(let item of items){
    if(item.id === parseInt(productId)){
      product = item;
      break;
    }
  }


  return <>
  {!product ? <NotFound/> :     <div className={styles.productContainer}>
      <div className={styles.imageSection}>
        <img src={product.image} alt={product.name} className={styles.productImage} />
      </div>

      <div className={styles.detailsSection}>
        <h1 className={styles.productTitle}>{product.name}</h1>
        <p className={styles.productDescription}>{product.descrp}</p>

        <div className={styles.priceSection}>
          <span className={styles.currentPrice}>₹{product.curr_price}</span>
          {product.mrp > product.curr_price && (
            <>
              <span className={styles.originalPrice}>₹{product.mrp}</span>
              <span className={styles.discount}>
                {Math.floor(((product.mrp - product.curr_price) / product.mrp) * 100)}% OFF
              </span>
            </>
          )}
        </div>

        <div className={styles.buttonSection}>

          {cartMap.has(product.id) ? (
            <>
              <button onClick={(event) => subtractItem(event, product, cartMap.get(product.id))} type="button" class="btn btn-light">-</button>
              <span style={{ fontSize: "medium" }}>{cartMap.get(product.id)}</span>
            <button onClick={(event) => addItem(event, product, cartMap.get(product.id))} type="button" class="btn btn-light">+</button>

            </>
          ) : (
            <button className={styles.addToCart} onClick={(event) => addItem(event, product, 0)}>Add to Cart</button>
          )}

        </div>
      </div>
    </div>}
  </>
};

export default Product_Detailed;