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

  const handleLogin = async (e) => {
    e.preventDefault(); // 원래 폼의 이벤트 제거
    try {
      const response = await AxiosApi.login(email, password);

      // 백엔드 ApiResponse 구조 : response.data.data = TokenDto
      const { accessToken, refreshToken } = response.data.data;

      // 토큰 로컬스토리지 저장
      Common.setAccessToken(accessToken);
      Common.setRefreshToken(refreshToken);

      // 전역 상태 관리 업데이트
      login({ email });
      navigate("/posts"); // 로그인 성공 시 페이지 이동
    } catch (error) {
      alert("이메일 또는 비밀번호가 일치하지 않습니다.");
    }
  };

  return <></>;
};
