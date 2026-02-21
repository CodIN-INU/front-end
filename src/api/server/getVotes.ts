/**
 * 서버에서 투표 목록 조회 (SSR용)
 * postCategory=POLL 사용
 */

import { serverFetch } from './serverFetch';

export interface VoteListItem {
  post: {
    _id: string;
    title: string;
    content: string;
    likeCount: number;
    scrapCount: number;
    commentCount: number;
    hits: number;
    createdAt: string;
    userInfo: { scrap: boolean; like: boolean };
    anonymous: boolean;
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

interface VotesApiResponse {
  success?: boolean;
  data?: {
    contents?: { post: VoteListItem['post']; poll: VoteListItem['poll'] }[];
    nextPage?: number;
  };
  contents?: VoteListItem[];
  nextPage?: number;
}

export interface GetVotesResult {
  votes: VoteListItem[];
  nextPage: number;
}

export async function getVotes(page: number = 0): Promise<GetVotesResult> {
  try {
    const res = await serverFetch<VotesApiResponse>(
      `/posts/category?postCategory=POLL&page=${page}`
    );
    const contents = res.data?.contents ?? res.contents ?? [];
    const nextPage = res.data?.nextPage ?? res.nextPage ?? -1;
    const votes: VoteListItem[] = Array.isArray(contents)
      ? contents.map((item: any) => ({ post: item.post, poll: item.poll }))
      : [];
    return { votes, nextPage };
  } catch {
    return { votes: [], nextPage: -1 };
  }
}
