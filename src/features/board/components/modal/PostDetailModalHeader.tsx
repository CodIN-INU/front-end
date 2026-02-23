'use client';

import { PostChatRoom } from '@/features/chat/api/postChatRoom';
import { PostBlockUser } from '@/features/auth/api/postBlockUser';
import { DeletePost } from '@/features/board/api/deletePost';
import { useReportModal } from '@/hooks/useReportModal';
import Header from '@/components/Layout/header/Header';
import MenuItem from '@/components/common/Menu/MenuItem';
import { getBoardNameByCategory } from '@/features/board/utils';
import type { Post } from '@/types/post';

interface PostDetailModalHeaderProps {
  post: Post;
  onClose: () => void;
}

export function PostDetailModalHeader({
  post,
  onClose,
}: PostDetailModalHeaderProps) {
  const {
    openModal: openReportModal,
    getModalComponent: getReportModalComponent,
  } = useReportModal();

  const startChat = async () => {
    try {
      const response = await PostChatRoom(post.title, post.userId, post._id);
      if (response?.data.data.chatRoomId) {
        window.location.href = '/chat';
      } else {
        throw new Error('Chat room ID is missing in the response.');
      }
    } catch (error) {
      console.error('채팅방 생성 실패:', error);
    }
  };

  const blockUser = async () => {
    try {
      if (
        confirm(
          '해당 유저의 게시물이 목록에 노출되지 않으며, 다시 해제하실 수 없습니다.'
        )
      ) {
        await PostBlockUser(post.userId);
        alert('유저를 차단하였습니다');
      }
    } catch (error) {
      console.error('유저 차단 실패:', error);
      alert((error as { response?: { data?: { message?: string } } })?.response?.data?.message);
    }
  };

  const deletePost = async () => {
    try {
      if (confirm('정말로 게시물을 삭제하시겠습니까?')) {
        await DeletePost(post._id);
        alert('게시물이 삭제되었습니다.');
        onClose();
      }
    } catch (error) {
      console.error('게시물 삭제 실패:', error);
      alert((error as { response?: { data?: { message?: string } } })?.response?.data?.message);
    }
  };

  const handleMenuAction = (action: string) => {
    if (action === 'chat') {
      if (confirm('채팅하시겠습니까?')) startChat();
    } else if (action === 'report') {
      openReportModal('USER', post.userId);
    } else if (action === 'block') {
      blockUser();
    } else if (action === 'delete') {
      deletePost();
    }
  };

  return (
    <>
      <Header
        showBack
        backOnClick={onClose}
        title={getBoardNameByCategory(post.postCategory) || ''}
        MenuItems={() => (
          <>
            {post.userInfo.mine ? (
              <MenuItem onClick={() => handleMenuAction('delete')}>
                삭제하기
              </MenuItem>
            ) : (
              <>
                <MenuItem onClick={() => handleMenuAction('chat')}>
                  채팅하기
                </MenuItem>
                <MenuItem onClick={() => handleMenuAction('report')}>
                  신고하기
                </MenuItem>
                <MenuItem onClick={() => handleMenuAction('block')}>
                  차단하기
                </MenuItem>
              </>
            )}
          </>
        )}
      />
      {getReportModalComponent()}
    </>
  );
}
