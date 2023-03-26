import Events from '@/components/Events';
import Intro from '@/components/Intro';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Share Your Seat</title>
        <meta name="description" content="Share Your Seat marketplace" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="">
        <Intro />
        <Events />
      </main>
    </>
  );
}
