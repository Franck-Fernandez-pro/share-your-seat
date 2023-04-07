import { TicketFactoryContext } from '@/contexts/TicketFactory';
import { FC, useContext, useEffect, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import MyTicketCard from './MyTicketCard';
import { useCollection } from '@/hooks';
import { ethers } from 'ethers';
import { AiOutlineReload } from 'react-icons/ai';

interface Props {}

const MyTickets: FC<Props> = ({}) => {
  const { address } = useAccount();
  const { collections } = useContext(TicketFactoryContext);

  return address ? (
    <section id="tickets">
      <div className="">
        {collections &&
          collections.map((addr, idx) => (
            <CollectionSection key={idx} addr={addr} />
          ))}
      </div>
    </section>
  ) : (
    <p>Connectez vous</p>
  );
};
export default MyTickets;

// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// :::::::::::::::::: CollectionSection ::::::::::::::::::::::
// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
const CollectionSection: FC<{ addr: string }> = ({ addr }) => {
  const [ids, setIds] = useState<number[]>([]);
  const {
    handler: { fetchCollection },
  } = useContext(TicketFactoryContext);
  const { ticketsLength, name, balanceOfBatch } = useCollection(addr, { ids });
  const [collection, setCollection] = useState({
    eventName: '',
    uri: '',
    availableTicketsLength: 0,
  });

  useEffect(() => {
    fetchData();
  }, [addr]);

  useEffect(() => {
    if (ticketsLength === 0) return;
    const newIds = [];
    for (let i = 0; i < ticketsLength; i++) {
      newIds.push(i);
    }

    setIds([...newIds]);
  }, [ticketsLength]);

  async function fetchData() {
    const response = await fetchCollection(addr);

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

  function shouldRender(arr: number[]): boolean {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] > 0) return true;
    }
    return false;
  }

  return shouldRender(balanceOfBatch) ? (
    <>
      <div>
        <h2 className="mx-auto my-5 text-center text-2xl font-extrabold">
          {name && name}
          <button
            className="ml-5"
            onClick={() => {
              fetchData();
            }}
          >
            <AiOutlineReload className="h-5 w-5" />
          </button>
        </h2>
        <div className="flex flex-wrap justify-center gap-5">
          {collection.uri &&
            balanceOfBatch &&
            balanceOfBatch.map((b, i) => (
              <MyTicketCard
                key={i}
                uri={`${collection.uri}${i}.json`}
                id={`${i}`}
                addr={addr}
                balance={b}
              />
            ))}
        </div>
      </div>

      <div className="divider" />
    </>
  ) : (
    <></>
  );
};
