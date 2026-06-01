import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { ModalProvider } from "./context/ModalContext";
import Modal from "./components/Modal";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // 로그인 상태 전역 공유
  <AuthProvider>
    <ModalProvider>
      <App />
      <Modal />
    </ModalProvider>
  </AuthProvider>,
);
