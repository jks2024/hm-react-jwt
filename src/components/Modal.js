import React from "react";
import styled from "styled-components";
import { useModal } from "../context/ModalContext";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;
const Box = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 32px;
  min-width: 320px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
`;
const Title = styled.h3`
  margin: 0 0 12px;
  font-size: 18px;
  color: #222;
`;
const Message = styled.p`
  color: #555;
  margin-bottom: 24px;
`;
const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;
const Btn = styled.button`
  padding: 8px 20px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  background: ${(p) => (p.$primary ? "#1a73e8" : "#eee")};
  color: ${(p) => (p.$primary ? "#fff" : "#333")};
  &:hover {
    opacity: 0.85;
  }
`;

const Modal = () => {
  const { modal, closeModal } = useModal();
  if (!modal.isOpen) return null; // 모달이 열린 상태가 아니면 렌더링 없음

  const handleConfirm = () => {
    if (modal.onConfirm) modal.onConfirm(); // 콜백 함수 실행
    closeModal();
  };

  return (
    <Overlay onClick={closeModal}>
      <Box onClick={(e) => e.stopPropagation()}>
        <Title>{modal.title}</Title>
        <Message>{modal.message}</Message>
        <Buttons>
          {modal.onConfirm && <Btn onClick={closeModal}>취소</Btn>}
          <Btn $primary onClick={handleConfirm}>
            확인
          </Btn>
        </Buttons>
      </Box>
    </Overlay>
  );
};
export default Modal;
