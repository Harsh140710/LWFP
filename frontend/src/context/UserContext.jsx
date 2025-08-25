import React, { createContext } from "react";
import { useContext, useState } from "react";

export const UserDataContext = createContext()

const UserContext = ({ children }) => {

  const [userData, setUserData] = useState({
    fullname:{
      firstname:"",
      lastname:"",
    },
    email:"",
    password:"",
    phoneNumber:"",
  });

  return (
    <>
      <UserDataContext.Provider value={{userData, setUserData}}>
        {children}
      </UserDataContext.Provider>
    </>
  );
};

export default UserContext;
