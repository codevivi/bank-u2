import { useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuid } from "uuid";
import AddAccount from "./AddAccount";
import OneAccountRow from "./OneAccountRow";
import Filter from "./Filter";
import Stats from "./Stats";
import { dbAdd, dbDeleteById, dbGet, dbUpdate } from "../../db";

const DB_KEY = "accounts";

export default function Accounts({ addMsg }) {
  const [accounts, setAccounts] = useState(null);
  const [displayAccounts, setDisplayAccounts] = useState(accounts);
  const [filterFunc, setFilterFunc] = useState(null);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);

  const [newAccount, setNewAccount] = useState(null);
  const [deleteAccountId, setDeleteAccountId] = useState(null);
  const [updateAccount, setUpdateAccount] = useState(null);

  const [addAccountModalOpen, setAddAccountModalOpen] = useState(false);

  const URL = "http://localhost:5000/accounts";

  // get from db and use default sort by surname
  useEffect(() => {
    axios
      .get(URL)
      .then((res) => {
        if (res.data.message !== "OK") {
          throw new Error();
        }
        setAccounts(res.data.accounts.sort((a, b) => a.surname.localeCompare(b.surname, "lt", { sensitivity: "base" })));
      })
      .catch((e) => {
        addMsg({ type: "error", text: "Sorry, Server Error" });
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
    dbUpdate({ key: DB_KEY, data: updateAccount });
    setLastUpdateTime(Date.now());
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
