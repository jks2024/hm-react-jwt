import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled, { keyframes, css } from "styled-components";
import AxiosApi from "../api/AxiosApi";
import { useAuth } from "../context/AuthContext";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const PageWrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #b2c7d9;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0 20px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const RoomTitle = styled.h2`
  color: #ffffff;
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0;
`;

const OnlineDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $on }) => ($on ? "#4ade80" : "#9ca3af")};
  display: inline-block;
  box-shadow: ${({ $on }) => ($on ? "0 0 6px #4ade80" : "none")};
`;

const ExitButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  border-radius: 8px;
  padding: 7px 14px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.35);
  }
`;

const MessageArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }
`;

const SystemMessage = styled.div`
  text-align: center;
  margin: 8px 0;
  animation: ${fadeIn} 0.3s ease;
  span {
    display: inline-block;
    background: rgba(0, 0, 0, 0.18);
    color: #ffffff;
    font-size: 0.74rem;
    padding: 4px 14px;
    border-radius: 20px;
  }
`;

/* ── 메시지 행 전체 래퍼: 내 메시지 → 오른쪽, 상대 → 왼쪽 ── */
const MessageRow = styled.div`
  display: flex;
  flex-direction: ${({ $isMine }) => ($isMine ? "row-reverse" : "row")};
  align-items: flex-end;
  gap: 8px;
  animation: ${fadeIn} 0.2s ease;
  /* 같은 사람이 연속으로 보낼 때 간격 축소 */
  margin-top: ${({ $gap }) => ($gap ? "10px" : "2px")};
`;

/* 아바타 (상대방만 표시) */
const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  font-size: 0.85rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  align-self: flex-start;
`;

/* 아바타 자리만 차지 (연속 메시지에서 아바타 숨길 때 공간 유지) */
const AvatarPlaceholder = styled.div`
  width: 36px;
  flex-shrink: 0;
`;

const BubbleCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${({ $isMine }) => ($isMine ? "flex-end" : "flex-start")};
  gap: 2px;
  max-width: 65%;
`;

const SenderName = styled.span`
  font-size: 0.74rem;
  font-weight: 600;
  color: #333;
  padding: 0 6px;
`;

const BubbleWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  flex-direction: ${({ $isMine }) => ($isMine ? "row-reverse" : "row")};
  gap: 4px;
`;

const Bubble = styled.div`
  padding: 10px 14px;
  border-radius: ${({ $isMine, $isFirst, $isLast }) => {
    if ($isMine) {
      if ($isFirst && $isLast) return "18px 4px 18px 18px";
      if ($isFirst) return "18px 4px 4px 18px";
      if ($isLast) return "18px 18px 18px 4px";
      return "18px 4px 4px 18px";
    } else {
      if ($isFirst && $isLast) return "4px 18px 18px 18px";
      if ($isFirst) return "4px 18px 4px 4px";
      if ($isLast) return "4px 18px 18px 18px";
      return "4px 18px 4px 4px";
    }
  }};
  font-size: 0.95rem;
  line-height: 1.5;
  word-break: break-word;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);

  ${({ $isMine }) =>
    $isMine
      ? css`
          background: #fee500;
          color: #1a1a1a;
        `
      : css`
          background: #ffffff;
          color: #1a1a1a;
        `}
`;

const BubbleTime = styled.span`
  font-size: 0.67rem;
  color: rgba(0, 0, 0, 0.45);
  white-space: nowrap;
  padding-bottom: 2px;
`;

const InputArea = styled.div`
  background: #f9f9f9;
  border-top: 1px solid #ddd;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

const TextInput = styled.input`
  flex: 1;
  padding: 11px 16px;
  border: 1.5px solid #e0e0e0;
  border-radius: 24px;
  font-size: 0.95rem;
  outline: none;
  background: #ffffff;
  transition: border-color 0.2s;
  &:focus {
    border-color: #667eea;
  }
`;

const SendButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: ${({ disabled }) =>
    disabled ? "#e5e7eb" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"};
  color: ${({ disabled }) => (disabled ? "#9ca3af" : "#ffffff")};
  font-size: 1.05rem;
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ disabled }) =>
    disabled ? "none" : "0 2px 8px rgba(102,126,234,0.45)"};
  transition: all 0.2s ease;
  flex-shrink: 0;
  &:hover:not(:disabled) {
    transform: scale(1.07);
  }
