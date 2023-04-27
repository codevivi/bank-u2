import { useState } from "react";
import Message from "./Message";
import { MdOutlineExpandLess, MdOutlineExpandMore } from "react-icons/md";
import { useContext } from "react";
import { GlobalContext } from "../../Contexts/GlobalCtx";

function Messages() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { messages, deleteMsg, deleteAllMsg } = useContext(GlobalContext);
  return (
    <div className={`messages ${isExpanded ? "expanded" : ""}`}>
      <div className="messages-inner">
        {messages?.map((msg) => (
          <Message key={msg.id} msg={msg} deleteMsg={deleteMsg} />
        ))}
      </div>
      {messages?.length > 1 && (
        <div className="controls">
          <button className="toggle-expand" onClick={() => setIsExpanded((is) => !is)}>
            {isExpanded ? <MdOutlineExpandLess /> : <MdOutlineExpandMore />}
          </button>
          <button onClick={deleteAllMsg} className="delete-all">
            Panaikinti visas {messages.length}
          </button>
        </div>
      )}
    </div>
  );
}

export default Messages;
