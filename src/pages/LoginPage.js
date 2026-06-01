import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import AxiosApi from "../api/AxiosApi";
import Common from "../utils/Common";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate(); // 페이지 이동
  const { login } = useAuth(); // 전역 상태 관리, AuthContext에서 login 함수 가져 오기
  const [email, setEmail] = useState(""); // 상태 관리
  const [password, setPassword] = useState("");
};
