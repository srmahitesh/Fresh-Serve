import { createContext, useContext, useReducer } from "react";

export const cartContext = createContext();

// 🛠️ Reducer Function to Handle Cart Updates
function reducer(state, action) {
  let newCartList = [...state.cartList]; // Copy existing cart list
  let newCartMap = new Map(state.cartMap); // Copy existing cart map

  let { item, prevQuantity } = action.payload;

  if (action.type === "Increase") {
    let present = false;

    for (let obj of newCartList) {
      if (obj.id === item.id) {
        obj.cart_quantity = prevQuantity + 1;
        newCartMap.set(obj.id, prevQuantity + 1);
        present = true;
      }
    }

    if (!present) {
      item.cart_quantity = 1;
      newCartMap.set(item.id, 1);
      newCartList.push(item);
    }
  }

  else if (action.type === "Decrease") {
    for (let i = 0; i < newCartList.length; i++) {
      if (newCartList[i].id === item.id) {
        if (prevQuantity === 1) {
          newCartMap.delete(item.id);
          newCartList.splice(i, 1); // Remove from list
        } else {
          newCartList[i].cart_quantity = prevQuantity - 1;
          newCartMap.set(item.id, prevQuantity - 1);
        }
        break;
      }
    }
  }

  return { cartList: newCartList, cartMap: newCartMap }; // Return updated state
}



const CartContextProvider = ({ children }) => {
  let [cartState, dispatch] = useReducer(reducer, { cartList: [], cartMap: new Map() });

  return (
    <cartContext.Provider value={{ cartList: cartState.cartList, cartMap: cartState.cartMap, dispatch }}>
      {children}
    </cartContext.Provider>
  );
};

export default CartContextProvider;
