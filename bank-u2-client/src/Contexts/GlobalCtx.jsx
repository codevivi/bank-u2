import { createContext, useEffect, useState } from "react";
import useMessages from "../hooks/useMessages";

export const GlobalContext = createContext({});

export function GlobalProvider({ children }) {
  const [messages, addMsg, deleteMsg, deleteAllMsg] = useMessages();

  return (
    <GlobalContext.Provider
      value={{
        messages: messages,
        addMsg: addMsg,
        deleteMsg: deleteMsg,
        deleteAllMsg: deleteAllMsg,
      }}>
      {children}
    </GlobalContext.Provider>
  );
}
