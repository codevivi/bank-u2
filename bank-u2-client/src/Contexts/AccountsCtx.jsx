import { createContext, useEffect, useState } from "react";
import useAccounts from "../hooks/useAccounts";

export const AccountsContext = createContext({});

export function AccountsProvider({ children }) {
  const [accounts, setAccounts, displayAccounts, setDisplayAccounts, filterFunc, setFilterFunc, setNewAccount, setDeleteAccountId, setUpdateAccount] = useAccounts();

  return <AccountsContext.Provider value={{ accounts, setAccounts, displayAccounts, setDisplayAccounts, filterFunc, setFilterFunc, setNewAccount, setDeleteAccountId, setUpdateAccount }}>{children}</AccountsContext.Provider>;
}
