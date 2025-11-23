import { TicketForm } from "./ticketForm";
import { ChangeEvent } from "react";

export type InputBlockProps = {
  label: string;
  name: keyof TicketForm;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  withIcon?: boolean;
};