'use client';

import Link from 'next/link';
import type { Post } from '@/types/post';
import { timeAgo } from '@/features/board/utils';

interface PollPostItemProps {
  post: Post;
  onOpenModal: (post: Post) => void;
}

function daysLeft(endDate: string): number {
  const end = new Date(endDate);
  const now = new Date();
  return Math.ceil((end.getTime() - now.getTime()) / (1000 * 3600 * 24));
}

/** 투표 글 전용 카드. 클릭 시 /vote/[id]로 이동 */
export default function PollPostItem({ post }: PollPostItemProps) {
  if (!post.poll) return null;

  const { poll } = post;
  const remaining = daysLeft(poll.pollEndTime);

  return (
    <li className="flex flex-col rounded-lg border border-gray-200 overflow-hidden bg-white shadow-sm">
      <Link
        href={`/vote/${post._id}`}
        className="p-4 flex flex-col gap-2"
      >
        <h3 className="text-sm sm:text-Lm font-medium text-gray-800 line-clamp-1">
          {post.title}
        </h3>
        <p className="text-xs sm:text-Mm text-sub line-clamp-2">{post.content}</p>

        <div className="flex items-center gap-1 text-Mr text-[#404040]">
          <span>{poll.totalParticipants}명 참여</span>
          {poll.multipleChoice && <span className="text-sub">• 복수투표</span>}
        </div>

        {poll.hasUserVoted || poll.pollFinished ? (
          <div className="flex flex-col gap-2 mt-1">
            {poll.pollOptions.map((option, i) => (
              <div key={i} className="flex flex-col gap-0.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-700">{option}</span>
                  <span className="text-sub">
                    {poll.pollVotesCounts[i] ?? 0}명
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-main"
                    style={{
                      width: `${
                        poll.totalParticipants > 0
                          ? Math.floor(
                              ((poll.pollVotesCounts[i] ?? 0) /
                                poll.totalParticipants) *
                                100
                            )
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-main font-medium">투표하기 →</p>
        )}

        <div className="flex justify-between items-center text-xs text-sub mt-2 pt-2 border-t border-gray-100">
          <div className="flex gap-3">
            <span className="flex items-center gap-1">
              <img
                src="/icons/board/viewIcon.svg"
                width={14}
                height={14}
                alt="조회"
              />
              {post.hits ?? 0}
            </span>
            <span className="flex items-center gap-1">
              <img
                src="/icons/board/heartIcon.svg"
                width={14}
                height={14}
                alt="좋아요"
              />
              {post.likeCount ?? 0}
            </span>
            <span className="flex items-center gap-1">
              <img
                src="/icons/board/commentIcon.svg"
                width={14}
                height={14}
                alt="댓글"
              />
              {post.commentCount ?? 0}
            </span>
          </div>
          <span>
            {remaining > 0 ? `${remaining}일 후 종료` : '종료됨'}
          </span>
        </div>
        <div className="flex justify-end text-xs text-sub">
          {post.anonymous ? '익명' : post.nickname} · {timeAgo(post.createdAt)}
        </div>
      </Link>
    </li>
  );
}
