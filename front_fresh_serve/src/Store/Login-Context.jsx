import { createContext, useState, useEffect } from "react";

export const loginContext = createContext();

const LoginContextProvider = ({ children }) => {
  const [userData, setUserData] = useState(() => {
    // Retrieve user data from localStorage on initial load
    const storedUser = localStorage.getItem("userData");
    return storedUser ? JSON.parse(storedUser) : {};
  });

  useEffect(() => {
    // Save user data to localStorage whenever it changes
    if (userData && Object.keys(userData).length !== 0) {
      localStorage.setItem("userData", JSON.stringify(userData));
    }
  }, [userData]);

  return (
    <loginContext.Provider value={{ userData, setUserData }}>
      {children}
    </loginContext.Provider>
  );
};

export default LoginContextProvider;
