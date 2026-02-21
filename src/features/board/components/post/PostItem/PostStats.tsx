"use client";

import React from "react";
import { Post } from "@/types/post";
import { timeAgo } from '@/features/board/utils';
interface PostStatsProps {
    post: Post;
}

const PostStats: React.FC<PostStatsProps> = ({ post }) => {
    return (
        <div className="flex flex-col    justify-between flex-wrap items-center text-xs mt-[8px]">
            {/* 아이콘과 통계 데이터 */}
            <div className="flex  w-full space-x-[6px]">
                <span className="flex items-center gap-[4.33px]">
                    <img src="/icons/board/viewIcon.svg" width={16} height={16} />
                    {post.hits || 0}
                </span>
                <span className="flex items-center gap-[4.33px]">
                    <img src="/icons/board/heartIcon.svg" width={16} height={16} />
                    {post.likeCount || 0}
                </span>
                <span className="flex items-center gap-[4.33px]">
                    <img src="/icons/board/commentIcon.svg" width={16} height={16} />
                    {post.commentCount || 0}
                </span>
            </div>

            {/* 작성자 정보 및 시간 */}
            <div className="flex w-full justify-between items-center text-sub text-xs mt-[8px]">
                <span>{post.anonymous ? "익명" : post.nickname}</span>
                <span>{timeAgo(post.createdAt)}</span>
            </div>

        </div>
    );
};

export default PostStats;
