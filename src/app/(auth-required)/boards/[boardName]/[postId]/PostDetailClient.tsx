'use client';

import { useEffect, useState } from 'react';
import { Post } from '@/interfaces/Post';
import apiClient from '@/api/clients/apiClient'; // 공통 apiClient 불러오기
import CommentSection from '@/components/comment/CommentSection';
import ZoomableImageModal from '@/components/modals/ZoomableImageModal';
import { transStringToChartData } from './utils/textToChartData';

interface PostDetailClientProps {
  postId: string;
}

export default function PostDetailClient({ postId }: PostDetailClientProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 게시물 데이터를 가져오는 함수
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await apiClient.get(`/posts/${postId}`);
        if (response.data.success) {
          setPost(response.data.data.post);
          console.log(response.data.data.post);
        } else {
          setError(response.data.message || '게시물 로드 실패');
        }
      } catch (err) {
        console.error('API 호출 오류:', err);
        setError('API 호출 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  // 좋아요 및 북마크 토글 함수
  const toggleAction = async (action: 'like' | 'bookmark') => {
    try {
      // API 요청 URL 및 데이터 설정
      const url = action === 'like' ? `/likes` : `/scraps/${postId}`;
      const requestData =
        action === 'like' ? { likeType: 'POST', likeTypeId: post?._id } : undefined;

      // API 호출
      const response = await apiClient.post(url, requestData);

      if (response.data.success && post) {
        setPost({
          ...post,
          userInfo: {
            ...post.userInfo,
            [action === 'like' ? 'like' : 'scrap']:
              !post.userInfo[action === 'like' ? 'like' : 'scrap'],
          },
          likeCount:
            action === 'like'
              ? post.userInfo.like
                ? post.likeCount - 1
                : post.likeCount + 1
              : post.likeCount,
          scrapCount:
            action === 'bookmark'
              ? post.userInfo.scrap
                ? post.scrapCount - 1
                : post.scrapCount + 1
              : post.scrapCount,
        });
      } else {
        console.error(
          response.data.message ||
            `${action === 'like' ? '좋아요' : '북마크'} 실패`
        );
      }
    } catch (error) {
      console.error(
        `${action === 'like' ? '좋아요' : '북마크'} 토글 실패`,
        error
      );
    }
  };

  // 로딩 상태 표시
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h2 className="text-xl font-semibold text-gray-700">로딩 중...</h2>
      </div>
    );
  }

  // 에러 상태 표시
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h2 className="text-xl font-semibold text-gray-700">{error}</h2>
      </div>
    );
  }

  // 게시물이 없는 경우 처리
  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h2 className="text-xl font-semibold text-gray-700">
          게시물을 찾을 수 없습니다.
        </h2>
      </div>
    );
  }
  // transStringToChartData(post.content);
  // 렌더링
  return (
    <div className="bg-white min-h-screen flex justify-center">
      {' '}
      {/* 가운데 정렬을 위한 flex 및 justify-center 추가 */}
      <div className="w-full max-w-[500px] px-4">
        {' '}
        {/* max-w-[500px] 및 패딩 추가 */}
        <div className="flex items-center space-x-[12px] mb-[20px]">
          <div className="w-[36px] h-[36px] bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            {post.anonymous ? (
              <img
                src="/images/anonymousUserImage.png" // 정적 경로의 익명 이미지
                alt="Anonymous profile"
                className="w-full h-full object-cover"
              />
            ) : post.userImageUrl ? (
              <img
                src={post.userImageUrl}
                alt="User profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-600 text-sm">No Image</span>
            )}
          </div>

          <div>
            <h4 className="text-sm">
              {post.anonymous ? '익명' : post.nickname || '익명'}
            </h4>
            <p className="text-sr text-sub">{post.createdAt}</p>
          </div>
        </div>
        <div>
          <h3 className="text-Lm mb-[12px]">{post.title}</h3>
          {/* 본문 텍스트 가독성 증가를 위해 white-space 스타일 적용 */}
          <span className="text-Mr mb-[24px] whitespace-pre-wrap">
            {/* {post.content} */}
            {transStringToChartData(post.content)}
          </span>
        </div>
        <div className="mb-[24px]">
          {post.postImageUrl && post.postImageUrl.length > 0 && (
            <ZoomableImageModal images={post.postImageUrl} />
          )}
        </div>
        <div className="flex justify-between items-center text-sr text-sub">
          <div className="flex space-x-[12px]">
            <span className="flex items-center gap-[4.33px]">
              <img
                src={'/icons/board/viewIcon.svg'}
                width={16}
                height={16}
                alt="조회수 아이콘"
              />
              {post.hits || 0}
            </span>
            <button
              onClick={() => toggleAction('like')}
              className="flex items-center gap-[4.33px]"
            >
              <img
                src={
                  post.userInfo.like
                    ? '/icons/board/active_heartIcon.svg'
                    : '/icons/board/heartIcon.svg'
                }
                width={16}
                height={16}
                alt="좋아요 아이콘"
              />
              {post.likeCount || 0}
            </button>
            <span className="flex items-center gap-[4.33px]">
              <img
                src="/icons/board/commentIcon.svg"
                width={16}
                height={16}
                alt="댓글 아이콘"
              />
              {post.commentCount || 0}
            </span>
          </div>

          <button
            onClick={() => toggleAction('bookmark')}
            className="flex items-center text-sub gap-[4.33px]"
          >
            <img
              src={
                post.userInfo.scrap
                  ? '/icons/board/active_BookmarkIcon.svg'
                  : '/icons/board/BookmarkIcon.svg'
              }
              width={16}
              height={16}
              className={`w-[16px] h-[16px] ${
                post.userInfo.scrap ? 'text-yellow-300' : 'text-gray-500'
              }`}
              alt="북마크 아이콘"
            />
            <span>{post.scrapCount}</span>
          </button>
        </div>
        <CommentSection
          postId={postId}
          postName={post.title}
        />
      </div>
    </div>
  );
}
