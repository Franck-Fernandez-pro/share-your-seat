import { Action, State } from '@/types/context';
import { ActionType } from '.';

export const reducer = (state: State, { type, payload }: Action): State => {
  switch (type) {
    case ActionType.ADD_EVENT:
      return {
        ...state,
        event: {
          ...state.event,
          TicketCreated: [...state.event.TicketCreated, ...payload],
        },
      };

    default:
      throw new Error('Undefined reducer action type');
  }
};
