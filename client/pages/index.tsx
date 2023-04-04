import Events from '@/components/Events';
import Intro from '@/components/Intro';
import { TicketFactoryContext } from '@/contexts/TicketFactory';
import Head from 'next/head';
import { useContext } from 'react';

export default function Home() {
  console.log(
    'Factory address',
    process.env.NEXT_PUBLIC_TICKET_FACTORY_ADDRESS
  );
  return (
    <>
      <Head>
        <title>Share Your Seat</title>
        <meta name="description" content="Share Your Seat marketplace" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <Intro />
        <Events />
      </main>
    </>
  );
}
