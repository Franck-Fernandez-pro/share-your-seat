export const reducer = (state: State, { type, payload }: Action): State => {
  switch (type) {
    case ActionType.ADD_EVENT:
      return {
        ...state,
      };

    default:
      throw new Error('Undefined reducer action type');
  }
};
