import { useEffect, useState } from 'react';
import { useAccount, useContract, useSigner } from 'wagmi';
import artifact from '../contracts/Marketplace.json';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';

export function useMarketplace() {
  const [balance, setBalance] = useState<number>(0);
  const [supply, setSupply] = useState({
    available: 0,
    price: 0,
  });
  const { address } = useAccount();
  const { data: signerData } = useSigner();
  const marketplace = useContract({
    address: process.env.NEXT_PUBLIC_TICKET_MARKETPLACE_ADDRESS,
    abi: artifact.abi,
    signerOrProvider: signerData,
  });

  useEffect(() => {
    console.log(
      'Marketplace address',
      process.env.NEXT_PUBLIC_TICKET_MARKETPLACE_ADDRESS
    );
    fetchBalance();
  }, []);

  async function deposit(collectionAddr: string, id: number) {
    if (!marketplace) return;

    const toastId = toast.loading('Chargement...');
    try {
      const response = await marketplace.deposit(collectionAddr, address, id);

      await response.wait();

      toast.update(toastId, {
        render: 'Ticket mis en vente',
        type: 'success',
        isLoading: false,
      });
      return response;
    } catch (error) {
      console.error(error);
      toast.update(toastId, {
        render: "Une erreur s'est produite",
        type: 'error',
        isLoading: false,
      });
    }
  }

  async function buy(collectionAddr: string, id: number, price: number) {
    if (!marketplace) return;

    const toastId = toast.loading('Chargement...');
    try {
      const response = await marketplace.buy(collectionAddr, id, {
        value: ethers.utils.parseUnits(`${price}`, 'wei'),
      });

      await response.wait();

      toast.update(toastId, {
        render: 'Ticket acheté !',
        type: 'success',
        isLoading: false,
      });
      return response;
    } catch (error) {
      console.error(error);
      toast.update(toastId, {
        render: "Une erreur s'est produite",
        type: 'error',
        isLoading: false,
      });
    }
  }

  async function fetchSupply(collectionAddr: string, id: number) {
    if (!marketplace) return;

    try {
      const response = await marketplace.getSupply(collectionAddr, id);
      setSupply({
        available: ethers.BigNumber.from(response.available).toNumber(),
        price: ethers.BigNumber.from(response.price).toNumber(),
      });
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchBalance() {
    if (!marketplace) return;

    try {
      const response = await marketplace.balance(address);
      setBalance(ethers.BigNumber.from(response).toNumber());
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  async function withdrawBalance() {
    if (!marketplace) return;
    const toastId = toast.loading('Chargement...');

    try {
      const response = await marketplace.withdrawBalance();
      toast.update(toastId, {
        render: 'Withdraw success',
        type: 'success',
        isLoading: false,
      });
      return response;
    } catch (error) {
      console.error(error);
      toast.update(toastId, {
        render: "Une erreur s'est produite",
        type: 'error',
        isLoading: false,
      });
    }
  }

  return {
    supply,
    deposit,
    fetchSupply,
    buy,
    withdrawBalance,
    fetchBalance,
    balance,
  };
}
