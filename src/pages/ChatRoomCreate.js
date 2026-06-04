import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import AxiosApi from "../api/AxiosApi";

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #f0f2f5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
`;

const Card = styled.div`
  width: 100%;
  max-width: 440px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const CardHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 32px;
  text-align: center;
`;

const HeaderIcon = styled.div`
  font-size: 2.8rem;
  margin-bottom: 10px;
`;
const HeaderTitle = styled.h2`
  color: #ffffff;
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0;
`;
const CardBody = styled.div`
  padding: 32px;
`;
const Label = styled.label`
  display: block;
  font-size: 0.88rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 1rem;
  background: #f9fafb;
  outline: none;
  box-sizing: border-box;
  transition: all 0.2s ease;

  &:focus {
    border-color: #667eea;
    background: #ffffff;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
  }
`;

const CharCount = styled.p`
  text-align: right;
  font-size: 0.78rem;
  color: ${({ $over }) => ($over ? "#ef4444" : "#9ca3af")};
  margin: 6px 0 24px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
`;

const CancelButton = styled.button`
  flex: 0.6;
  padding: 14px;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  background: #f3f4f6;
  color: #6b7280;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #e5e7eb;
  }
`;

const ConfirmButton = styled.button`
  flex: 1;
  padding: 14px;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  background: ${({ disabled }) =>
    disabled ? "#d1d5db" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"};
  color: #ffffff;
  box-shadow: ${({ disabled }) =>
    disabled ? "none" : "0 4px 12px rgba(102,126,234,0.4)"};
  transition: all 0.2s ease;
  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }
`;

const MAX_LEN = 30;

const ChatRoomCreate = () => {
  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!roomName.trim()) return;
    setLoading(true);
    try {
      const response = await AxiosApi.chatCreate(roomName.trim());
      navigate(`/chatting/${response.data}`);
    } catch (error) {
      console.error("채팅방 생성 실패:", error);
      alert("채팅방 생성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Card>
        <CardHeader>
          <HeaderIcon>🏠</HeaderIcon>
          <HeaderTitle>새 채팅방 만들기</HeaderTitle>
        </CardHeader>
        <CardBody>
          <Label htmlFor="roomName">채팅방 이름</Label>
          <Input
            id="roomName"
            type="text"
            placeholder="채팅방 이름을 입력하세요"
            value={roomName}
            maxLength={MAX_LEN}
            onChange={(e) => setRoomName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            autoFocus
          />
          <CharCount $over={roomName.length >= MAX_LEN}>
            {roomName.length} / {MAX_LEN}
          </CharCount>
          <ButtonRow>
            <CancelButton onClick={() => navigate(-1)}>취소</CancelButton>
            <ConfirmButton
              onClick={handleCreate}
              disabled={!roomName.trim() || loading}
            >
              {loading ? "생성 중..." : "확인"}
            </ConfirmButton>
          </ButtonRow>
        </CardBody>
      </Card>
    </PageWrapper>
  );
};

export default ChatRoomCreate;
