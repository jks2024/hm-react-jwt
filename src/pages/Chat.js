import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import AxiosApi from "../api/AxiosApi";

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #f0f2f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 16px;
`;

const Card = styled.div`
  width: 100%;
  max-width: 600px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

const CardHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 28px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderTitle = styled.h1`
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
`;

const HeaderBadge = styled.span`
  background: rgba(255, 255, 255, 0.25);
  color: #ffffff;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
`;

const RoomList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const RoomItem = styled.li`
  background: #f8f9ff;
  border: 1.5px solid #e8eaf6;
  border-radius: 12px;
  padding: 18px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s ease;

  &:hover {
    background: #eef0ff;
    border-color: #667eea;
    box-shadow: 0 2px 12px rgba(102, 126, 234, 0.15);
    transform: translateY(-1px);
  }
`;

const RoomInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const RoomName = styled.p`
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0;
`;

const RoomDate = styled.p`
  font-size: 0.78rem;
  color: #9ca3af;
  margin: 0;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #9ca3af;
  p:first-child {
    font-size: 2.5rem;
    margin: 0 0 12px;
  }
  p:last-child {
    font-size: 0.95rem;
  }
`;

const CreateButton = styled.button`
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  font-size: 1.6rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.08) rotate(90deg);
  }
`;

const Chat = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getChatRooms = async () => {
      try {
        const rsp = await AxiosApi.chatList();
        setChatRooms(rsp.data);
      } catch (error) {
        console.error("채팅방 목록 조회 실패:", error);
      }
    };
    getChatRooms();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleString("ko-KR", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <PageWrapper>
      <Card>
        <CardHeader>
          <HeaderTitle>💬 채팅방 목록</HeaderTitle>
          <HeaderBadge>{chatRooms.length}개</HeaderBadge>
        </CardHeader>
        <RoomList>
          {chatRooms.length === 0 ? (
            <EmptyState>
              <p>🗨️</p>
              <p>채팅방이 없습니다. + 버튼으로 만들어보세요!</p>
            </EmptyState>
          ) : (
            chatRooms.map((room) => (
              <RoomItem
                key={room.roomId}
                onClick={() => navigate(`/chatting/${room.roomId}`)}
              >
                <RoomInfo>
                  <RoomName>{room.name}</RoomName>
                  <RoomDate>{formatDate(room.regDate)}</RoomDate>
                </RoomInfo>
                <span style={{ color: "#667eea" }}>▶</span>
              </RoomItem>
            ))
          )}
        </RoomList>
      </Card>
      <CreateButton onClick={() => navigate("/chat-create")}>+</CreateButton>
    </PageWrapper>
  );
};

export default Chat;
