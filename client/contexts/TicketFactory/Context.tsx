import { AppContext, State } from '@/types/context';
import { createContext } from 'react';

export const initialState: State = {
  event: {
    TicketCreated: [],
    TicketMinted: [],
  },
};

export const TicketFactoryContext = createContext<AppContext>({
  state: initialState,
  dispatch: () => {},
  handler: {
    // @ts-ignore
    deployEvent: () => {},
    fetchTicketCreatedEvent: () => {},
    // @ts-ignore
    fetchCollection: () => {},
    // @ts-ignore
    mint: () => {},
  },
});
