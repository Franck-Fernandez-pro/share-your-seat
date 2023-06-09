import TicketCard from '@/components/TicketCard';
import { TicketFactoryContext } from '@/contexts/TicketFactory';
import { useCollection } from '@/hooks';
import { ethers } from 'ethers';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { AiFillCalendar, AiFillHome, AiOutlineReload } from 'react-icons/ai';
import { useAccount } from 'wagmi';

const Event = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const router = useRouter();
  const { isConnected, address } = useAccount();
  const { id } = router.query;
  const {
    handler: { fetchCollection },
  } = useContext(TicketFactoryContext);
  const {
    mint,
    getCollectionBalance,
    withdraw,
    state: { collectionBalance, owner },
  } = useCollection(id as string);
  const [collection, setCollection] = useState({
    eventName: '',
    uri: '',
    availableTicketsLength: 0,
  });
  const [data, setData] = useState({
    name: '',
    description: '',
    image: '',
    properties: {
      address: '',
      date: '',
      price: '',
    },
  });

  useEffect(() => {
    fetchData();
  }, [id, isConnected]);

  useEffect(() => {
    if (collection.uri) {
      fetchMetadata();
    }
    getCollectionBalance();
  }, [collection]);

  async function fetchMetadata() {
    try {
      const response = await fetch(`${collection.uri}1.json`);
      const data = await response.json();
      setData(data);
    } catch (error) {}
  }

  async function fetchData() {
    if (!isConnected || !id) {
      return;
    }
    //@ts-ignore
    const response = await fetchCollection(id);

    try {
      const len = ethers.BigNumber.from(
        response?.availableTicketsLength
      ).toNumber();
      if (response.eventName && response.uri && len) {
        setCollection({
          eventName: response.eventName,
          uri: response.uri,
          availableTicketsLength: len,
        });
      }
    } catch (error) {}
  }

  function renderTickets() {
    const tickets = [];
    for (let i = 0; i < collection.availableTicketsLength; i++) {
      tickets.push(
        <TicketCard
          key={i}
          uri={`${collection.uri}${i}.json`}
          id={`${i}`}
          onMint={handleMint}
          addr={id as string}
        />
      );
    }

    return tickets;
  }

  function handleMint(ticketId: number, amount: number, price: number) {
    mint && mint(ticketId, amount, price);
  }
  // ? To avoid NextJS hydration-error -> https://nextjs.org/docs/messages/react-hydration-error
  if (!mounted) return <></>;
  return (
    <>
      <Head>
        <title>Événement {collection.eventName}</title>
      </Head>

      <div className="hero bg-base-200 min-h-[500px]">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">
              {collection.eventName}{' '}
              <button className="ml-5" onClick={fetchData}>
                <AiOutlineReload className="h-5 w-5" />
              </button>
            </h1>
            {data.description && <p className="py-6">{data.description}</p>}
            {data.properties.address && (
              <p className="flex items-center justify-center gap-2">
                <AiFillHome className="h-4 w-4" /> {data.properties.address}
              </p>
            )}
            {data.properties.date && (
              <p className="flex items-center justify-center gap-2">
                <AiFillCalendar className="h-4 w-4" /> {data.properties.date}
              </p>
            )}
            {owner === address && (
              <button
                className="btn btn-accent btn-sm mt-5"
                disabled={collectionBalance === 0}
                onClick={withdraw}
              >
                Withdraw{' '}
                {collectionBalance
                  ? `${collectionBalance} Wei`
                  : collectionBalance}
              </button>
            )}
          </div>
        </div>
      </div>

      <section id="tickets">
        <h2 className="mx-auto my-20 text-center text-5xl font-extrabold">
          Tickets
          <button className="ml-5" onClick={fetchData}>
            <AiOutlineReload className="h-5 w-5" />
          </button>
        </h2>
        <div className="flex flex-wrap justify-center gap-5">
          {renderTickets().map((T) => T)}
        </div>
      </section>
    </>
  );
};

export default Event;
