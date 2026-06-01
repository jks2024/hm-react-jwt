import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import AxiosApi from "../api/AxiosApi";

// ── Styled Components ───────────────────────────────────────
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
// select 전용 스타일 (Input과 동일한 높이/테두리 유지)
const Select = styled.select`
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  background: white;
  cursor: pointer;
  &:focus {
    outline: none;
    border-color: #1a73e8;
  }
`;
const SubmitButton = styled.button`
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
const LoginLink = styled.p`
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
// ────────────────────────────────────────────────────────────

const SignUpPage = () => {
  const navigate = useNavigate();

  // 폼 상태를 하나의 객체로 관리 → handleChange 하나로 모든 필드 처리
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    authority: "ROLE_USER", // 기본값: 일반 사용자
  });

  // name 속성이 formData의 키와 일치해야 동작
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await AxiosApi.signup(formData);
      // 백엔드 ApiResponse: response.data.data = MemberResDto
      const member = response.data.data;
      alert(`${member.name}님, 회원가입이 완료되었습니다!`);
      navigate("/"); // 로그인 페이지로 이동
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "회원가입에 실패했습니다.";
      alert(errorMsg);
    }
  };

  return (
    <Container>
      <FormBox>
        <Title>✏️ 회원가입</Title>
        <form onSubmit={handleSignup}>
          <InputGroup>
            <label>이름</label>
            <Input
              type="text"
              name="name" // handleChange가 formData.name 업데이트
              placeholder="홍길동"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <label>이메일</label>
            <Input
              type="email"
              name="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <label>비밀번호</label>
            <Input
              type="password"
              name="password"
              placeholder="비밀번호를 입력하세요"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <label>권한</label>
            <Select
              name="authority" // handleChange가 formData.authority 업데이트
              value={formData.authority}
              onChange={handleChange}
            >
              <option value="ROLE_USER">일반 사용자</option>
              <option value="ROLE_ADMIN">관리자</option>
            </Select>
          </InputGroup>

          <SubmitButton type="submit">회원가입</SubmitButton>
        </form>

        <LoginLink>
          이미 계정이 있으신가요?
          <span onClick={() => navigate("/")}> 로그인 하기</span>
        </LoginLink>
      </FormBox>
    </Container>
  );
};

export default SignUpPage;
