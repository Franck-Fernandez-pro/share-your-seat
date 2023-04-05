import { Action, State } from '@/types/context';
import { ActionType } from '.';

export const reducer = (state: State, { type, payload }: Action): State => {
  switch (type) {
    case ActionType.INIT_EVENT:
      return {
        ...state,
        event: {
          ...state.event,
          TicketCreated: [...payload],
        },
      };

    case ActionType.ADD_EVENT:
      const existing = state.event.TicketCreated.filter(
        ({ contractAddr }) => contractAddr !== payload.contractAddress
      );

      return {
        ...state,
        event: {
          ...state.event,
          TicketCreated: [...existing, payload],
        },
      };

    default:
      throw new Error('Undefined reducer action type');
  }
};
