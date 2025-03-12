import { useState } from "react";
import styles from "./Header.module.css";
import CartLogo from "./CartLogo";
import { Link } from "react-router-dom";


const Header = () => {
  const [location, setLocation] = useState("");
  const [fetching, setFetching] = useState(false);

  // Fetch current location
  const getLocation = () => {
    if (navigator.geolocation) {
      setFetching(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          await fetchAddress(lat, lon);
        },
        (error) => {
          setFetching(false);
          setLocation("Location access denied");
        }
      );
    } else {
      setLocation("Geolocation not supported");
    }
  };

  // Fetch address from Ola Maps API
  const fetchAddress = async (latitude, longitude) => {
    try {
      console.log(import.meta.env.VITE_OLA_API_KEY);
      const response = await fetch(
        `https://api.olamaps.io/places/v1/reverse-geocode?latlng=${latitude},${longitude}&api_key=${import.meta.env.VITE_OLA_API_KEY}`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        setLocation(data.results[0].formatted_address);
      } else {
        setLocation("Location not found");
      }
    } catch (error) {
      setLocation("Error fetching location");
    } finally {
      setFetching(false);
    }
  };

  return (
    <header className={`p-3 mb-3 border-bottom ${styles.header}`}>
      <div className="container d-flex align-items-center justify-content-between">
        {/* Left-aligned Logo */}
        <Link to=""><img
          src="https://raw.githubusercontent.com/srmahitesh/storage/refs/heads/main/freshServe.png"
          alt="logo"
          className={styles.logo}
         /> </Link>

        {/* Location Selection */}
        <div className={styles.locationContainer}>
        <b><i>Delivery in 30 Minutes</i></b>
          <p className={styles.locationText}>{fetching ? "Fetching location..." : location.substring(0, 20)}</p>

          <select
            name="location"
            id="location"
            className={styles.locationSelect}
            onChange={(e) => e.target.value === "fetch" && getLocation()}
          >
            <option value="" hidden>Select Location</option>
            <option value="fetch">{location.length === 0? <>Fetch My Location</> : <>Change My Location</>}</option>
          </select>
        </div>

        {/* Search Box */}
        <form className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3" role="search">
          <input
            type="search"
            className="form-control"
            placeholder="Search..."
            aria-label="Search"
          />
        </form>
        <CartLogo/>
      </div>
    </header>
  );
};

export default Header;
