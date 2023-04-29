import CurrencyInput from "react-currency-input-field";
import { useContext, useState } from "react";
import formatCurrency from "../../utils/formatCurrency";
import { GlobalContext } from "../../Contexts/GlobalCtx";
import { AccountsContext } from "../../Contexts/AccountsCtx";
import ConfirmDelete from "./ConfirmDelete";

export default function OneAccountRow({ account }) {
  const [newAmount, setNewAmount] = useState(null);
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
  const { addMsg } = useContext(GlobalContext);
  const { setUpdateAccount, setDeleteAccount } = useContext(AccountsContext);

  const changeAmount = (value) => {
    if (value) {
      if (Number(value) > 1000000000000) {
        setNewAmount((1000000000000).toString());
        return;
      }
      setNewAmount(value);
      return;
    }
    setNewAmount(null);
  };

  const addMoneyToAccount = () => {
    if (newAmount !== null) {
      setUpdateAccount({ old: { ...account }, new: { ...account, money: account.money + Number(newAmount) } });
      addMsg({ type: "success", text: `${formatCurrency(newAmount)} pridėta į sąskaitą (${account.name} ${account.surname}).` });
    }
    setNewAmount(null);
  };

  const subtractMoneyFromAccount = () => {
    if (newAmount !== null) {
      if (account.money - Number(newAmount) < 0) {
        addMsg({ type: "error", text: "Pervedimas nepavyko: saskaitoje neužtenka pinigų." });
        return;
      }
      setUpdateAccount({ old: { ...account }, new: { ...account, money: account.money - Number(newAmount) } });
      addMsg({ type: "success", text: `${formatCurrency(newAmount)} nuskaičiuota iš (${account.name} ${account.surname}).` });
    }

    setNewAmount(null);
  };

  const handleDelete = () => {
    if (account.money > 0) {
      addMsg({ type: "error", text: "Sąskaitos kurioje yra pinigų ištrinti negalima." });
      return;
    }
    setDeleteAccount(account);
    addMsg({ type: "success", text: `Kliento (${account.surname} ${account.name}) sąskaita sėkmingai panaikinta.` });
    setConfirmDeleteModalOpen(false);
  };
  return (
    <tr>
      <td>
        <span className="mobile-header">Pavardė: </span>
        {account.surname}
      </td>
      <td>
        <span className="mobile-header">Vardas: </span>
        {account.name}
      </td>
      <td>
        <span className="mobile-header">Suma: </span>
        {formatCurrency(Number(account.money))}
      </td>
      <td className="td-actions">
        <div className="edit-actions">
          <CurrencyInput
            id="amount"
            placeholder="Įveskite sumą"
            suffix=" &euro;"
            decimalsLimit={2}
            decimalSeparator="."
            decimalScale={2}
            allowDecimals={true}
            name="amount"
            allowNegativeValue={false}
            groupSeparator=","
            value={newAmount || ""}
            onValueChange={(value) => changeAmount(value)}></CurrencyInput>
          <div className="control-box">
            <button className={`green ${account.promiseId ? "disabled" : ""}`} onClick={addMoneyToAccount}>
              {!newAmount && <span className="inline-msg">{account.promiseId ? "Wait..." : "Įrašykite sumą"}</span>}
              pridėti lėšų
            </button>
          </div>
          <div className="control-box">
            <button className={`orange ${account.money < newAmount || account.promiseId ? "disabled" : ""}`} onClick={subtractMoneyFromAccount}>
              {!newAmount && <span className="inline-msg">{account.promiseId ? "Wait..." : "Įrašykite sumą"}</span>}
              {account.money < newAmount && <span className="inline-msg red">Negalima nuskaičiuoti daugiau nei yra sąskaitoje.</span>}
              nuskaičiuoti lėšas
            </button>
          </div>
        </div>
        <div className="control-box">
          <button className={`red ${account.money > 0 || account.promiseId ? "disabled" : ""}`} onClick={() => setConfirmDeleteModalOpen(true)}>
            {account.money > 0 && <span className="inline-msg red">Negalima ištrinti sąskaitos kurioje yra pinigų.</span>}
            ištrinti
          </button>
          {confirmDeleteModalOpen && <ConfirmDelete close={() => setConfirmDeleteModalOpen(false)} handleDelete={handleDelete} account={account} />}
        </div>
      </td>
    </tr>
  );
}
