"use client";

import { Post } from "@/types/post";
import GalleryPostItem from "./GalleryPostItem";
import ImageAndLabelPostItem from "./ImageAndLabelPostItem";
import ListWithCategoryPostItem from "./ListWithCategoryPostItem";
import DefaultPostItem from "./DefaultPostItem";

interface PostItemProps {
    post: Post;
    boardName: string;
    boardType: string;
    onOpenModal: (post: Post) => void;
}

const PostItem: React.FC<PostItemProps> = ({ post, boardName, boardType, onOpenModal }) => {
    switch (boardType) {
        case "gallery":
            return <GalleryPostItem post={post} onOpenModal={onOpenModal} />;
        case "imageAndLabel":
            return <ImageAndLabelPostItem post={post} onOpenModal={onOpenModal} />;
        case "listWithCategory":
            return <ListWithCategoryPostItem post={post} onOpenModal={onOpenModal} />;
        default:
            return <DefaultPostItem post={post} onOpenModal={onOpenModal} />;
    }
};

export default PostItem;

