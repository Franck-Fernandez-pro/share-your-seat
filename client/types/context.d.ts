type State = {
  event: {
    TicketCreated: number[];
    TicketMinted: number[];
  };
};

type AppContext = {
  state: State;
  dispatch: Dispatch<Action>;
};

enum ActionType {
  ADD_EVENT = 'ADD_EVENT',
}

type Action = {
  type: ActionType;
  payload: State;
};
