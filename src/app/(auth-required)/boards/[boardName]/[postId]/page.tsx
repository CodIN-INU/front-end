// PostDetailPage.tsx (하위 페이지)
import { Header } from '@/components/Layout/header';
import LayoutWithBottomNav from '../../../layout';
import PostDetailClient from './PostDetailClient';
import DefaultBody from '@/components/Layout/Body/defaultBody';

export interface PostDetailPageProps {
  params: Promise<{ _id: string }>;
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const resolvedParams = await params; // Promise 해제
  return (
    <DefaultBody hasHeader={1}>
      <PostDetailClient postId={resolvedParams._id} />
    </DefaultBody>
  );
}
