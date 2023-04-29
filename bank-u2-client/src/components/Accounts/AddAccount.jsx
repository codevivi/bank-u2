import { useContext, useState } from "react";
import { AccountsContext } from "../../Contexts/AccountsCtx";
import Modal from "../Modal/Modal";

export default function AddAccount({ setAddAccountModalOpen }) {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const { setNewAccount } = useContext(AccountsContext);

  function controlValidNameAndSurname(val) {
    val = val.replaceAll(/[^A-Za-ząčęėįšųūžĄČĘĖĮŠŲŪŽ\s]/g, "");
    //replace multiple spaces with one
    val = val.replaceAll(/ +/g, " ");
    val = val.split(" ");
    //make words start with uppercase
    val = val.map((word) => (word.length > 0 ? word[0]?.toUpperCase() + word.slice(1).toLowerCase() : "")).join(" ");
    return val;
  }

  function handleNameChange(e) {
    let name = e.target.value.trimStart();
    setName(controlValidNameAndSurname(name));
  }
  function handleSurnameChange(e) {
    let surname = e.target.value.trimStart();
    setSurname(controlValidNameAndSurname(surname));
  }
  function handleForm(e) {
    e.preventDefault();

    setName((name) => name.trim());
    setSurname((surname) => surname.trim());

    if (name && surname) {
      setNewAccount({ name, surname, money: 0 });

      setName("");
      setSurname("");
      setAddAccountModalOpen(false);
      return;
    }
  }

  return (
    <Modal close={() => setAddAccountModalOpen(false)}>
      <div className="add-account">
        <h2>Sukurti naują sąskaitą</h2>
        <form onSubmit={handleForm} className="add-account-form">
          <div>
            <label htmlFor="name">Vardas</label>
            <input id="name" autoFocus onChange={handleNameChange} required minLength={2} maxLength={30} name="name" value={name} type="text" />
          </div>
          <div>
            <label htmlFor="surname">Pavardė</label>
            <input id="surname" onChange={handleSurnameChange} required minLength={2} maxLength={30} name="surname" value={surname} type="text" />
          </div>
          <button>Sukurti</button>
        </form>
      </div>
    </Modal>
  );
}
