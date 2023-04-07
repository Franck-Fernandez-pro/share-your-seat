import MyTickets from '@/components/MyTickets';
import Head from 'next/head';

const User = () => {
  return (
    <>
      <Head>
        <title>User</title>
      </Head>

      <div className="hero bg-base-200 min-h-[500px]">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Mes Tickets</h1>
          </div>
        </div>
      </div>
      <MyTickets />
    </>
  );
};

export default User;
