import { Children, createContext } from "react";
import { useState, useEffect } from "react";

export const itemsContext = createContext();

const ItemsProvider = ({children}) =>{


  let [items, setItems] = useState([]);
  let [fetching, setFetching] = useState(false);
  let [page, setPage] = useState(`HOME`);



  const fetchItems = async()=>{
    setFetching(true);
    try{
      let result = await fetch(`http://localhost:4000/get_items`);
      let temp = await result.json();
      console.log(temp);
      setItems(temp);
    }
    catch(error){
      console.log(`Something went wrong`);
    }
    finally{
      setFetching(false);
    }
  }

  

  useEffect(()=>{
    fetchItems();
  },[]);


  return <itemsContext.Provider value={{items, fetching, page, setPage}}>{children}</itemsContext.Provider>

}

export default ItemsProvider;