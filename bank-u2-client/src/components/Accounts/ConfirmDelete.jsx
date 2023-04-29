import Modal from "../Modal/Modal";

function ConfirmDelete({ close, account, handleDelete }) {
  return (
    <Modal close={close}>
      <div className="confirm-delete">
        <h2>
          Are you sure you want to DELETE account ({account.name} {account.surname})?
        </h2>
        <button onClick={handleDelete}>Delete account</button>
      </div>
    </Modal>
  );
}

export default ConfirmDelete;
