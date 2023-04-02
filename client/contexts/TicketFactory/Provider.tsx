import { ReactNode, useCallback, useEffect, useReducer } from 'react';
import {
  TicketFactoryContext,
  reducer,
  initialState,
  ActionType,
} from './index';
import { useContract, useSigner } from 'wagmi';
import artifact from '../../../hardhat/artifacts/contracts/TicketFactory.sol/TicketFactory.json';
import { TicketCreated } from '@/types/context';

export function Provider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { data: signerData } = useSigner();
  const ticketFactory = useContract({
    address: process.env.NEXT_PUBLIC_TICKET_FACTORY_ADDRESS,
    abi: artifact.abi,
    signerOrProvider: signerData,
  });

  useEffect(() => {
    fetchTicketCreatedEvent();
  }, [ticketFactory]);

  const fetchTicketCreatedEvent = useCallback(async () => {
    if (!ticketFactory) return;
    try {
      const filter = ticketFactory.filters.TicketCreated();
      const rawEvents = await ticketFactory.queryFilter(filter);
      const events: TicketCreated[] = rawEvents.map((event) => ({
        name: event?.args?.name,
        owner: event?.args?.owner,
        contractAddr: event?.args?.tokenContract,
      }));

      dispatch({ type: ActionType.ADD_EVENT, payload: events });
    } catch (error) {
      console.error(error);
    }
  }, [ticketFactory, dispatch]);

  return (
    <TicketFactoryContext.Provider value={{ state, dispatch }}>
      {children && children}
    </TicketFactoryContext.Provider>
  );
}
