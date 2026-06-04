import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import BoardLayout from "./pages/BoardLayout";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import PostListPage from "./pages/PostListPage";
import PostDetailPage from "./pages/PostDetailPage";
import PostWritePage from "./pages/PostWritePage";
import Chat from "./pages/Chat";
import ChatRoomCreate from "./pages/ChatRoomCreate";
import Chatting from "./pages/Chatting";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route element={<BoardLayout />}>
          <Route path="/posts" element={<PostListPage />} />
          <Route path="/posts/:id" element={<PostDetailPage />} />
          <Route path="posts/new" element={<PostWritePage />} />
          <Route path="posts/:id/edit" element={<PostWritePage />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="chat-create" element={<ChatRoomCreate />} />
          <Route path="chatting/:roomId" element={<Chatting />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
