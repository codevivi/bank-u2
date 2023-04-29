import { useState, useEffect, useContext } from "react";
import axios from "axios";

import { v4 as uuid } from "uuid";
import { GlobalContext } from "../Contexts/GlobalCtx";

function useAccounts() {
  const [accounts, setAccounts] = useState(null);
  const [displayAccounts, setDisplayAccounts] = useState(accounts);
  const [filterFunc, setFilterFunc] = useState(null);

  const [newAccount, setNewAccount] = useState(null);
  const [deleteAccount, setDeleteAccount] = useState(null);
  const [updateAccount, setUpdateAccount] = useState(null); //will save object with old(for save if server fails to delete) and new(updated) account

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
        console.log(e);
        addMsg({ type: "error", text: `Atsiprašome, serverio klaida` });
      });
  }, [addMsg]);

  // use sorted and filtered accounts for display if filter function set
  useEffect(() => {
    if (accounts === null) {
      return;
    }
    let accountsTemp = filterFunc !== null ? filterFunc(accounts) : accounts;
    accountsTemp = sortBySurname(accountsTemp);
    setDisplayAccounts(accountsTemp);
  }, [accounts, filterFunc]);

  // CREATE add account to db
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

  // DELETE account from db
  useEffect(() => {
    if (deleteAccount === null) {
      return;
    }
    setAccounts((accounts) => accounts.filter((account) => account.id !== deleteAccount.id));

    axios
      .delete(URL + "/" + deleteAccount.id)
      .then((res) => {
        if (res.data.message !== "OK") {
          throw new Error();
        }
      })
      .catch((e) => {
        setAccounts((accounts) => [...accounts, { ...deleteAccount }]);
        addMsg({ type: "error", text: `Atsiprašome, įvyko klaida panaikinant sąskaitą (${deleteAccount.name} ${deleteAccount.surname})` });
      });
  }, [deleteAccount, addMsg]);

  // UPDATE account in db
  useEffect(() => {
    if (updateAccount === null) {
      return;
    }
    const promiseId = uuid();
    setAccounts((accounts) => accounts.map((account) => (account.id === updateAccount.old.id ? { ...account, ...updateAccount.new, promiseId } : { ...account }))); //old and new id same

    axios
      .put(URL + "/" + updateAccount.old.id, { account: updateAccount.new, promiseId })
      .then((res) => {
        if (res.data.message !== "OK") {
          throw new Error();
        }
        setAccounts((accounts) => accounts.map((account) => (account.promiseId === res.data.promiseId ? { ...account, promiseId: null } : { ...account })));
      })
      .catch((e) => {
        //if save edit in server did not happen restore previous account
        setAccounts((accounts) => accounts.map((account) => (account.promiseId === promiseId ? { ...updateAccount.old } : { ...account })));
        addMsg({ type: "error", text: `Atsiprašome, įvyko klaida išsaugant sąskaitos (${updateAccount.old.name} ${updateAccount.old.surname}) pakeitimus` });
      });
  }, [updateAccount, addMsg]);

  return [accounts, setAccounts, displayAccounts, setDisplayAccounts, filterFunc, setFilterFunc, setNewAccount, setDeleteAccount, setUpdateAccount];
}

export default useAccounts;
