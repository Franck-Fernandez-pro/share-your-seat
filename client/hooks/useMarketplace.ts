import { useEffect } from 'react';
import { useAccount, useContract, useSigner } from 'wagmi';
import artifact from '../contracts/Marketplace.json';
import { toast } from 'react-toastify';

export function useMarketplace() {
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

  return { deposit };
}
