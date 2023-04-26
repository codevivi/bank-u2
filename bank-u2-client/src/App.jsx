import Accounts from "./components/Accounts/Accounts";
import Header from "./components/Parts/Header";
import Footer from "./components/Parts/Footer";
import Messages from "./components/Messages/Messages";
import { useState } from "react";
import { v4 as uuid } from "uuid";

function App() {
  const [messages, setMessages] = useState([]);

  const addMsg = ({ type, text }) => {
    setMessages((prevMessages) => [...prevMessages, { id: uuid(), type, text }]);
  };
  const deleteMsg = (id) => {
    setMessages((prevMessages) => [...prevMessages].filter((msg) => msg.id !== id));
  };
  const deleteAllMsg = () => {
    setMessages([]);
  };
  return (
    <div className="App">
      <Header />
      <main className="container main">
        {messages.length > 0 && <Messages messages={messages} deleteMsg={deleteMsg} deleteAllMsg={deleteAllMsg} />}
        <Accounts addMsg={addMsg} />
      </main>
      <Footer />
    </div>
  );
}

export default App;
