import { DefaultBody } from '@/shared/ui';
import PostDetailView from '../components/post/PostDetailView';
import { getPostById } from '@/server';

export interface PostDetailPageProps {
  params: Promise<{ boardName: string; postId: string }>;
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const resolved = await params;
  const initialPost = await getPostById(resolved.postId);

  return (
    <DefaultBody headerPadding="compact">
      <PostDetailView postId={resolved.postId} initialPost={initialPost} />
    </DefaultBody>
  );
}
