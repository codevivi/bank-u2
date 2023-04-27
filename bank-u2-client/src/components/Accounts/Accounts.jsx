import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { v4 as uuid } from "uuid";
import AddAccount from "./AddAccount";
import OneAccountRow from "./OneAccountRow";
import Filter from "./Filter";
import Stats from "./Stats";
import { dbAdd, dbDeleteById, dbGet, dbUpdate } from "../../db";
import { useContext } from "react";
import { GlobalContext } from "../Contexts/Global";

const DB_KEY = "accounts";

export default function Accounts() {
  const [accounts, setAccounts] = useState(null);
  const [displayAccounts, setDisplayAccounts] = useState(accounts);
  const [filterFunc, setFilterFunc] = useState(null);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);

  const [newAccount, setNewAccount] = useState(null);
  const [deleteAccountId, setDeleteAccountId] = useState(null);
  const [updateAccount, setUpdateAccount] = useState(null);

  const [addAccountModalOpen, setAddAccountModalOpen] = useState(false);
  // const [msg, setMsg] = useState(null);

  const accountsInEditSave = useRef({});

  const URL = "http://localhost:5000/accounts";

  const { addMsg } = useContext(GlobalContext);

  // useEffect(() => {
  //   if (msg === null) {
  //     return;
  //   }
  //   addMsg(msg);
  // }, [msg]);

  // const newMsg = (type, text) => {
  //   setMsg({ type: type, text: text });
  // };

  // get from db and use default sort by surname
  useEffect(() => {
    axios
      .get(URL)
      .then((res) => {
        if (res.data.message !== "OK") {
          throw new Error();
        }
        setAccounts(res.data.accounts.sort((a, b) => a.surname.localeCompare(b.surname, "lt", { sensitivity: "base" })));
        addMsg({ type: "error", text: `bal bla bla bla` });
      })
      .catch((e) => {
        addMsg({ type: "error", text: `Atsiprašome, serverio klaida` });
      });
  }, [lastUpdateTime]);

  // use filtered accounts for display if filter function set
  useEffect(() => {
    setDisplayAccounts(filterFunc !== null ? filterFunc(accounts) : accounts);
  }, [accounts, filterFunc]);

  // add account to db
  useEffect(() => {
    if (newAccount === null) {
      return;
    }
    const promiseId = uuid();

    setAccounts((accounts) => [...accounts, { ...newAccount, promiseId, id: promiseId }]);
    addMsg({ type: "success", text: "Nauja s s" });

    axios.post(URL, { account: newAccount, promiseId }).then((res) => {
      if (res.data.message !== "OK") {
        setAccounts((accounts) => accounts.filter((account) => account.promiseId !== promiseId));
        addMsg({ type: "error", text: `Atsiprašome, įvyko klaida kuriant sąskaitą` });
        return;
      }
      setAccounts((accounts) => accounts.map((account) => (account.promiseId === res.data.promiseId ? { ...account, promiseId: null, id: res.data.id } : { ...account })));
    });
  }, [newAccount]);

  // delete account from db
  useEffect(() => {
    if (deleteAccountId === null) {
      return;
    }
    dbDeleteById({ key: DB_KEY, id: deleteAccountId });
    setLastUpdateTime(Date.now());
  }, [deleteAccountId]);

  // update account in db
  useEffect(() => {
    if (updateAccount === null) {
      return;
    }
    const promiseId = uuid();
    // const id = updateAccount.old.id;

    //save account before edit in case edit in server won't succeed
    console.log(updateAccount.old.id);
    accountsInEditSave.current[updateAccount.old.id] = { ...updateAccount.old };
    setAccounts((accounts) => accounts.map((account) => (account.id === updateAccount.new.id ? { ...account, ...updateAccount.new, promiseId } : { ...account })));

    addMsg({ type: "success", text: "updated bla bla" });
    axios.put(URL + "/" + updateAccount.new.id, { account: updateAccount.new, promiseId }).then((res) => {
      if (res.data.message !== "OK") {
        //if save edit in server did not happen restore previous account
        setAccounts((accounts) => accounts.map((account) => (account.promiseId === res.data.promiseId ? { ...accountsInEditSave.current[res.data.id] } : { ...account })));
        addMsg({ type: "error", text: `Atsiprašome, įvyko klaida išsaugant sąskaitos pakeitimus` });
      } else {
        setAccounts((accounts) => accounts.map((account) => (account.promiseId === res.data.promiseId ? { ...account, promiseId: null } : { ...account })));
      }
      //??????? how to delete?
      // delete accountsInEditSave.current[id];
    });
  }, [updateAccount]);

  if (accounts === null || displayAccounts === null) {
    return (
      <section className="accounts">
        <h1 style={{ fontSize: "48px" }}>Loading...</h1>;
      </section>
    );
  }
  return (
    <section className="accounts">
      <h1>Sąskaitos</h1>
      <div className="top">
        <Stats accounts={accounts} />
        <button className="open-btn" onClick={() => setAddAccountModalOpen(true)}>
          Pridėti sąskaitą
        </button>
      </div>
      {accounts?.length > 0 && (
        <>
          <Filter setFilterFunc={setFilterFunc} />

          <table className="accounts-table">
            <thead>
              <tr>
                <th>Pavardė</th>
                <th>Vardas</th>
                <th>Sąskaitos suma</th>
                <th>Veiksmai</th>
              </tr>
            </thead>

            <tbody>
              {displayAccounts.map((account) => (
                <OneAccountRow key={account.id} account={account} setDeleteAccountId={setDeleteAccountId} setUpdateAccount={setUpdateAccount} addMsg={addMsg} />
              ))}
            </tbody>
          </table>
        </>
      )}
      {addAccountModalOpen && <AddAccount setAddAccountModalOpen={setAddAccountModalOpen} setNewAccount={setNewAccount} addMsg={addMsg} />}
    </section>
  );
}
