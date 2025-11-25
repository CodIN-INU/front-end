export interface CreateTicketEventRequest {
  title?: string;
  eventTime?: string;
  locationInfo?: string;
  target?: string;
  quantity?: number;
  eventEndTime?: string;
  promotionLink?: string;
  inquiryNumber?: string;
  description?: string;
  campus?:string;
  stock?:number;
}
