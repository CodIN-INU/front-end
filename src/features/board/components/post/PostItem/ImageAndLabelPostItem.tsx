import Image from "next/image";
import { Post } from "@/types/post";

interface Props {
    post: Post;
    onOpenModal: (post: Post) => void;
}

const ImageAndLabelPostItem: React.FC<Props> = ({ post, onOpenModal }) => {
    const imageUrl = post.postImageUrl?.[0];

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        onOpenModal(post);
    };

    return (
        <li className="flex flex-col w-full bg-white overflow-hidden p-4 border rounded-lg shadow">
            <a href="#" onClick={handleClick} className="block">
                {imageUrl && (
                    <div className="aspect-square flex items-center justify-center bg-gray-50 rounded mb-2 overflow-hidden">
                        <Image
                            src={imageUrl}
                            alt={post.title}
                            width={80}
                            height={80}
                            className="object-cover w-full h-full"
                        />
                    </div>
                )}
                <p className="text-center text-sm sm:text-base font-medium text-gray-800">
                    {post.title}
                </p>
            </a>
        </li>
    );
};

export default ImageAndLabelPostItem;
