/**
 * 서버에서 투표 상세 조회 (SSR용)
 * postId로 게시글(투표) 1건 조회
 */

import { serverFetch } from './serverFetch';

export interface VoteDetail {
  post: {
    _id: string;
    title: string;
    content: string;
    likeCount: number;
    scrapCount: number;
    commentCount: number;
    hits: number;
    createdAt: string;
    userInfo: { scrap: boolean; like: boolean; mine?: boolean };
    userImageUrl?: string;
    nickname?: string;
    anonymous: boolean;
    userId?: string;
  };
  poll: {
    pollOptions: string[];
    multipleChoice: boolean;
    pollEndTime: string;
    pollVotesCounts: number[];
    userVoteOptions: string[] | string;
    totalParticipants: number;
    hasUserVoted: boolean;
    pollFinished: boolean;
  };
}

interface VoteDetailApiResponse {
  success?: boolean;
  data?: { post?: VoteDetail['post']; poll?: VoteDetail['poll'] };
  post?: VoteDetail['post'];
  poll?: VoteDetail['poll'];
}

export async function getVoteById(
  postId: string | string[]
): Promise<VoteDetail | null> {
  const id = Array.isArray(postId) ? postId[0] : String(postId ?? '');
  if (!id) return null;
  try {
    const res = await serverFetch<VoteDetailApiResponse>(`/posts/${id}`);
    const post = res.data?.post ?? res.post;
    const poll = res.data?.poll ?? res.poll;
    if (post && poll) {
      return { post, poll };
    }
    return null;
  } catch {
    return null;
  }
}
