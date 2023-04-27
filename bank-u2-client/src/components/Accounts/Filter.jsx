import { useContext, useEffect, useState } from "react";
import { AccountsContext } from "../../Contexts/AccountsCtx";

function Filter() {
  const [radioFilter, setRadioFilter] = useState(null);
  const { setFilterFunc } = useContext(AccountsContext);

  const filterWithMoney = (displayAccounts) => displayAccounts.filter((displayAccount) => displayAccount.money > 0);
  const filterNoMoney = (displayAccounts) => displayAccounts.filter((displayAccount) => !displayAccount.money);

  useEffect(() => {
    switch (radioFilter) {
      case "with-money":
        setFilterFunc(() => filterWithMoney);
        break;
      case "no-money":
        setFilterFunc(() => filterNoMoney);
        break;
      default:
        setFilterFunc(() => null);
    }
  }, [radioFilter, setFilterFunc]);

  const handleFilterClick = (filter) => {
    if (radioFilter === filter || filter === null) {
      setRadioFilter(null);
      return;
    }
    setRadioFilter(filter);
  };

  return (
    <div className="filters">
      <button className={"checkbox " + (radioFilter === null ? "checked" : "")} onClick={() => handleFilterClick(null)}>
        Visos
      </button>
      <button className={"checkbox " + (radioFilter === "with-money" ? "checked" : "")} onClick={() => handleFilterClick("with-money")}>
        Kuriose yra pinigų
      </button>
      <button className={"checkbox " + (radioFilter === "no-money" ? "checked" : "")} onClick={() => handleFilterClick("no-money")}>
        Tuščios
      </button>
    </div>
  );
}

export default Filter;
