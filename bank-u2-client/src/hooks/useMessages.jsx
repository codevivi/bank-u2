import { useCallback, useState } from "react";
import { v4 as uuid } from "uuid";

function useMessages() {
  const [messages, setMessages] = useState([]);

  //by wrapping in useCallBack stops from redefining it every render and can be used in useEffect with added as dependency
  const addMsg = useCallback(({ type, text }) => {
    setMessages((prevMessages) => [...prevMessages, { id: uuid(), type, text }]);
  }, []);
  const deleteMsg = (id) => {
    setMessages((prevMessages) => [...prevMessages].filter((msg) => msg.id !== id));
  };
  const deleteAllMsg = () => {
    setMessages([]);
  };

  return [messages, addMsg, deleteMsg, deleteAllMsg];
}

export default useMessages;
