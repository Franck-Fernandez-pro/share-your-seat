import { useEffect, useState } from 'react';
import { useAccount, useContract, useSigner } from 'wagmi';
import artifact from '../../hardhat/artifacts/contracts/TicketSFT.sol/TicketSFT.json';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';

export function useCollection(addr: string) {
  const [state, setState] = useState({
    ticketPrice: 0,
    availableTickets: 0,
    collectionBalance: 0,
  });
  const { address } = useAccount();
  const { data: signerData } = useSigner();
  const collection = useContract({
    address: addr,
    abi: artifact.abi,
    signerOrProvider: signerData,
  });

  useEffect(() => {
    console.log('Collection address', addr);
  }, [addr]);

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
      console.log('response:', response);
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
  };
}
