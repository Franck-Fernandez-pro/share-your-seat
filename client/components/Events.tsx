import { FC } from 'react';
import EventCard from './EventCard';

const EVENTS = [
  {
    title: 'Event',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    id: 1,
  },
  {
    title: 'Event',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    id: 2,
  },
  {
    title: 'Event',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    id: 3,
  },
  {
    title: 'Event',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    id: 4,
  },
  {
    title: 'Event',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    id: 5,
  },
];

interface Props {}

const Events: FC<Props> = ({}) => (
  <section id="events">
    <h2 className="mx-auto my-20 text-center text-5xl font-extrabold">
      Événements
    </h2>
    <div className="flex flex-wrap justify-center gap-5">
      {EVENTS.map(({ text, title, id }, idx) => (
        <EventCard key={idx} text={text} title={title} href={`event/${id}`} />
      ))}
    </div>

    <div className="my-10 flex justify-center">
      <a href="/event#create-event" className="btn btn-primary">
        Créer un événement
      </a>
    </div>
  </section>
);

export default Events;
