import { useState, useRef, useEffect, useCallback, useContext } from "react";
import axios from "axios";

import { v4 as uuid } from "uuid";
import useMessages from "./useMessages";
import { GlobalContext } from "../Contexts/GlobalCtx";

function useAccounts() {
  const [accounts, setAccounts] = useState(null);
  const [displayAccounts, setDisplayAccounts] = useState(accounts);
  const [filterFunc, setFilterFunc] = useState(null);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);

  const [newAccount, setNewAccount] = useState(null);
  const [deleteAccountId, setDeleteAccountId] = useState(null);
  const [updateAccount, setUpdateAccount] = useState(null);

  const accountsInEditSave = useRef({});

  const { addMsg } = useContext(GlobalContext);

  const URL = "http://localhost:5000/accounts";

  const sortBySurname = (accounts) => {
    return accounts.sort((a, b) => a.surname.localeCompare(b.surname, "lt", { sensitivity: "base" }));
  };

  // get from db
  useEffect(() => {
    axios
      .get(URL)
      .then((res) => {
        if (res.data.message !== "OK") {
          throw new Error();
        }
        setAccounts(res.data.accounts);
      })
      .catch((e) => {
        addMsg({ type: "error", text: `Atsiprašome, serverio klaida` });
      });
  }, [lastUpdateTime, addMsg]);

  // use sorted and filtered accounts for display if filter function set
  useEffect(() => {
    if (accounts === null) {
      return;
    }
    let accountsTemp = filterFunc !== null ? filterFunc(accounts) : accounts;
    accountsTemp = sortBySurname(accountsTemp);
    setDisplayAccounts(accountsTemp);
  }, [accounts, filterFunc]);

  // add account to db
  useEffect(() => {
    if (newAccount === null) {
      return;
    }
    const promiseId = uuid();
    //create fake id and display as created, only with blanked edit options
    setAccounts((accounts) => [...accounts, { ...newAccount, promiseId, id: promiseId }]);
    addMsg({ type: "success", text: `Kliento (${newAccount.name} ${newAccount.surname}) sąskaita  sėkmingai sukurta.` });

    axios
      .post(URL, { account: newAccount, promiseId })
      .then((res) => {
        if (res.data.message !== "OK") {
          throw new Error();
        }
        setAccounts((accounts) => accounts.map((account) => (account.promiseId === res.data.promiseId ? { ...account, promiseId: null, id: res.data.id } : { ...account })));
      })
      .catch((e) => {
        //in case server could not save account, remove account from display
        setAccounts((accounts) => accounts.filter((account) => account.promiseId !== promiseId));
        addMsg({ type: "error", text: `Atsiprašome, įvyko serverio klaida kuriant sąskaitą (${newAccount.name} ${newAccount.surname})` });
      });
  }, [newAccount, addMsg]);

  // delete account from db
  //   useEffect(() => {
  //     if (deleteAccountId === null) {
  //       return;
  //     }
  //     dbDeleteById({ key: DB_KEY, id: deleteAccountId });
  //     setLastUpdateTime(Date.now());
  //   }, [deleteAccountId]);

  // update account in db
  useEffect(() => {
    if (updateAccount === null) {
      return;
    }
    const promiseId = uuid();
    const id = updateAccount.old.id;
    //save account before edit in case edit in server won't succeed
    accountsInEditSave.current[updateAccount.old.id] = { ...updateAccount.old };
    setAccounts((accounts) => accounts.map((account) => (account.id === updateAccount.new.id ? { ...account, ...updateAccount.new, promiseId } : { ...account })));

    // addMsg({ type: "success", text: "updated bla bla" });
    axios
      .put(URL + "/" + updateAccount.new.id, { account: updateAccount.new, promiseId })
      .then((res) => {
        if (res.data.message !== "OK") {
          throw new Error();
        } else {
          setAccounts((accounts) => accounts.map((account) => (account.promiseId === res.data.promiseId ? { ...account, promiseId: null } : { ...account })));
        }
      })
      .catch((e) => {
        //if save edit in server did not happen restore previous account
        setAccounts((accounts) => accounts.map((account) => (account.promiseId === promiseId ? { ...accountsInEditSave.current[id] } : { ...account })));
        addMsg({ type: "error", text: `Atsiprašome, įvyko klaida išsaugant sąskaitos (${updateAccount.new.name} ${updateAccount.new.surname}) pakeitimus` });
        //??????? how to delete?
        // delete accountsInEditSave.current[id];
      });
  }, [updateAccount, addMsg]);
  return [accounts, setAccounts, displayAccounts, setDisplayAccounts, filterFunc, setFilterFunc, setNewAccount, setDeleteAccountId, setUpdateAccount];
}
export default useAccounts;
