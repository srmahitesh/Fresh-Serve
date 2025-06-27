import { useContext, useState } from "react";
import { loginContext } from "../Store/Login-Context";
import styles from "./AddAddress.module.css"; // Import module CSS


const AddAddress = ({ fetchAddresses }) => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [street, setStreet] = useState("");
  const [gpsAddress, setGpsAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [phone, setPhone] = useState("");
  const [fetching, setFetching] = useState(false);
  const { userData } = useContext(loginContext);

  const handleNewAddress = async (event) => {
    event.preventDefault();

    if (!gpsAddress || !street) {
      alert("All Fields are mandatory!");
      return;
    }

    const obj = {
      latitude,
      longitude,
      street,
      landmark,
      phone,
      email: userData.email,
    };

    try {
      const result = await fetch("https://backend-freshserve.onrender.com/add-address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
      });

      if (!result.ok) throw new Error("Failed to add address");

      await result.json();
      alert("Address added successfully!");

      // Fetch updated addresses
      fetchAddresses();

      // Reset input fields
      setLatitude(null);
      setLongitude(null);
      setStreet("");
      setLandmark("");
      setGpsAddress("");
      setPhone("");
    } catch (error) {
      //console.error("Unable to add address now:", error);
    }
  };

  const fetchAddress = async (lat, lon) => {
    try {
      const apiKey = import.meta.env.VITE_OLA_API_KEY;
      if (!apiKey) {
        //console.error("Ola API key is missing");
        return;
      }

      const response = await fetch(
        `https://api.olamaps.io/places/v1/reverse-geocode?latlng=${lat},${lon}&api_key=${apiKey}`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        setGpsAddress(data.results[0].formatted_address);
      } else {
        setGpsAddress("Location not found");
      }
    } catch (error) {
      //console.error("Error fetching address:", error);
      setGpsAddress("Error fetching location");
    }
  };

  const getCoordinates = () => {
    setFetching(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          setLatitude(lat);
          setLongitude(lon);

          fetchAddress(lat, lon);
          setFetching(false);
        },
        (error) => {
          // console.error("Error fetching geolocation:", error);
          setFetching(false);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      setFetching(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Add New Address:</h1>
      <form onSubmit={handleNewAddress}>
        <div className="mb-3">
          <label className={styles.formLabel}>Full Address</label>
          <input
            type="text"
            className={styles.inputField}
            maxLength={200}
            value={street}
            onChange={(event) => setStreet(event.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className={styles.formLabel}>Landmark</label>
          <input
            type="text"
            className={styles.inputField}
            maxLength={80}
            value={landmark}
            onChange={(event) => setLandmark(event.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className={styles.formLabel}>Mobile No.</label>
          <input
            type="tel"
            className={styles.inputField}
            maxLength={10}
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className={styles.formLabel}>Current Location:</label>
          <input
            type="text"
            className={styles.inputField}
            maxLength={80}
            value={gpsAddress}
            placeholder="Press 'Get Location' button"
            required
            readOnly
          />
          <i>
            We are currently accepting orders from your current location to avoid delays.
            This location can only be set by GPS.
          </i>
          <button
            type="button"
            className={`${styles.btn} ${styles.getLocationBtn}`}
            onClick={getCoordinates}
          >
            {fetching ? "Fetching..." : "Get Location"}
          </button>
        </div>

        <button type="submit" className={`${styles.btn} ${styles.submitBtn}`}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddAddress;