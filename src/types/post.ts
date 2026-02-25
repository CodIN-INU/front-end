// API 응답의 content 한 건: { post, poll }
// 리스트/상세에서 쓰는 평탄화 타입: Post (post 필드 + poll)

export interface PostContent {
  _id: string;
  title: string;
  content: string;
  postCategory: string;
  createdAt: string;
  anonymous: boolean;
  commentCount: number;
  likeCount: number;
  scrapCount: number;
  postImageUrl: string[];
  userId: string;
  nickname?: string;
  userImageUrl?: string;
  authorName?: string;
  viewCount?: number;
  hits?: number;
  userInfo: {
    like: boolean;
    scrap: boolean;
    mine: boolean;
  };
}

export interface Poll {
  pollOptions: string[];
  pollEndTime: string;
  multipleChoice: boolean;
  pollVotesCounts: number[];
  userVotesOptions: number[];
  totalParticipants: number;
  hasUserVoted: boolean;
  pollFinished: boolean;
}

/** API가 반환하는 목록/상세 한 건 (nested) */
export interface PostApiItem {
  post: PostContent;
  poll: Poll | null;
}

/**
 * 리스트·상세에서 사용하는 평탄화 타입.
 * post 필드를 최상위로 펼치고 poll만 붙인 형태.
 * 컴포넌트에서는 post.title, post.poll 등으로 사용.
 */
export type Post = PostContent & { poll: Poll | null };
