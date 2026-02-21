import Image from 'next/image';
import { Post } from '@/types/post';
import { getDefaultImageUrl } from '@/features/board/utils';
import PostStats from './PostStats';
import Link from 'next/link';

interface Props {
  post: Post;
  onOpenModal: (post: Post) => void;
}

const GalleryPostItem: React.FC<Props> = ({ post, onOpenModal }) => {
  const imageUrl = post.postImageUrl?.[0] || getDefaultImageUrl(post.title);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onOpenModal(post);
  };

  return (
    <li className="flex flex-col h-full bg-white overflow-hidden rounded shadow">
      <Link
        href="#"
        onClick={handleClick}
        className="flex flex-col flex-1 h-full" // 핵심!
      >
        <div className="relative w-full h-[70px]">
          <Image
            src={imageUrl}
            alt={post.title}
            width={400}
            height={400}
            className="object-cover w-full h-full bg-white"
          />
        </div>
        <div className="p-4 flex-1 flex flex-col justify-between">
          <h3 className="text-sm sm:text-base font-semibold text-gray-800">
            {post.title}
          </h3>
          <PostStats post={post} />
        </div>
      </Link>
    </li>
  );
};

export default GalleryPostItem;
