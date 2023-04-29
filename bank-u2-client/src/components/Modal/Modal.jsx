import { MdClose } from "react-icons/md";

function Modal({ children, close }) {
  return (
    <div className="modal">
      <div className="main">
        <button className="close-btn" onClick={close}>
          <MdClose />
        </button>
        <div className="content">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
