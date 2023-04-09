import MyTickets from '@/components/MyTickets';
import { TicketFactoryContext } from '@/contexts/TicketFactory';
import { useMarketplace } from '@/hooks';
import Head from 'next/head';
import { useContext } from 'react';
import { AiOutlineReload } from 'react-icons/ai';

const User = () => {
  const {
    //@ts-ignore
    handler: { fetchCollections, fetchSftCollectionsLength },
  } = useContext(TicketFactoryContext);
  const { withdrawBalance, balance, fetchBalance } = useMarketplace();
  return (
    <>
      <Head>
        <title>User</title>
      </Head>

      <div className="hero bg-base-200 mb-5 min-h-[200px]">
        <div className="hero-content text-center">
          <div className="flex max-w-md flex-col items-center">
            <div className="flex">
              <h1 className="text-5xl font-bold">Mes Tickets</h1>
              <button
                className="ml-5"
                onClick={() => {
                  fetchCollections();
                  fetchSftCollectionsLength();
                  fetchBalance();
                }}
              >
                <AiOutlineReload className="h-5 w-5" />
              </button>
            </div>
            <button
              className="btn btn-accent btn-sm mt-5"
              onClick={withdrawBalance}
              disabled={balance === 0}
            >
              {`Withdraw ${balance} Wei`}
            </button>
          </div>
        </div>
      </div>
      <MyTickets />
    </>
  );
};

export default User;
