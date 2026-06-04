import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import AxiosApi from "../api/AxiosApi";
import Common from "../utils/Common";
import { useAuth } from "../context/AuthContext";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
`;
const FormBox = styled.div`
  width: 400px;
  padding: 50px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
`;
const Title = styled.h2`
  text-align: center;
  margin-bottom: 35px;
  color: #1a73e8;
  font-size: 28px;
`;
const InputGroup = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  label {
    font-size: 14px;
    font-weight: 600;
    color: #555;
  }
`;
const Input = styled.input`
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  &:focus {
    outline: none;
    border-color: #1a73e8;
  }
`;
const LoginButton = styled.button`
  width: 100%;
  padding: 15px;
  background-color: #1a73e8;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    background-color: #1557b0;
  }
`;
const SignupLink = styled.p`
  text-align: center;
  margin-top: 25px;
  font-size: 14px;
  color: #666;
  span {
    color: #1a73e8;
    cursor: pointer;
    font-weight: 600;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // ★ AuthContext에서 login 함수 가져오기
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault(); // form의 기본 이벤트 제거
    try {
      const response = await AxiosApi.login(email, password); // 비동기 통신

      // 백엔드 ApiResponse 구조: response.data.data = TokenDto
      const { accessToken, refreshToken, name } = response.data.data;

      // 토큰 로컬스토리지 저장
      Common.setAccessToken(accessToken);
      Common.setRefreshToken(refreshToken);

      // ★ AuthContext 상태 업데이트 (로그인 성공)
      login({ email, name }); // 간단히 email만 저장

      navigate("/posts");
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        "이메일 또는 비밀번호가 일치하지 않습니다.";
      alert(errorMsg);
    }
  };

  return (
    <Container>
      <FormBox>
        <Title>📝 게시판 로그인</Title>
        <form onSubmit={handleLogin}>
          <InputGroup>
            <label>이메일</label>
            <Input
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>
          <InputGroup>
            <label>비밀번호</label>
            <Input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </InputGroup>
          <LoginButton type="submit">로그인</LoginButton>
        </form>
        <SignupLink>
          처음이신가요?
          <span onClick={() => navigate("/signup")}>회원가입 하기</span>
        </SignupLink>
      </FormBox>
    </Container>
  );
};

export default LoginPage;
