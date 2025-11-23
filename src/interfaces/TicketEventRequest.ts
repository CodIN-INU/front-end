export interface CreateTicketEventRequest {
  eventTitle?: string;
  eventTime?: string;
  locationInfo?: string;
  target?: string;
  quantity?: number;
  eventEndTime?: string;
  promotionLink?: string;
  inquiryNumber?: string;
  description?: string;
}
