import { useContext } from 'react';
import { EventDataContext } from '../contexts/eventDataContextValue';

export function useEventDataContext() {
  const context = useContext(EventDataContext);
  if (!context) {
    throw new Error(
      'useEventDataContext must be used within an EventDataProvider'
    );
  }
  return context;
}
