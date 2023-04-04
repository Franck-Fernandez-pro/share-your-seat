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
};

type Action = {
  type: ActionType;
  payload: any;
};
