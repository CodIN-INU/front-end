import type { VoteDetail } from '@/server';
import VoteDetailView from '../components/VoteDetailView';

export interface VoteDetailPageProps {
  voteId?: string;
  initialVote?: VoteDetail | null;
}

export default function VoteDetailPage({
  voteId,
  initialVote,
}: VoteDetailPageProps = {}) {
  return <VoteDetailView voteId={voteId} initialVote={initialVote} />;
}
