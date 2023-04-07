'use client';
import { ReactNode, useCallback, useEffect, useReducer, useState } from 'react';
import {
  TicketFactoryContext,
  reducer,
  initialState,
  ActionType,
} from './index';
import {
  useContract,
  useContractEvent,
  useSigner,
} from 'wagmi';
import artifact from '../../contracts/TicketFactory.json';
import { TicketCreated } from '@/types/context';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';

export function Provider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [collections, setCollections] = useState<string[]>([]);
  const [sftCollectionsLength, setSftCollectionsLength] = useState<number>(0);
  const { data: signerData } = useSigner();
  const ticketFactory = useContract({
    address: process.env.NEXT_PUBLIC_TICKET_FACTORY_ADDRESS,
    abi: artifact.abi,
    signerOrProvider: signerData,
  });
  useContractEvent({
    // @ts-ignore
    address: process.env.NEXT_PUBLIC_TICKET_FACTORY_ADDRESS,
    abi: artifact.abi,
    eventName: 'TicketCreated',
    listener(owner, collectionAddress, name) {
      dispatch({
        type: ActionType.ADD_EVENT,
        payload: {
          name: name,
          owner: owner,
          contractAddr: collectionAddress,
        },
      });
    },
  });

  useEffect(() => {
    console.log(
      'Factory address',
      process.env.NEXT_PUBLIC_TICKET_FACTORY_ADDRESS
    );
    fetchSftCollectionsLength();
  }, []);

  useEffect(() => {
    fetchCollections();
  }, [sftCollectionsLength]);

  async function fetchSftCollectionsLength() {
    if (!ticketFactory) return;

    try {
      const response = await ticketFactory.getSftCollectionsLength();
      if (response) {
        setSftCollectionsLength(ethers.BigNumber.from(response).toNumber());
      }
      return response;
    } catch (error) {
      console.error(error);
      toast.error("Une erreur s'est produite");
    }
  }

  async function fetchCollections() {
    if (!ticketFactory || !sftCollectionsLength) return;
    if (sftCollectionsLength === 0) return;

    try {
      const newCollections = [];
      for (let i = 0; i < sftCollectionsLength; i++) {
        newCollections.push(ticketFactory.sftCollections(i));
      }
      const response = await Promise.all(newCollections);

      setCollections([...response]);
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  const fetchTicketCreatedEvent = useCallback(async () => {
    if (!ticketFactory) return;
    try {
      const filter = ticketFactory.filters.TicketCreated();
      const rawEvents = await ticketFactory.queryFilter(filter);
      const events: TicketCreated[] = rawEvents.map((event) => ({
        name: event?.args?.name,
        owner: event?.args?.owner,
        contractAddr: event?.args?.collectionAddress,
      }));

      dispatch({ type: ActionType.INIT_EVENT, payload: events });
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
        await response.wait();
        toast.success('Événements créé');
        return response;
      } catch (error) {
        toast.error("Une erreur s'est produite");
      }
    },
    [ticketFactory]
  );

  const fetchCollection = useCallback(
    async (addr: string) => {
      if (!ticketFactory) return;

      try {
        const response = await ticketFactory.getCollection(addr);
        return response;
      } catch (error) {
        console.error(error);
        toast.error("Une erreur s'est produite");
      }
    },
    [ticketFactory]
  );

  return (
    <TicketFactoryContext.Provider
      value={{
        state,
        dispatch,
        collections,
        handler: {
          deployEvent,
          fetchTicketCreatedEvent,
          fetchCollection,
          fetchCollections,
          //@ts-ignore
          fetchSftCollectionsLength,
        },
      }}
    >
      {children && children}
    </TicketFactoryContext.Provider>
  );
}
