import type { CreateTicketEventRequest } from '@/types/ticketEventRequest';
import type { ChangeEvent } from 'react';

export type InputBlockProps = {
  label: string;
  name: keyof CreateTicketEventRequest;
  value: string | number;
  onChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  placeholder?: string;
  type?: string;
  withIcon?: boolean;
  /** true면 textarea로 렌더 (행사 설명 등 줄바꿈 입력) */
  multiline?: boolean;
};
