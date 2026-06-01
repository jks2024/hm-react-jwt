import { createContext, useContext, useState } from "react";

const ModalContext = createContext(null);

export const ModalProvider = ({ children }) => {
  // 모달 상태 : 열림 여부, 제목, 내용, 확인 콜백
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });
  // 모달 열기
  const openModal = ({ title, message, onConfirm }) => {
    setModal({ isOpen: true, title, message, onConfirm });
  };
  // 모달 닫기
  const closeModal = () => {
    setModal({ isOpen: false, title: "", message: "", onConfirm: null });
  };

  return (
    <ModalContext.Provider value={{ modal, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
export default ModalContext;
