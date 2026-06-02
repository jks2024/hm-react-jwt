import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import AxiosApi from "../api/AxiosApi";

// ── 애니메이션 ────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ── Styled Components ─────────────────────────────────
const Wrapper = styled.div`
  min-height: 100vh;
  background: #f5f7fa;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 48px 20px;
`;

const Card = styled.div`
  width: 100%;
  max-width: 720px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  padding: 48px;
  animation: ${fadeUp} 0.35s ease both;
`;

const PageTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 32px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f2f5;

  /* 왼쪽 포인트 라인 */
  display: flex;
  align-items: center;
  gap: 10px;

  &::before {
    content: "";
    display: inline-block;
    width: 4px;
    height: 22px;
    background: #1a73e8;
    border-radius: 4px;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #555;
  letter-spacing: 0.3px;
`;

const TitleInput = styled.input`
  padding: 14px 16px;
  border: 1.5px solid #e0e4ea;
  border-radius: 8px;
  font-size: 15px;
  color: #1a1a2e;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  outline: none;

  &::placeholder {
    color: #bbb;
  }

  &:focus {
    border-color: #1a73e8;
    box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.12);
  }
`;

const ContentTextarea = styled.textarea`
  padding: 14px 16px;
  border: 1.5px solid #e0e4ea;
  border-radius: 8px;
  font-size: 15px;
  color: #1a1a2e;
  resize: vertical;
  min-height: 280px;
  line-height: 1.7;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  outline: none;
  font-family: inherit;

  &::placeholder {
    color: #bbb;
  }

  &:focus {
    border-color: #1a73e8;
    box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.12);
  }
`;

const CharCount = styled.span`
  font-size: 12px;
  color: ${(p) => (p.$over ? "#e53935" : "#aaa")};
  text-align: right;
  margin-top: -4px;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
`;

const CancelButton = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  border: 1.5px solid #e0e4ea;
  background: #fff;
  color: #555;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition:
    background 0.15s,
    border-color 0.15s;

  &:hover {
    background: #f5f7fa;
    border-color: #c8cdd5;
  }
`;

const SubmitButton = styled.button`
  padding: 12px 32px;
  border-radius: 8px;
  border: none;
  background: #1a73e8;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.15s,
    transform 0.1s;

  &:hover {
    background: #1557b0;
  }
  &:active {
    transform: scale(0.98);
  }
  &:disabled {
    background: #b0c8f0;
    cursor: not-allowed;
  }
`;

// ── 컴포넌트 ──────────────────────────────────────────
const MAX_CONTENT = 2000;

const PostWritePage = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", content: "" });

  useEffect(() => {
    if (isEdit) {
      AxiosApi.getPost(id).then((res) => {
        const { title, content } = res.data.data;
        setForm({ title, content });
      });
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await AxiosApi.updatePost(id, form);
        navigate(`/posts/${id}`);
      } else {
        const res = await AxiosApi.createPost(form);
        navigate(`/posts/${res.data.data.id}`);
      }
    } catch (e) {
      alert("저장에 실패했습니다.");
    }
  };

  const isOver = form.content.length > MAX_CONTENT;

  return (
    <Wrapper>
      <Card>
        <PageTitle>{isEdit ? "게시글 수정" : "게시글 작성"}</PageTitle>

        <form onSubmit={handleSubmit}>
          <Field>
            <Label>제목</Label>
            <TitleInput
              type="text"
              placeholder="제목을 입력하세요"
              value={form.title}
              onChange={(e) =>
                setForm((p) => ({ ...p, title: e.target.value }))
              }
              required
            />
          </Field>

          <Field>
            <Label>내용</Label>
            <ContentTextarea
              placeholder="내용을 입력하세요"
              value={form.content}
              onChange={(e) =>
                setForm((p) => ({ ...p, content: e.target.value }))
              }
              required
            />
            {/* 글자 수 카운터 */}
            <CharCount $over={isOver}>
              {form.content.length} / {MAX_CONTENT}
            </CharCount>
          </Field>

          <ButtonRow>
            <CancelButton type="button" onClick={() => navigate(-1)}>
              취소
            </CancelButton>
            <SubmitButton type="submit" disabled={isOver}>
              {isEdit ? "수정 완료" : "작성 완료"}
            </SubmitButton>
          </ButtonRow>
        </form>
      </Card>
    </Wrapper>
  );
};

export default PostWritePage;
