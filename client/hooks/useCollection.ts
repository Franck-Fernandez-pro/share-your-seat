import { useEffect, useState } from 'react';
import { useAccount, useContract, useContractRead, useSigner } from 'wagmi';
import artifact from '../contracts/TicketSFT.json';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';

export function useCollection(addr: string, option?: { ids?: number[] }) {
  const [state, setState] = useState({
    ticketPrice: 0,
    availableTickets: 0,
    collectionBalance: 0,
    balance: 0,
  });
  const { address } = useAccount();
  const { data: signerData } = useSigner();
  const collection = useContract({
    address: addr,
    abi: artifact.abi,
    signerOrProvider: signerData,
  });

  const { data: balanceOfBatch } = useContractRead({
    address: addr as `0x${string}`,
    abi: artifact.abi,
    functionName: 'balanceOfBatch',
    enabled: option?.ids ? option?.ids.length > 0 : false,
    args: [option?.ids && option.ids.map(() => address), option?.ids],
    watch: true,
  });

  const { data: ticketsLength } = useContractRead({
    address: addr as `0x${string}`,
    abi: artifact.abi,
    functionName: 'availableTicketsLength',
  });

  const { data: name } = useContractRead({
    address: addr as `0x${string}`,
    abi: artifact.abi,
    functionName: 'name',
  });

  async function mint(id: number, amount: number, price: number) {
    if (!collection) return;

    try {
      const response = await collection.mint(address, id, amount, {
        value: ethers.utils.parseUnits(`${price * amount}`, 'wei'),
      });

      await response.wait();

      toast.success('Ticket mint');
      return response;
    } catch (error) {
      console.error(error);
      toast.error("Une erreur s'est produite");
    }
  }

  async function getTicketPrice(id: number) {
    if (!collection) return;

    try {
      const response = await collection.ticketPrices(id);
      setState((s) => ({
        ...s,
        ticketPrice: ethers.BigNumber.from(response).toNumber(),
      }));

      return response;
    } catch (error) {
      console.error(error);
    }
  }

  async function getBalanceOf(id: number) {
    if (!collection) return;

    try {
      const response = await collection.balanceOf(address, id);
      setState((s) => ({
        ...s,
        balance: ethers.BigNumber.from(response).toNumber(),
      }));

      return response;
    } catch (error) {
      console.error(error);
    }
  }

  async function getAvailableTicket(id: number) {
    if (!collection) return;

    try {
      const response = await collection.availableTickets(id);
      setState((s) => ({
        ...s,
        availableTickets: ethers.BigNumber.from(response).toNumber(),
      }));

      return response;
    } catch (error) {
      console.error(error);
    }
  }

  async function getCollectionBalance() {
    if (!collection) return;

    try {
      const response = await collection.collectionBalance();
      setState((s) => ({
        ...s,
        collectionBalance: ethers.BigNumber.from(response).toNumber(),
      }));

      return response;
    } catch (error) {
      console.error(error);
    }
  }

  async function withdraw() {
    if (!collection) return;

    try {
      const response = await collection.withdraw(address);
      getCollectionBalance();

      toast.success('Withdraw réussi');
      return response;
    } catch (error) {
      toast.error("Une erreur s'est produite");
      console.error(error);
    }
  }

  return {
    state,
    mint,
    getTicketPrice,
    getAvailableTicket,
    getCollectionBalance,
    withdraw,
    ticketsLength: ethers.BigNumber.from(ticketsLength).toNumber(),
    name: name as string,
    getBalanceOf,
    balanceOfBatch: balanceOfBatch
      ? // @ts-ignore
        (balanceOfBatch.map((b: any) =>
          ethers.BigNumber.from(b).toNumber()
        ) as number[])
      : [],
  };
}
