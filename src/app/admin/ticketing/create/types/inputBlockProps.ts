import { TicketEvent } from "@/interfaces/SnackEvent";
import { ChangeEvent } from "react";

export type InputBlockProps = {
  label: string;
  name: keyof TicketEvent;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  withIcon?: boolean;
};