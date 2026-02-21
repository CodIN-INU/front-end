// src/types/post.ts
export interface Post {
    _id: string; // API 응답의 postId
    title: string;
    content: string;
    postCategory: string;
    createdAt: string;
    anonymous: boolean;
    commentCount: number;
    likeCount: number;
    scrapCount: number;
    postImageUrl: string[]; // 이미지 URL 배열
    userId: string;
    nickname?: string;
    userImageUrl?: string;
    // 추가된 필드
    authorName?: string; // 작성자 이름 (익명일 경우 옵션)
    viewCount?: number; // 조회수
    hits?: number; // 조회수
    // 변경된 필드
    userInfo: {
        like: boolean; // 사용자가 좋아요를 눌렀는지 여부
        scrap: boolean; // 사용자가 북마크했는지 여부
        mine: boolean;
    };
}

