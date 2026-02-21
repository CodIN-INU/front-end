import TicketingEventPage from '@/features/ticketing/pages/TicketingEventPage';
import { getTicketingEventById } from '@/api/server';

interface PageProps {
  params: Promise<{ eventId: string }>;
}

export default async function TicketingEventRoutePage({ params }: PageProps) {
  const { eventId } = await params;
  const initialEvent = await getTicketingEventById(eventId);

  return (
    <TicketingEventPage
      eventId={eventId}
      initialEvent={initialEvent}
    />
  );
}
