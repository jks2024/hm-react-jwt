import { createContext, useContext, useState } from "react";

// Context 생성
const AuthContext = createContext(null);

// Provider 컴포넌트 생성 - 상태와 함수를 하위 컴포넌트 전체에 제공
export const AuthProvider = ({ children }) => {
  // 1. 상태 보관
  // localStorage에 토큰이 있으면 이미 로그인된 상태로 초기화
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("accessToken") !== null,
  );
  const [user, setUser] = useState(null);

  // 2. 상태 변경 함수 제공
  // 로그인 성공 시 호출 - 유저 정보를 받아 상태 업데이트
  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  // 로그아웃 시 호출 - 토큰 제거 + 상ㄹ태 초기화
  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUser(null);
  };

  // Provider로 하위 컴포넌트 전체에 값 배포
  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 커스텀 훅(Hook)
export const useAuth = () => useContext(AuthContext);
export default AuthContext;
