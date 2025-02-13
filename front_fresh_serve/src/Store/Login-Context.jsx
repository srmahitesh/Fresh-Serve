import { createContext, useState } from "react";

export const loginContext = createContext();


const LoginContextProvider = ({children})=>{
  let [isLoggedIn, setLogin] = useState(true);

    return <loginContext.Provider value={{isLoggedIn}}>{children}</loginContext.Provider>
}

export default LoginContextProvider;