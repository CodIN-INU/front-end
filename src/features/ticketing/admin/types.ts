import type { CreateTicketEventRequest } from '@/types/ticketEventRequest';
import type { ChangeEvent } from 'react';

export type InputBlockProps = {
  label: string;
  name: keyof CreateTicketEventRequest;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  withIcon?: boolean;
};
