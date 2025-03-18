import { useContext } from 'react';
import styles from './Sidebar.module.css'
import { itemsContext } from '../Store/Context-store';
import { Link } from 'react-router-dom';
import { loginContext } from '../Store/Login-Context';
import { Button } from 'bootstrap/dist/js/bootstrap.bundle.min';



const Sidebar = () => {
  
  let {page, setPage} = useContext(itemsContext);
  let {userData, setUserData} = useContext(loginContext);

  const handleLogout = () => {
    // console.log(userData);
    setUserData({});
    localStorage.removeItem("userData");
  };
  

  return (
    <div className={`${styles.sidebar_container}`}>
      <div className={`d-flex flex-column flex-shrink-0 bg-body-tertiary`} style={{ width: "4.5rem" }}>

        <ul className="nav nav-pills nav-flush flex-column mb-auto text-center">

          <li>
            <Link to="/" className={`nav-link py-3 border-bottom rounded-0 ${page === 'HOME' ? 'active' : ''}`} title="Dashboard" onClick={()=>setPage(`HOME`)}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/shop/all" className={`nav-link py-3 border-bottom rounded-0 ${page === 'ALL' ? 'active' : ''}`} title="Customers" onClick={()=>setPage(`ALL`)}>
              All
            </Link>
          </li>
          <li>
            <Link to="/shop/vegetables" className={`nav-link py-3 border-bottom rounded-0 ${page === 'VEGETABLES' ? 'active' : ''}`} title="Orders" onClick={()=>setPage(`VEGETABLES`)}>
              Vegetables
            </Link>
          </li>
          <li>
            <Link to="/shop/fruits" className={`nav-link py-3 border-bottom rounded-0 ${page === 'FRUITS' ? 'active' : ''}`} title="Products" onClick={()=>setPage(`FRUITS`)}>
              Fruits
            </Link>
          </li>
          <li>
            <Link to="/shop/cutlery" className={`nav-link py-3 border-bottom rounded-0 ${page === 'CUTLERY' ? 'active' : ''}`} title="Customers" onClick={()=>setPage(`CUTLERY`)}>
              Cutlery
            </Link>
          </li>
          <li>
            <Link to="/shop/packing" className={`nav-link py-3 border-bottom rounded-0 ${page === 'PACKING' ? 'active' : ''}`} title="Customers" onClick={()=>setPage(`PACKING`)}>
              Packing
            </Link>
          </li>
          <li>
            <Link to="/shop/diary" className={`nav-link py-3 border-bottom rounded-0 ${page === 'DIARY' ? 'active' : ''}`} title="Products" onClick={()=>setPage(`DIARY`)}>
              Diary
            </Link>
          </li>
          <li>
            <Link to="/shop/grains" className={`nav-link py-3 border-bottom rounded-0 ${page === 'GRAINS' ? 'active' : ''}`} title="Customers" onClick={()=>setPage(`GRAINS`)}>
              Grains
            </Link>
          </li>
          <li>
            <Link to="/shop/beverages" className={`nav-link py-3 border-bottom rounded-0 ${page === 'BEVERAGES' ? 'active' : ''}`} title="Customers" onClick={()=>setPage(`BEVERAGES`)}>
              Beverages
            </Link>
          </li>
        </ul>



          {userData.email ? <div className="dropdown border-top">
          <a href="#" className="d-flex align-items-center justify-content-center p-3 link-body-emphasis text-decoration-none dropdown-toggle" data-bs-toggle="dropdown">
            <img src="https://github.com/mdo.png" alt="mdo" width="24" height="24" className="rounded-circle" />
          </a>
          <ul className="dropdown-menu text-small shadow">
            <li><a className="dropdown-item" href="/myorders">Orders</a></li>
            <li><a className="dropdown-item" href="/address">Address</a></li>
            <li><a className="dropdown-item" onClick={handleLogout}>Sign Out</a></li>
          </ul>
        </div>

        :

        <div className="dropdown border-top">
          <a href="#" className="d-flex align-items-center justify-content-center p-3 link-body-emphasis text-decoration-none dropdown-toggle" data-bs-toggle="dropdown">
            <img src="https://github.com/mdo.png" alt="mdo" width="24" height="24" className="rounded-circle" />
          </a>
          <ul className="dropdown-menu text-small shadow">
            <li><a className="dropdown-item" href="/login">Login</a></li>
          </ul>
        </div>
        }

      </div>
    </div>
  );
};

export default Sidebar;