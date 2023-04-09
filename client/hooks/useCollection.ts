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
    balanceOfBatch: [],
    name: '',
    ticketsLength: 0,
    owner: '',
  });
  const { address } = useAccount();
  const { data: signerData } = useSigner();
  const collection = useContract({
    address: addr,
    abi: artifact.abi,
    signerOrProvider: signerData,
  });

  useEffect(() => {
    fetchName();
    fetchTicketsLength();
    fetchOwner();
  }, [addr]);

  useEffect(() => {
    fetchBalanceOfBatch();
  }, [option?.ids]);

  async function fetchName() {
    if (!collection) return;

    try {
      const response = await collection.name();
      setState((s) => ({
        ...s,
        name: response,
      }));

      return response;
    } catch (error) {
      console.error(error);
    }
  }
  async function fetchTicketsLength() {
    if (!collection) return;

    try {
      const response = await collection.availableTicketsLength();
      setState((s) => ({
        ...s,
        ticketsLength: ethers.BigNumber.from(response).toNumber(),
      }));

      return response;
    } catch (error) {
      console.error(error);
    }
  }
  async function fetchOwner() {
    if (!collection) return;

    try {
      const response = await collection.owner();
      setState((s) => ({
        ...s,
        owner: response,
      }));

      return response;
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchBalanceOfBatch() {
    if (!collection || !option?.ids) return;

    try {
      const response = await collection.balanceOfBatch(
        option.ids.map(() => address),
        option.ids
      );
      setState((s) => ({
        ...s,
        balanceOfBatch: response.map((b: any) =>
          ethers.BigNumber.from(b).toNumber()
        ),
      }));

      return response;
    } catch (error) {
      console.error(error);
    }
  }

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

  async function transfer(to: string, id: number, amount: number) {
    if (!collection) return;
    const toastId = toast.loading('Chargement...');
    try {
      const response = await collection.safeTransferFrom(
        address,
        to,
        id,
        amount,
        '0x'
      );

      toast.update(toastId, {
        render: 'Transfer réussi',
        type: 'success',
        isLoading: false,
      });
      return response;
    } catch (error) {
      toast.update(toastId, {
        render: "Une erreur s'est produite",
        type: 'error',
        isLoading: false,
      });
      console.error(error);
    }
  }
  async function setApprovalForAll() {
    if (!collection) return;
    const toastId = toast.loading('Chargement...');
    try {
      const response = await collection.setApprovalForAll(
        process.env.NEXT_PUBLIC_TICKET_MARKETPLACE_ADDRESS,
        true
      );

      toast.update(toastId, {
        render: 'Approval réussi',
        type: 'success',
        isLoading: false,
      });
      return response;
    } catch (error) {
      toast.update(toastId, {
        render: "Une erreur s'est produite",
        type: 'error',
        isLoading: false,
      });
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
    getBalanceOf,
    transfer,
    setApprovalForAll,
  };
}
