import { createContext, useEffect, useState } from "react";
import useAccounts from "../hooks/useAccounts";

export const AccountsContext = createContext({});

export function AccountsProvider({ children }) {
  const [accounts, setAccounts, displayAccounts, setDisplayAccounts, filterFunc, setFilterFunc, setNewAccount, setDeleteAccount, setUpdateAccount] = useAccounts();

  return <AccountsContext.Provider value={{ accounts, setAccounts, displayAccounts, setDisplayAccounts, filterFunc, setFilterFunc, setNewAccount, setDeleteAccount, setUpdateAccount }}>{children}</AccountsContext.Provider>;
}
