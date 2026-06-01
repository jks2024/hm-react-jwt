import React from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";
import AxiosApi from "../api/AxiosApi";

const Navbar = styled.nav`
  background: #1a73e8;
  padding: 0 24px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Logo = styled(Link)`
  color: #fff;
  font-size: 1.3rem;
  font-weight: bold;
  text-decoration: none;
`;
const Menu = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;
const NavLink = styled(Link)`
  color: ${(p) => (p.$active ? "#ffd700" : "#fff")};
  font-weight: ${(p) => (p.$active ? "bold" : "normal")};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;
const LogoutBtn = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.5);
  padding: 6px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;
const Content = styled.main`
  max-width: 900px;
  margin: 30px auto;
  padding: 0 20px;
`;

const BoardLayout = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();

  const handleLogout = async () => {
    try {
      //await Boarlogout(); // 서버에 리프레시 토큰 제거 요청
    } catch (e) {
      console.error(e);
    } finally {
      logout(); // 로컬스토리지 전체 제거 + Context 상태 초기화
      navigate("/"); // 로그인 페이지로 이동
    }
  };

  return (
    <>
      <Navbar>
        <Logo to="/posts">📝 자유게시판</Logo>
        <Menu>
          <NavLink to="/posts" $active={loc.pathname === "/posts"}>
            게시글
          </NavLink>
          <NavLink to="/myinfo" $active={loc.pathname === "/myinfo"}>
            내 정보
          </NavLink>
          {isLoggedIn && <span style={{ color: "#fff" }}>{user?.name}님</span>}
          <LogoutBtn onClick={handleLogout}>로그아웃</LogoutBtn>
        </Menu>
      </Navbar>
      <Content>
        <Outlet /> {/* ← 하위 라우트가 여기에 렌더링됨 */}
      </Content>
    </>
  );
};

export default BoardLayout;
