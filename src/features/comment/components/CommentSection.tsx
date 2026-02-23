"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  FaHeart,
  FaCheckCircle,
  FaPaperPlane,
  FaTimes, // 닫기(X) 아이콘
} from "react-icons/fa";

// chat API 불러오기
import { startChat } from '@/features/chat/api/postChatRoom';
import { PostLike } from "@/shared/api/postLike";

interface Comment {
  _id: string;
  userId: string;
  nickname: string;
  anonymous: boolean;
  content: string | null;
  likeCount: number;
  isLiked?: boolean;
  userInfo: { like: boolean };
  deleted: boolean;
  replies: Comment[];
  createdAt: string;
  updatedAt?: string;
  postName: string;
  postId: string;
}

interface CommentSectionProps {
  postId: string;
  postName?: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  dataList?: Comment[];
}

const timeAgo = (timestamp: string): string => {
  const now = new Date();
  const createdAt = new Date(timestamp);
  const diffInSeconds = Math.floor(
      (now.getTime() - createdAt.getTime()) / 1000
  );

  if (diffInSeconds < 60) {
    return "방금 전";
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)}분 전`;
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)}시간 전`;
  } else {
    return `${Math.floor(diffInSeconds / 86400)}일 전`;
  }
};

const CommentInput = ({
                        anonymous,
                        setAnonymous,
                        value,
                        onChange,
                        onSubmit,
                        submitLoading,
                        placeholder,
                        replyTargetNickname,
                      }: {
  anonymous: boolean;
  setAnonymous: (value: (prev: boolean) => boolean) => void;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  submitLoading: boolean;
  placeholder: string;
  replyTargetNickname?: string | null;
}) => (
    <div className="flex items-center justify-start rounded-[34px] bg-[#FCFCFC] py-[8px]">
      {/* 익명 토글 버튼 */}
      <button
          onClick={() => setAnonymous((prev) => !prev)}
          className="flex items-center space-x-1 focus:outline-none mr-2"
      >
        <FaCheckCircle
            className={`h-[16px] w-[16px] ${
                anonymous ? "text-[#0D99FF]" : "text-sub"
            }`}
        />
        <span className={`text-[10px] w-6 ${anonymous ? "text-active" : "text-sub"}`}>
        익명
        </span>
      </button>

      {/* 입력창 */}
      <div className="w-full flex">
        {replyTargetNickname ? replyTargetNickname.length > 3 ? 
              (<span className="text-sub whitespace-nowrap text-sr flex items-start mt-[1px]">
                @{replyTargetNickname.slice(0,3)+".."}
              </span>)
              :
              (<span className="text-sub whitespace-nowrap text-sr flex items-start mt-[1px]">
                @{replyTargetNickname}
              </span>)
          : null
        }
        <input
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full ml-[8px] flex-1 bg-transparent text-Mr outline-none placeholder-[#808080]"
        />
      </div>

      {/* 전송 버튼 */}
      <button
          onClick={onSubmit}
          className="flex items-center justify-center mr-[8px]"
          disabled={submitLoading}
      >
        <img src="/icons/board/Send.svg" className="min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px]"/>
      </button>
    </div>
);

export default function CommentSection({
                                         postId,
                                         postName,
                                       }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");

  // 수정 모드
  const [editCommentId, setEditCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>("");

  // 현재 로그인된 사용자 ID
  const [currentUserId, setCurrentUserId] = useState<string>("");

  // 대댓글 작성
  const [newReply, setNewReply] = useState<string>("");
  const [replyTargetId, setReplyTargetId] = useState<string | null>(null);
  const [replyTargetNickname, setreplyTargetNickname] = useState<string | null>(null);

  // 메뉴 관련
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const menuRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // 로딩, 에러, 성공 메시지
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 익명 댓글
  const [anonymous, setAnonymous] = useState<boolean>(true);

  // 삭제 모달
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetDepth, setDeleteTargetDepth] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // (추가) 댓글 입력창 열림/닫힘 상태
  const [showCommentInput, setShowCommentInput] = useState<boolean>(true);


  //수정된 좋아요 토글 함수
  const [isCommentLiked, setIsCommentLiked] = useState<{
    [key: string]: boolean;
  }>({});
  const [repLikeCount, setRepLikecount] = useState<{ [key: string]: number }>(
      {}
  );

  const handleLike = async (
      e: React.MouseEvent<HTMLButtonElement>,
      likeType: string,
      likeTypeId: string
  ) => {
    e.preventDefault();

    // 댓글 좋아요 상태 반전
    const newLikeStatus = !isCommentLiked[likeTypeId];

    try {
      await PostLike(likeType, likeTypeId);
      // 상태 변경
      setIsCommentLiked((prev) => {
        const updated = { ...prev, [likeTypeId]: newLikeStatus };
        console.log("상태 변경", updated); // 상태 변경 후 로그 출력
        return updated;
      });

      setRepLikecount((prev) => {
        const updatedLikeCount = prev[likeTypeId]
            ? prev[likeTypeId] + (newLikeStatus ? 1 : -1)
            : newLikeStatus
                ? 1
                : 0; // likeCount 계산
        const updated = { ...prev, [likeTypeId]: updatedLikeCount };
        console.log("likeCount 변경됨", updated); // 상태 변경 후 로그 출력
        return updated;
      });

      // 댓글 목록 업데이트
      setComments((prevComments) => {
        return prevComments.map((Comment: Comment) => {
          if (Comment._id === likeTypeId) {
            // 댓글 좋아요 상태 반영
            console.log("좋아요 수 변경됨", Comment.likeCount);
            return {
              ...Comment,
              likeCount: newLikeStatus
                  ? Comment.likeCount + 1
                  : Comment.likeCount - 1,
              userInfo: { like: !Comment.userInfo.like },
            };
          }

          return Comment;
        });
      });
    } catch (error) {
      console.error("댓글 좋아요 처리 실패", error);
    }
  };

  // 댓글 목록 불러오기
  const fetchComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get<ApiResponse>(
          `https://codin.inu.ac.kr/api/comments/post/${postId}`
      );

      if (data.success) {
        const validComments = (data.dataList || []).map((comment) => ({
          ...comment,
          content: comment.content || "내용이 없습니다.",
          postId: postId,
          postName: postName
        }));
        console.log("응답", data);
        setComments(validComments);
        const initialCommentLikes = data.dataList.reduce(
            (acc: { [key: string]: boolean }, comment: Comment) => {
              acc[comment._id] = comment.userInfo.like;
              

              comment.replies?.forEach((subComment) => {
                acc[`${subComment._id}`] = subComment.userInfo.like;
              });
              return acc;
            },
            {}
        );
        setIsCommentLiked(initialCommentLikes);
        console.log(initialCommentLikes);

        const initialLikesCount = data.dataList.reduce(
            (acc: { [key: string]: number }, comment: Comment) => {
              acc[comment._id] = comment.likeCount;

              comment.replies?.forEach((subComment) => {
                acc[`${subComment._id}`] = subComment.likeCount;
              });
              return acc;
            },
            {}
        );
        setRepLikecount(initialLikesCount);
        console.log(initialLikesCount);
      } else {
        throw new Error(data.message || "댓글 로드 실패");
      }
    } catch (err: any) {
      setError(err.message || "API 호출 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 현재 사용자 정보 불러오기
  const fetchCurrentUser = async () => {
    try {
      const { data } = await axios.get("https://codin.inu.ac.kr/api/users", {});

      if (data.success) {
        setCurrentUserId(data.data._id);
      } else {
        throw new Error("사용자 정보를 가져오지 못했습니다.");
      }
    } catch (err: any) {
      console.error("사용자 정보 호출 오류:", err.message);
    }
  };

  // 댓글 작성
  const submitComment = async (content: string) => {
    try {
      setSubmitLoading(true);
      const { data } = await axios.post(
          `https://codin.inu.ac.kr/api/comments/${postId}`,
          { content, anonymous }
      );

      if (data.success) {
        fetchComments();
        setNewComment("");
        setSuccessMessage(data.message || "댓글이 추가되었습니다.");
        setTimeout(() => setSuccessMessage(null), 2000);
      } else {
        throw new Error(data.message || "댓글 작성 실패");
      }
    } catch (err: any) {
      setError(err.message || "API 호출 중 오류가 발생했습니다.");
    } finally {
      setSubmitLoading(false);
    }
  };

  // 댓글 수정
  const updateComment = async (commentId: string, content: string) => {
    try {
      const { data } = await axios.patch(
          `https://codin.inu.ac.kr/api/comments/${commentId}`,
          { content }
      );

      if (data.success) {
        fetchComments();
        setEditCommentId(null);
        setEditContent("");
        setSuccessMessage("댓글이 수정되었습니다.");
        setTimeout(() => setSuccessMessage(null), 2000);
      } else {
        throw new Error(data.message || "댓글 수정 실패");
      }
    } catch (err: any) {
      setError(err.message || "API 호출 중 오류가 발생했습니다.");
    }
  };

  // 댓글 삭제
  const deleteComment = async (commentId: string) => {
    try {
      const { data } = await axios.delete(
          `https://codin.inu.ac.kr/api/comments/${commentId}`
      );

      if (data.success) {
        fetchComments();
        setSuccessMessage("댓글이 삭제되었습니다.");
        setTimeout(() => setSuccessMessage(null), 2000);
      } else {
        throw new Error(data.message || "댓글 삭제 실패");
      }
    } catch (err: any) {
      setError(err.message || "API 호출 중 오류가 발생했습니다.");
    }
  };

  //대댓글 삭제
  const deleteReply = async (commentId: string) => {
    try {
      const { data } = await axios.delete(
          `https://codin.inu.ac.kr/api/replies/${commentId}`
      );

      if (data.success) {
        fetchComments();
        setSuccessMessage("댓글이 삭제되었습니다.");
        setTimeout(() => setSuccessMessage(null), 2000);
      } else {
        throw new Error(data.message || "대댓글 삭제 실패");
      }
    } catch (err: any) {
      setError(err.message || "API 호출 중 오류가 발생했습니다.");
    }
  };

  // 대댓글 작성
  const submitReply = async (content: string, commentId: string) => {
    try {
      setSubmitLoading(true);
      const { data } = await axios.post(
          `https://codin.inu.ac.kr/api/replies/${commentId}`,
          { content, anonymous }
      );

      if (data.success) {
        fetchComments();
        setNewReply("");
        setReplyTargetId(null);
        setSuccessMessage("대댓글이 추가되었습니다.");
        setTimeout(() => setSuccessMessage(null), 2000);
      } else {
        throw new Error(data.message || "대댓글 작성 실패");
      }
    } catch (err: any) {
      setError( `${err.message} , ${commentId}` || "API 호출 중 오류가 발생했습니다.");
    } finally {
      setSubmitLoading(false);
    }
  };

  // 마운트 시 사용자, 댓글 데이터 가져오기
  useEffect(() => {
    fetchCurrentUser();
    fetchComments();
  }, [postId]);

  // 메뉴 바깥 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      for (const [id, ref] of menuRefs.current.entries()) {
        if (ref && !ref.contains(event.target as Node)) {
          setMenuOpenId((prevId) => (prevId === id ? null : prevId));
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 메뉴 열고/닫기
  const toggleMenu = (commentId: string) => {
    setMenuOpenId((prevId) => (prevId === commentId ? null : commentId));
  };

  // 삭제 모달 렌더링
  const renderDeleteModal = () =>
      isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-80">
              <p className="text-gray-800 text-lg font-semibold mb-4">
                댓글을 삭제하시겠습니까?
              </p>
              <div className="flex justify-end space-x-4">
                <button
                    className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors duration-200"
                    onClick={() => setIsModalOpen(false)}
                >
                  취소
                </button>
                <button
                    className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
                    onClick={() => {
                      if (deleteTargetId) {
                        // 댓글의 depth가 0이면 본문 댓글, 1 이상이면 대댓글
                        if (deleteTargetDepth  > 0) {
                          deleteReply(deleteTargetId); // 대댓글 삭제
                        } else {
                          deleteComment(deleteTargetId); // 본문 댓글 삭제
                        }
                      }
                      setIsModalOpen(false);
                    }}
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
      );

  //댓글(대댓글) 재귀 렌더링
  const renderComments = (
      commentList: Comment[],
      depth = 0,
      status: string,
      idFromParent: string | null,
  ) => (
      <ul className="w-full">
        {commentList.map((comment) => (
            <div className="flex w-full flex-row gap-[8px] pt-[24px]">
              <img
                  src={
                    comment.anonymous
                        ? "/icons/chat/DeafultProfile.png"
                        : "/icons/chat/DeafultProfile.png"
                  }
                  width={36}
                  height={36}
                  className="w-[36px] h-[36px]"
              />
              <li className="w-full" key={comment._id}>
                {/* 상단 영역 */}
                <div className="flex justify-between items-start">
                  <div className="pr-2 w-full">
                    {/* 닉네임 & 작성 시간 */}
                    <div className="flex items-center mb-1">
                  <span className="text-sr font-medium">
                    {comment.nickname}
                  </span>
                      <span className="text-sr text-[#bfbfbf] ml-[8px]">
                    {timeAgo(comment.createdAt)}
                  </span>
                    </div>

                    {/* 삭제된 댓글인지, 수정 모드인지, 일반 상태인지 분기 */}
                    {comment.deleted ? (
                        <p className="text-gray-400 italic text-sm">
                          (삭제된 댓글입니다)
                        </p>
                    ) : editCommentId === comment._id ? (
                        // 수정 모드
                        <div className="p-4 bg-white border border-gray-200 rounded shadow-sm mt-2 relative">
                          <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-sub">
                        댓글 수정
                      </span>
                            <button
                                className="text-gray-400 hover:text-black"
                                onClick={() => {
                                  setEditCommentId(null);
                                  setEditContent("");
                                }}
                            >
                              <FaTimes className="h-4 w-4" />
                            </button>
                          </div>
                          <CommentInput
                              anonymous={anonymous}
                              setAnonymous={setAnonymous}
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              onSubmit={() => updateComment(comment._id, editContent)}
                              submitLoading={submitLoading}
                              placeholder="댓글을 수정하세요"
                          />
                        </div>
                    ) : (
                        // 평소 상태
                        <p className="text-gray-700 text-sm mb-2">
                          {comment.content}
                        </p>
                    )}

                    {/* 좋아요 수 */}
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <button
                          onClick={
                            //수정된 좋아요 토글
                            (e) => handleLike(e, status, comment._id)
                          }
                      >
                        <img
                            src={
                              isCommentLiked[comment._id]
                                  ? "/icons/board/active_heartIcon.svg"
                                  : "/icons/board/heartIcon.svg"
                            }
                            width={16}
                            height={16}
                            className="mr-[4px]"
                        />
                      </button>
                      {repLikeCount[comment._id]}
                    </div>
                  </div>

                  {/* 메뉴 버튼: 삭제된 댓글이라면 표시 X */}
                  {!comment.deleted && (
                      <div
                          className="relative"
                          ref={(el) => {
                            if (el) menuRefs.current.set(comment._id, el);
                          }}
                      >
                        <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleMenu(comment._id);
                            }}
                            className="text-gray-400 hover:text-gray-600"
                        >
                          ⋮
                        </button>
                        {menuOpenId === comment._id && (
                            <div
                                className="absolute right-0 mt-2 bg-white border border-gray-200 rounded shadow-lg w-32 z-10"
                                onClick={(e) => e.stopPropagation()}
                            >
                              {/* 답글 달기 */}
                              <button
                                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                                  onClick={() => {
                                    setreplyTargetNickname(status === "REPLY" ? comment.nickname : null);
                                    setReplyTargetId(comment._id );
                                    setMenuOpenId(null);
                                  }}
                              >
                                답글 달기
                              </button>

                              {/* 1) 내 댓글이라면 수정/삭제 */}
                              {currentUserId === comment.userId ? (
                                  <>
                                    <button
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                                        onClick={() => {
                                          setEditCommentId(comment._id);
                                          setEditContent(comment.content || "");
                                          setMenuOpenId(null);
                                        }}
                                    >
                                      수정하기
                                    </button>
                                    <button
                                        className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 text-sm"
                                        onClick={() => {
                                          setIsModalOpen(true);
                                          setDeleteTargetId(comment._id);
                                          setDeleteTargetDepth(depth);
                                          setMenuOpenId(null);
                                        }}
                                    >
                                      삭제하기
                                    </button>
                                  </>
                              ) : (
                                  /* 2) 내 댓글이 아니라면 채팅하기 버튼 */
                                  <button
                                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                                      onClick={async () => {
                                        try {
                                          // 필요한 제목(title)은 원하는 대로 지정 가능
                                          await startChat(postName, comment.userId, postId);
                                          setMenuOpenId(null);
                                          console.log("채팅전달값:",postName, comment.userId, postId);
                                        } catch (error) {
                                          console.error("채팅 오류:", error);
                                        }
                                      }}
                                  >
                                    채팅하기
                                  </button>
                              )}
                            </div>
                        )}
                      </div>
                  )}
                </div>

                {/* 대댓글 작성 인풋창(현재 댓글에 답글 달기 클릭 시) */}
                {replyTargetId === comment._id && (
                    <div className="w-full mt-3 bg-white">
                      {/* 상단 헤더: "답글 입력" & 닫기 버튼(X) */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sr text-[#808080]">답글 입력</span>
                        <button
                            className="text-gray-400 hover:text-gray-600"
                            onClick={() => {
                              setReplyTargetId(null);
                              setNewReply("");
                            }}
                        >
                          <p className="text-sr text-active">취소하기</p>
                        </button>
                      </div>
                      <CommentInput
                          anonymous={anonymous}
                          setAnonymous={setAnonymous}
                          value={newReply}
                          onChange={(e) => setNewReply(e.target.value)}
                          onSubmit={() => replyTargetNickname ? submitReply("@"+replyTargetNickname+" "+newReply, idFromParent) : submitReply(newReply, comment._id)}
                          submitLoading={submitLoading}
                          replyTargetNickname={replyTargetNickname}
                          placeholder={replyTargetNickname !== null ? "에게 답글 .. " : "답글을 입력하세요"}
                      />
                    </div>
                )}

                {/* 재귀적으로 대댓글 렌더링 */}
                {comment.replies.length > 0 &&
                    renderComments(comment.replies, depth + 1, "REPLY", comment._id)}
              </li>
            </div>
        ))}
      </ul>
  );

  return (
      <div className="relative w-full max-w-[500px] mx-auto" id="scrollbar-hidden"> {/* max-w-[500px] 및 mx-auto 추가 */}
        <div className="bg-[#FCFCFC] h-[8px] w-full mt-[24px]" id="scrollbar-hidden" />

        {/* 에러 메시지 */}
        {error && <p className="text-red-500 mb-2">{error}</p>}

        {/* 댓글 목록 */}
        {renderComments(comments, 0, "COMMENT", null)}

        {/* 삭제 모달 */}
        {renderDeleteModal()}

        {/* (추가) 댓글 작성 인풋창: showCommentInput이 true일 때만 보임 */}
        {showCommentInput && (
            <div
                className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[528px] bg-white pb-[35px] pt-[10px] px-[20px]"
                style={{
                  boxShadow: "0 -2px 4px rgba(0, 0, 0, 0.1)", // 얇고 가벼운 그림자
                  height: "82px", // 컴팩트한 높이
                }}
            >
              <CommentInput
                  anonymous={anonymous}
                  setAnonymous={setAnonymous}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onSubmit={() => submitComment(newComment)}
                  submitLoading={submitLoading}
                  placeholder="댓글을 입력하세요"
              />
            </div>
        )}
      </div>
  );
}