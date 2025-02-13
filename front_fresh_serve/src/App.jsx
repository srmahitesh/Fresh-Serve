import "./App.css";
import Header from "./Components/Header";
import Sidebar from "./Components/Sidebar";
import { Outlet } from "react-router-dom";
import ItemsProvider from "./Store/Context-store";
import CartContextProvider from "./Store/Cart-store";
import Product_Detailed from "./Components/Product_Detailed";
import LoginContextProvider from "./Store/Login-Context";

function App() {
  return (

    <LoginContextProvider>
    <CartContextProvider>
      <ItemsProvider>
        <div className="app-container">
          <Sidebar />
          <div className="main-content">
            <Header />

            <Outlet /> 
            {/* this content needs to changed dynamically hile above is common in all pages */}

          </div>
        </div>
      </ItemsProvider>
    </CartContextProvider>
    </LoginContextProvider>
  );
}

export default App;
