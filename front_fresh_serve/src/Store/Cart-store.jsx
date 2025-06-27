import { createContext, useReducer } from "react";

export const cartContext = createContext();

function reducer(state, action) {
  let newCartList = [...state.cartList];
  let newCartMap = new Map(state.cartMap);
  let { item, prevQuantity } = action.payload || {};

  if (action.type === "Increase") {
    let present = false;

    for (let obj of newCartList) {
      if (obj.id === item.id) {
        obj.cart_quantity = prevQuantity + 1;
        newCartMap.set(obj.id, prevQuantity + 1);
        present = true;
        break;
      }
    }

    if (!present) {
      item.cart_quantity = 1;
      newCartMap.set(item.id, 1);
      newCartList.push(item);
    }
  } else if (action.type === "Decrease") {
    for (let i = 0; i < newCartList.length; i++) {
      if (newCartList[i].id === item.id) {
        if (prevQuantity === 1) {
          newCartMap.delete(item.id);
          newCartList.splice(i, 1);
        } else {
          newCartList[i].cart_quantity = prevQuantity - 1;
          newCartMap.set(item.id, prevQuantity - 1);
        }
        break;
      }
    }
  } else if (action.type === "Clear") {
    newCartList = [];
    newCartMap = new Map();
  }

  // Persist updated cartList to localStorage
  localStorage.setItem("Cart_Data", JSON.stringify(newCartList));

  return { cartList: newCartList, cartMap: newCartMap };
}


const CartContextProvider = ({ children }) => {
  let storedCartList = [];
  
  // Try to safely parse stored cart data
  try {
    const data = localStorage.getItem("Cart_Data");
    const parsedData = JSON.parse(data);
    // Ensure parsedData is an array
    if (Array.isArray(parsedData)) {
      storedCartList = parsedData;
    }
  } catch (e) {
    console.error("Error parsing stored cart data", e);
  }

  // Rebuild cartMap from storedCartList
  const initialCartMap = new Map();
  for (let item of storedCartList) {
    initialCartMap.set(item.id, item.cart_quantity);
  }

  let [cartState, dispatch] = useReducer(reducer, {
    cartList: storedCartList,
    cartMap: initialCartMap,
  });

  return (
    <cartContext.Provider value={{ cartList: cartState.cartList, cartMap: cartState.cartMap, dispatch }}>
      {children}
    </cartContext.Provider>
  );
};

export default CartContextProvider;
