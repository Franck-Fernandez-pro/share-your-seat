import TicketCard from '@/components/TicketCard';
import { TicketFactoryContext } from '@/contexts/TicketFactory';
import { ethers } from 'ethers';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { AiFillCalendar, AiFillHome, AiOutlineReload } from 'react-icons/ai';
import { useAccount } from 'wagmi';

const Event = () => {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { id } = router.query;
  const {
    handler: { fetchCollection, mint },
  } = useContext(TicketFactoryContext);
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
          uri={`${collection.uri}${i + 1}.json`}
          id={`${i + 1}`}
          onMint={handleMint}
        />
      );
    }

    return tickets;
  }

  function handleMint(ticketId: number, amount: number) {
    const addr = id as string;
    mint && mint(addr, ticketId, amount);
  }

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
            <p className="py-6">{data.description}</p>
            <p className="flex items-center justify-center gap-2">
              <AiFillHome className="h-4 w-4" /> {data.properties.address}
            </p>
            <p className="flex items-center justify-center gap-2">
              <AiFillCalendar className="h-4 w-4" /> {data.properties.date}
            </p>
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
