import React, { useContext } from "react";

const UtilContext = React.createContext();

export const useGetDataFromServer = () => {
  return useContext(UtilContext);
};
export const UtilProvider = ({ children }) => {
  return <UtilProvider.Provider value={""}>{children}</UtilProvider.Provider>;
};
