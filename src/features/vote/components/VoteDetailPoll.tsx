'use client';

import { transStringToChartData } from '@/features/board/utils';
import type { VoteDetail } from '@/server';

function calculateDaysLeft(endDate: string) {
  const end = new Date(endDate);
  const now = new Date();
  const timeDiff = end.getTime() - now.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

interface VoteDetailPollProps {
  vote: VoteDetail;
  selectedOptions: Record<string, number[]>;
  onCheckboxChange: (
    postId: string,
    index: number,
    multipleChoice: boolean
  ) => void;
  onVoteSubmit: (e: React.MouseEvent<HTMLButtonElement>, postId: string) => void;
}

export function VoteDetailPoll({
  vote,
  selectedOptions,
  onCheckboxChange,
  onVoteSubmit,
}: VoteDetailPollProps) {
  const postId = vote.post._id;
  const daysLeft = calculateDaysLeft(vote.poll.pollEndTime);
  const canVote = daysLeft > 0 && !vote.poll.hasUserVoted;

  return (
    <div id="voteIndex" className="flex flex-col gap-[4px]">
      <h3 id="voteTitle" className="text-Lm mb-[12px]">
        {vote.post.title}
      </h3>

      <p
        id="voteContent"
        className="text-Mr mb-[24px] whitespace-pre-wrap"
      >
        {transStringToChartData(vote.post.content)}
      </p>

      <div
        id="voteContainer"
        className="mt-[8px] rounded-[15px] border-[1px] flex flex-col px-[24px] py-[16px]"
      >
        {canVote ? (
          <>
            <ul id="ulCont">
              {vote.poll.pollOptions.map((option, i) => (
                <li
                  key={i}
                  id="pollCont"
                  className="flex gap-[16px] mb-4 items-center justify-start"
                >
                  <input
                    type="checkBox"
                    className="hidden peer"
                    id={`pollOptionCheckBox-${postId}-${i}`}
                    onChange={() =>
                      onCheckboxChange(postId, i, vote.poll.multipleChoice)
                    }
                    checked={selectedOptions[postId]?.includes(i) || false}
                    disabled={vote.poll.pollFinished}
                  />
                  <label
                    htmlFor={`pollOptionCheckBox-${postId}-${i}`}
                    className="w-[17px] h-[17px] rounded-full border border-gray-400 flex items-center justify-center cursor-pointer transition-all duration-300 peer-checked:bg-[#0D99FF] peer-checked:border-[#0D99FF] relative"
                  >
                    <img
                      src="/icons/board/check.svg"
                      className="w-[9px] text-white text-[10px] transition-opacity duration-300"
                      alt=""
                    />
                  </label>
                  <p id="optionText1" className="text-Mr">
                    {option}
                  </p>
                </li>
              ))}
            </ul>
            <button
              id="voteBtn"
              type="button"
              className={
                selectedOptions[postId]?.length !== 0
                  ? 'w-full rounded-[5px] bg-[#0D99FF] py-[8px] text-Mm text-white'
                  : 'w-full rounded-[5px] bg-sub py-[8px] text-Mm text-sub'
              }
              disabled={selectedOptions[postId]?.length === 0}
              onClick={e => onVoteSubmit(e, postId)}
            >
              투표하기
            </button>
          </>
        ) : (
          <ul id="conT">
            {vote.poll.pollOptions.map((option, i) => (
              <li key={i} id="pollOpCont" className="list-none flex-col">
                <div id="cont1" className="flex justify-between">
                  <p id="optionText" className="text-Mr">
                    {option}
                  </p>
                  <div id="optionCount" className="text-sr text-sub">
                    {vote.poll.pollVotesCounts[i]}명
                  </div>
                </div>

                <div
                  id="statusbar"
                  className="w-full bg-gray h-[4px] rounded-full mb-[12px] mt-[8px]"
                >
                  <div
                    id="pollOptionBar"
                    className="bg-main h-full rounded-full"
                    style={{
                      width: `${Math.floor(
                        (vote.poll.pollVotesCounts[i] /
                          vote.poll.totalParticipants) *
                          100
                      )}%`,
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}

        <div
          id="ect"
          className="text-Mr text-[#404040] flex gap-[4px] mt-[8px]"
        >
          <div id="count">{vote.poll.totalParticipants}명 참여</div>
          {vote.poll.multipleChoice && <div id="ismulti"> • 복수투표</div>}
        </div>
      </div>

      <div
        id="pollEndTime"
        className="text-sr text-sub ml-[4px] mb-[12px] mt-[6px]"
      >
        {daysLeft > 0 ? <>{daysLeft}일 후 종료</> : '종료됨'}
      </div>

      <div id="divider" />
    </div>
  );
}
