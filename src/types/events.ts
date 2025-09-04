export interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  resource: {
    category: string;
  };
}

export interface ApiEvent {
  title: string;
  category: string;
  start_timestamp: number;
  end_timestamp: number;
}
