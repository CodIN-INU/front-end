import { PostLike } from '@/api/like/postLike';
import { Dispatch, SetStateAction, useState } from "react";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";

type ReviewCommentType = {
  starRating: number;
  content: string;
  likes: number;
  isLiked: boolean; // 추가: 좋아요 여부
  semester: string;
  _id: string;
  refetch: Dispatch<SetStateAction<boolean>>;
};

const ReviewComment = ({
  starRating = 0,
  content = "Blank",
  likes,
  isLiked,
  semester = "test",
  _id,
  refetch,
}: ReviewCommentType) => {
  const [heartClick, setHeartClick] = useState(isLiked);

  const handleHeartClick = () => {
    setHeartClick(!heartClick);
    // API 추가(하트 상태 변경)
    PostLike("REVIEW", _id);
    refetch(true);
  };
  return (
    <div className="border-t">
      <div className="mt-4">
        <div className="flex justify-between items-center w-full">
          <p className="text-lg sm:text-xl font-bold">
            {`${starRating % 1 ? starRating : starRating + ".0"}`}
          </p>
          {heartClick ? (
            <FaHeart
              fill={"#0D99FF"}
              style={{ width: "20px", height: "20px" }}
              onClick={handleHeartClick}
            />
          ) : (
            <CiHeart
              fill={"#D2D5D9"}
              style={{ width: "25px", height: "25px" }}
              onClick={handleHeartClick}
            />
          )}
        </div>
        <div className="flex justify-start items-center w-full mt-2">
          <p className="text-base sm:text-lg text-wrap text-black break-all whitespace-pre-wrap">
            {content}
          </p>
        </div>
        <div className="flex justify-between items-center w-full mt-2">
          <p className="text-sm sm:text-xl text-[#808080]">{semester + "학기 수강생"}</p>
          <div className="flex items-center">
            <FaHeart className="mr-1" fill={"#D2D5D9"} color={"#D2D5D9"} />
            <p className="text-[#808080]">{likes ? likes : 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ReviewComment };
