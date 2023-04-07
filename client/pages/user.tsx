import MyTickets from '@/components/MyTickets';
import { TicketFactoryContext } from '@/contexts/TicketFactory';
import Head from 'next/head';
import { useContext } from 'react';
import { AiOutlineReload } from 'react-icons/ai';

const User = () => {
  const {
    handler: { fetchCollections },
  } = useContext(TicketFactoryContext);
  return (
    <>
      <Head>
        <title>User</title>
      </Head>

      <div className="hero bg-base-200 min-h-[200px]">
        <div className="hero-content text-center">
          <div className="flex max-w-md items-center">
            <h1 className="text-5xl font-bold">Mes Tickets</h1>
            <button className="ml-5" onClick={fetchCollections}>
              <AiOutlineReload className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      <MyTickets />
    </>
  );
};

export default User;
