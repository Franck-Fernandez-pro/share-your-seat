import { useEffect, useState } from 'react';
import { useAccount, useContract, useSigner } from 'wagmi';
import artifact from '../../hardhat/artifacts/contracts/TicketSFT.sol/TicketSFT.json';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';

export function useCollection(addr: string) {
  const [state, setState] = useState({
    ticketPrice: 0,
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

  async function mint(id: number, amount: number) {
    console.group();
    console.log('amount:', amount);
    console.log('id:', id);
    console.log('address', address);
    console.groupEnd();
    if (!collection) return;

    try {
      const response = await collection.mint(address, id, amount);
      console.log('mint response', response);

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

  return { state, mint, getTicketPrice };
}
