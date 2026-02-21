import VoteDetailPage from '@/features/vote/pages/VoteDetailPage';
import { getVoteById } from '@/api/server';

interface PageProps {
  params: Promise<{ voteId: string }>;
}

export default async function VoteDetailRoutePage({ params }: PageProps) {
  const { voteId } = await params;
  const initialVote = await getVoteById(voteId);

  return <VoteDetailPage voteId={voteId} initialVote={initialVote} />;
}
