import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import AxiosApi from "../api/AxiosApi";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    authority: "ROLE_USER",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await AxiosApi.signup(formData);
      const member = response.data.data;
      console.log("회원가입 완료");
      //alert(`${member.name}님,회원가입이 완료되었습니다.`);

      navigate("/login");
    } catch (error) {
      alert("회원 가입에 실패 했습니다.");
    }
  };

  return (
    <>
      <h1>회원가입</h1>
      <form onSubmit={handleSignup}>
        <input
          type="email"
          name="email"
          placeholder="이메일"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={formData.password}
          onChange={handleChange}
        />
        <input
          type="text"
          name="name"
          placeholder="이름"
          value={formData.name}
          onChange={handleChange}
        />
        <label>
          권한
          <select
            name="authority"
            value={formData.authority}
            onChange={handleChange}
          >
            <option value="ROLE_USER">일반 사용자</option>
            <option value="ROLE_ADMIN">관리자</option>
          </select>
        </label>
        <button type="submit">회원가입</button>
      </form>
    </>
  );
};
