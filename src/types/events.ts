export interface CalendarEvent {
  title: string;
  start: string;
  end: string;
  extendedProps: {
    category: string;
    article_url: string;
    banner_url: string;
  };
}

export interface ApiEvent {
  title: string;
  category: string;
  is_local_time: boolean;
  start_time: string | number;
  end_time: string | number;
  article_url: string;
  banner_url: string;
}

export type NewEventData = {
  title: string;
  start: string;
  end: string;
};
