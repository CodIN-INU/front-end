import TicketingPage from '@/features/ticketing/pages/TicketingPage';
import { getTicketingEvents } from '@/api/server';
import { boardData } from '@/data/boardData';

export default async function TicketingRoutePage() {
  const defaultCampus = boardData['ticketing']?.tabs[0]?.postCategory ?? 'SONGDO_CAMPUS';
  const { events, nextPage } = await getTicketingEvents(defaultCampus, 0);

  return (
    <TicketingPage
      initialEvents={events}
      initialNextPage={nextPage}
    />
  );
}
