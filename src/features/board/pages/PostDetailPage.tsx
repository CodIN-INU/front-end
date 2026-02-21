import DefaultBody from '@/components/Layout/Body/defaultBody';
import PostDetailClient from '../components/post/PostDetailClient';
import { getPostById } from '@/api/server/getPost';

export interface PostDetailPageProps {
  params: Promise<{ boardName: string; postId: string }>;
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const resolved = await params;
  const initialPost = await getPostById(resolved.postId);

  return (
    <DefaultBody hasHeader={1}>
      <PostDetailClient postId={resolved.postId} initialPost={initialPost} />
    </DefaultBody>
  );
}
