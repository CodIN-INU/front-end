import Image from "next/image";
import { Post } from "@/types/post";
import { mapPostCategoryToBoardPath } from '@/features/board/utils';
import PostStats from "./PostStats";

interface Props {
  post: Post;
  onOpenModal: (post: Post) => void;
}

/** 기본형(텍스트+썸네일) 게시글 목록 아이템 */
const StandardPostItem: React.FC<Props> = ({ post, onOpenModal }) => {
  const imageUrl = post.postImageUrl?.[0];

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onOpenModal(post);
  };

  const boardPath = mapPostCategoryToBoardPath(post.postCategory);

  return (
    <li className="flex items-start justify-between">
      <a href="#" onClick={handleClick} className="flex-1">
        <div className="flex justify-between">
          <div>
            <h3 className="text-sm sm:text-Lm font-medium text-gray-800 mt-[8px]">
              {post.title}
            </h3>
            <p className="text-xs sm:text-Mm text-sub line-clamp-2 mt-[4px] mb-[8px]">
              {post.content}
            </p>
          </div>
          {imageUrl && (
            <div className="ml-4 w-16 h-16 overflow-hidden rounded bg-gray-50 flex-shrink-0">
              <Image
                src={imageUrl}
                alt={post.title}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </div>
          )}
        </div>
        <PostStats post={post} />
      </a>
    </li>
  );
};

export default StandardPostItem;
