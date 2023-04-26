import { useEffect } from "react";
import { useState } from "react";
import { MdClose } from "react-icons/md";

function Message({ msg, deleteMsg }) {
  const [isNewClass, setIsNewClass] = useState("active");
  useEffect(() => {
    let timeoutId = setTimeout(() => {
      setIsNewClass("");
    }, 4500);
    return () => clearTimeout(timeoutId);
  }, []);
  return (
    <div className={`msg ${msg.type} ${isNewClass}`}>
      <p>
        <span className="new-indicator"></span>
        {msg.text}
      </p>
      <button onClick={() => deleteMsg(msg.id)}>
        <MdClose />
      </button>
    </div>
  );
}

export default Message;
