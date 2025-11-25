import { CreateTicketEventRequest } from "@/interfaces/TicketEventRequest";
import { ChangeEvent } from "react";

export type InputBlockProps = {
  label: string;
  name: keyof CreateTicketEventRequest;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  withIcon?: boolean;
};