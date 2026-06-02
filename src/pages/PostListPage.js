import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import AxiosApi from "../api/AxiosApi";

const Wrapper = styled.div``;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;
const WriteBtn = styled.button`
  padding: 8px 20px;
  background: #1a73e8;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;
const Th = styled.th`
  background: #f1f3f4;
  padding: 12px;
  text-align: left;
  border-bottom: 2px solid #ddd;
`;
const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #eee;
`;
const TrClickable = styled.tr`
  cursor: pointer;
  &:hover {
    background: #f8f9fa;
  }
`;
const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
`;
const PageBtn = styled.button`
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: ${(p) => (p.$active ? "#1a73e8" : "#fff")};
  color: ${(p) => (p.$active ? "#fff" : "#333")};
  cursor: pointer;
`;

const PostListPage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    currentPage: 0,
    totalPages: 0,
  });

  const fetchPosts = async (page = 0) => {
    try {
      const res = await AxiosApi.getPosts(page);
      // 백엔드: ApiResponse<Page<PostResDto>>
      // res.data.data = Page 객체 { content:[], totalPages, number }
      const pageData = res.data.data;
      setPosts(pageData.content);
      setPageInfo({
        currentPage: pageData.number,
        totalPages: pageData.totalPages,
      });
    } catch (e) {
      alert("게시글 목록을 불러오지 못했습니다.");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <Wrapper>
      <Header>
        <h2>게시글 목록</h2>
        <WriteBtn onClick={() => navigate("/posts/new")}>작성하기</WriteBtn>
      </Header>
      <Table>
        <thead>
          <tr>
            <Th>No</Th>
            <Th>제목</Th>
            <Th>작성자</Th>
            <Th>작성일</Th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <TrClickable
              key={post.id}
              onClick={() => navigate(`/posts/${post.id}`)}
            >
              <Td>{post.id}</Td>
              <Td>{post.title}</Td>
              <Td>{post.author}</Td>
              <Td>{post.createdAt?.slice(0, 10)}</Td>
            </TrClickable>
          ))}
        </tbody>
      </Table>
      {/* 페이지네이션 */}
      <Pagination>
        {Array.from({ length: pageInfo.totalPages }, (_, i) => (
          <PageBtn
            key={i}
            $active={i === pageInfo.currentPage}
            onClick={() => fetchPosts(i)}
          >
            {i + 1}
          </PageBtn>
        ))}
      </Pagination>
    </Wrapper>
  );
};

export default PostListPage;
