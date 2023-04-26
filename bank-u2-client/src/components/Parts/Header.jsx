import logo from "../../assets/images/logo.png";
function Header() {
  return (
    <header className="page-header">
      <div className="container">
        <div className="logo">
          <img src={logo} alt="React bank logo" width={96} />
          <span>React Bankas</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