`;

const getTime = () =>
  new Date().toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });

const isSystemMsg = (type) => type === "ENTER" || type === "CLOSE";

const getInitial = (email = "") => email.charAt(0).toUpperCase();

const Chatting = () => {
  const [socketConnected, setSocketConnected] = useState(false);
  const [inputMsg, setInputMsg] = useState("");
  const [chatList, setChatList] = useState([]);
  const [roomName, setRoomName] = useState("");

  const { roomId } = useParams();
  const ws = useRef(null);
  const messageEndRef = useRef(null);
  const navigate = useNavigate();

  // ① AuthContext에서 이름 가져오기 (로그인 시 저장된 name)
  const { user } = useAuth();
  const sender = user?.name || "guest";

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await AxiosApi.chatDetail(roomId);
        setRoomName(res.data.name);
      } catch (e) {
        console.error(e);
      }
    };
    fetchRoom();
  }, [roomId]);

  useEffect(() => {
    if (!sender) return;
    const socket = new WebSocket("ws://localhost:8111/ws/chat");
    ws.current = socket;

    socket.onopen = () => {
      setSocketConnected(true);
      socket.send(
        JSON.stringify({ type: "ENTER", roomId, sender, message: "" }),
      );
    };
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setChatList((prev) => [...prev, { ...data, time: getTime() }]);
    };
    socket.onerror = (e) => console.error("WebSocket 오류:", e);
    socket.onclose = () => setSocketConnected(false);

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({ type: "CLOSE", roomId, sender, message: "" }),
        );
      }
      socket.close();
      ws.current = null;
    };
  }, [roomId, sender]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatList]);

  const sendMessage = () => {
    if (!inputMsg.trim() || !ws.current) return;
    if (ws.current.readyState !== WebSocket.OPEN) return;
    ws.current.send(
      JSON.stringify({
        type: "TALK",
        roomId,
        sender,
        message: inputMsg.trim(),
      }),
    );
    setInputMsg("");
  };

  const handleKeyUp = (e) => {
    if (e.key === "Enter" && inputMsg.trim()) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleExit = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({ type: "CLOSE", roomId, sender, message: "" }),
      );
      ws.current.close();
      ws.current = null;
    }
    navigate("/chat");
  };

  /* ── 연속 메시지 그룹 계산 ── */
  const talkMsgs = chatList.filter((c) => !isSystemMsg(c.type));

  const getGroupInfo = (msg, idx) => {
    const list = chatList.filter((c) => !isSystemMsg(c.type));
    const realIdx = list.indexOf(msg);
    const prev = list[realIdx - 1];
    const next = list[realIdx + 1];
    const isFirst = !prev || prev.sender !== msg.sender;
    const isLast = !next || next.sender !== msg.sender;
    const isGap = isFirst; // 발신자 바뀌면 위 여백 추가
    return { isFirst, isLast, isGap };
  };

  return (
    <PageWrapper>
      <Header>
        <HeaderLeft>
          <OnlineDot $on={socketConnected} />
          <RoomTitle>💬 {roomName || "채팅방"}</RoomTitle>
        </HeaderLeft>
        <ExitButton onClick={handleExit}>나가기</ExitButton>
      </Header>

      <MessageArea>
        {chatList.map((chat, idx) => {
          if (isSystemMsg(chat.type)) {
            return (
              <SystemMessage key={idx}>
                <span>{chat.message}</span>
              </SystemMessage>
            );
          }

          const isMine = chat.sender === sender;
          const { isFirst, isLast, isGap } = getGroupInfo(chat, idx);

          return (
            <MessageRow key={idx} $isMine={isMine} $gap={isGap}>
              {/* 상대방 아바타 */}
              {!isMine &&
                (isFirst ? (
                  <Avatar>{getInitial(chat.sender)}</Avatar>
                ) : (
                  <AvatarPlaceholder />
                ))}

              <BubbleCol $isMine={isMine}>
                {/* 상대방 이름: 첫 메시지에만 */}
                {!isMine && isFirst && <SenderName>{chat.sender}</SenderName>}

                <BubbleWrapper $isMine={isMine}>
                  <Bubble $isMine={isMine} $isFirst={isFirst} $isLast={isLast}>
                    {chat.message}
                  </Bubble>
                  {/* 시간: 마지막 메시지 옆에만 */}
                  {isLast && <BubbleTime>{chat.time}</BubbleTime>}
                </BubbleWrapper>
              </BubbleCol>
            </MessageRow>
          );
        })}
        <div ref={messageEndRef} />
      </MessageArea>

      <InputArea>
        <TextInput
          placeholder="메시지를 입력하세요..."
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          onKeyUp={handleKeyUp}
          autoFocus
        />
        <SendButton onClick={sendMessage} disabled={!inputMsg.trim()}>
          ➤
        </SendButton>
      </InputArea>
    </PageWrapper>
  );
};

export default Chatting;
