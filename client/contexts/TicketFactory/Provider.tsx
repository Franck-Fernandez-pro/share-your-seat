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
import { toast } from 'react-toastify';

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

  const deployEvent = useCallback(
    async (
      eventName: string,
      uri: string,
      ticketPrices: number[],
      availableTickets: number[]
    ) => {
      if (!ticketFactory) return;

      try {
        const response = await ticketFactory.deployTicket(
          eventName,
          uri,
          ticketPrices,
          availableTickets
        );

        toast.success('Événements créé');
        return response;
      } catch (error) {
        toast.error("Une erreur s'est produite");
      }
    },
    [ticketFactory]
  );

  return (
    <TicketFactoryContext.Provider
      value={{ state, dispatch, handler: { deployEvent } }}
    >
      {children && children}
    </TicketFactoryContext.Provider>
  );
}
