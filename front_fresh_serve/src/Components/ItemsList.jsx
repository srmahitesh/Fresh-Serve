import { useContext, useEffect, useState } from "react";
import Spinner from "./Spinner";
import ItemCard from "./ItemCard";
import styles from "./ItemsList.module.css";
import { itemsContext } from "../Store/Context-store";
import { useParams } from "react-router-dom";
import NotFound from "./NotFound";

const ItemsList = () => {

  let { items, fetching, page, setPage } = useContext(itemsContext);
  let { pageId } = useParams();
  let [listToShow, setListToShow] = useState([]);


  
  useEffect(() => {
    if (pageId) {
      setPage(pageId.toUpperCase());
    }
  }, [pageId, setPage]);



  useEffect(()=>{
    switch(page){
      case `ALL`:{
        setListToShow(items);
        break;
      }
      case `VEGETABLES`:{
        setListToShow(items.filter(item=> item.category === `VEGETABLES`));
        break;
      }
      case `FRUITS`:{
        setListToShow(items.filter(item=> item.category === `FRUITS`));
        break;
      }
      case `CUTLERY`:{
        setListToShow(items.filter(item=> item.category === `CUTLERY`));
        break;
      }
      case `PACKING`:{
        setListToShow(items.filter(item=> item.category === `PACKING`));
        break;
      }
      case `DIARY`:{
        setListToShow(items.filter(item=> item.category === `DIARY`));
        break;
      }
      case `GRAINS`:{
        setListToShow(items.filter(item=> item.category === `GRAINS`));
        break;
      }
      case `PACKEGED FOOD`:{
        setListToShow(items.filter(item=> item.category === `PACKEGED FOOD`));
        break;
      }
      case `BEVERAGES`:{
        setListToShow(items.filter(item=> item.category === `BEVERAGES`));
        break;
      }
    }
  }, [page, items]);


  return (
    <div className={`${styles.flex_container}`}>
      <select name="sortby" id="sortby" className={`${styles.sortDropdown}`} onChange={(e) => {
        let val = e.target.value;
        let temp = [...listToShow];

        switch (val) {
          case "lowPrice":
            temp.sort((a, b) => a.curr_price - b.curr_price);
            break;
          case "highPrice":
            temp.sort((a, b) => b.curr_price - a.curr_price);
            break;
          case "new":
            temp.sort((a, b) => b.id - a.id);
            break;
          case "popular":
            temp = items;
            break;
        }
        setListToShow(temp);
      }}>
        <option value="popular">Popularity</option>
        <option value="new">Newest</option>
        <option value="lowPrice">Price Low to High</option>
        <option value="highPrice">Price High to Low</option>
      </select>

      {listToShow.map((item) => <ItemCard key={item.id} item={item} />)}
      {!fetching && listToShow.length === 0 && <NotFound/>}
      {fetching && <Spinner />}
    </div>
  );
};

export default ItemsList;
