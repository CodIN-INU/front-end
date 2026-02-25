"use client";

import type { Post } from "@/types/post";
import GalleryPostItem from "./GalleryPostItem";
import ImageAndLabelPostItem from "./ImageAndLabelPostItem";
import CategoryPostItem from "./CategoryPostItem";
import StandardPostItem from "./StandardPostItem";
import PollPostItem from "./PollPostItem";

interface PostItemProps {
  post: Post;
  boardName: string;
  boardType: string;
  onOpenModal: (post: Post) => void;
}

/**
 * 데이터 기준: poll 있으면 투표 레이아웃, 없으면 boardType으로 일반 레이아웃 선택
 */
const PostItem: React.FC<PostItemProps> = ({
  post,
  boardName,
  boardType,
  onOpenModal,
}) => {
  if (post.poll != null) {
    return <PollPostItem post={post} onOpenModal={onOpenModal} />;
  }

  switch (boardType) {
    case "gallery":
      return <GalleryPostItem post={post} onOpenModal={onOpenModal} />;
    case "imageAndLabel":
      return <ImageAndLabelPostItem post={post} onOpenModal={onOpenModal} />;
    case "listWithCategory":
      return <CategoryPostItem post={post} onOpenModal={onOpenModal} />;
    default:
      return <StandardPostItem post={post} onOpenModal={onOpenModal} />;
  }
};

export default PostItem;

