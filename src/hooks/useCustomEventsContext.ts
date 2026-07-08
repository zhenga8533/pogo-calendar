import { useContext } from 'react';
import { CustomEventsContext } from '../contexts/CustomEventsContext';

export function useCustomEventsContext() {
  const context = useContext(CustomEventsContext);
  if (!context) {
    throw new Error(
      'useCustomEventsContext must be used within a CustomEventsProvider'
    );
  }
  return context;
}
