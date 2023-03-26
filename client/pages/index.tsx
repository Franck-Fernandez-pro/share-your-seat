import EventCard from '@/components/EventCard';
import Head from 'next/head';

const EVENTS = [
  {
    title: 'Event',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    href: '/',
  },
  {
    title: 'Event',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    href: '/',
  },
  {
    title: 'Event',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    href: '/',
  },
  {
    title: 'Event',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    href: '/',
  },
  {
    title: 'Event',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    href: '/',
  },
];

export default function Home() {
  return (
    <>
      <Head>
        <title>Share Your Seat</title>
        <meta name="description" content="Share Your Seat marketplace" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="">
        <section className="flex flex-wrap justify-center gap-5">
          {EVENTS.map(({ text, title, href }, idx) => (
            <EventCard key={idx} text={text} title={title} href={href} />
          ))}
        </section>
      </main>
    </>
  );
}
