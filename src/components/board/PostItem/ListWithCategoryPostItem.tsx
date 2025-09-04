"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Post } from "@/interfaces/Post";
import { mapPostCategoryToName } from "./utils";
import PostStats from "./PostStats";

interface Props {
  post: Post;
  onOpenModal: (post: Post) => void;
}

const ListWithCategoryPostItem: React.FC<Props> = ({ post, onOpenModal }) => {
  const router = useRouter();
  const imageUrl = post.postImageUrl?.[0];

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (post.postCategory === "POLL") {
      router.push(`/vote/${encodeURIComponent(post._id)}`);
      return;
    }
    onOpenModal(post);
  };

  const categoryName = mapPostCategoryToName(post.postCategory);

  return (
    <li className="flex items-start justify-between ">
      <a href="#" onClick={handleClick} className="flex-1">
        <div className="bg-gray-100 text-gray-500 text-xs px-1 py-0.5 rounded inline-block mb-1">
          {categoryName}
        </div>
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

export default ListWithCategoryPostItem;
