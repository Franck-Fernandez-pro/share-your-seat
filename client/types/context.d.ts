import { ActionType } from '@/contexts/TicketFactory';

type TicketCreated = {
  name: string;
  owner: string;
  contractAddr: string;
};

type State = {
  event: {
    TicketCreated: TicketCreated[];
    TicketMinted: number[];
  };
};

type AppContext = {
  state: State;
  dispatch: Dispatch<Action>;
  collections: string[]
  handler: {
    deployEvent: (
      eventName: string,
      uri: string,
      ticketPrices: number[],
      availableTickets: number[]
      ) => Promise<any>;
      fetchTicketCreatedEvent: () => void;
      fetchCollection: (addr: string) => Promise<any>;
      fetchCollections: () => Promise<any>;
  };
};

type Action = {
  type: ActionType;
  payload: any;
};
