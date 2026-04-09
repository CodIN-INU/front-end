import VoteListPage from '@/features/vote/pages/VoteListPage';
import { getVotes } from '@/server';

export default async function VoteListRoutePage() {
  const { votes, nextPage } = await getVotes(0);

  return (
    <VoteListPage
      initialVotes={votes}
      initialNextPage={nextPage}
    />
  );
}
