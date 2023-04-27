import Accounts from "./components/Accounts/Accounts";
import Header from "./components/Parts/Header";
import Footer from "./components/Parts/Footer";
import Messages from "./components/Messages/Messages";
import { useEffect, useState } from "react";
import { GlobalProvider, GlobalContext } from "./components/Contexts/Global";
import { useContext } from "react";

function App() {
  return (
    <GlobalProvider>
      <div className="App">
        <Header />
        <main className="container main">
          <Messages />
          <Accounts />
        </main>
        <Footer />
      </div>
    </GlobalProvider>
  );
}

export default App;
