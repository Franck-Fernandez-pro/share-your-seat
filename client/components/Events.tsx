import { AiOutlineReload } from 'react-icons/ai';
import { FC, useContext } from 'react';
import EventCard from './EventCard';
import { TicketFactoryContext } from '@/contexts/TicketFactory';

interface Props {}

const Events: FC<Props> = ({}) => {
  const {
    state: {
      event: { TicketCreated },
    },
    handler: { fetchTicketCreatedEvent },
  } = useContext(TicketFactoryContext);

  return (
    <section id="events">
      <h2 className="mx-auto my-20 text-center text-5xl font-extrabold">
        Événements
        <button className="ml-5" onClick={fetchTicketCreatedEvent}>
          <AiOutlineReload className="h-5 w-5" />
        </button>
      </h2>
      <div className="flex flex-wrap justify-center gap-5">
        {TicketCreated &&
          TicketCreated.map(({ contractAddr, name, owner }, idx) => (
            <EventCard
              key={idx}
              title={name}
              href={`event/${contractAddr}`}
            />
          ))}
      </div>

      <div className="my-10 flex justify-center">
        <a href="/event#create-event" className="btn btn-primary">
          Créer un événement
        </a>
      </div>
    </section>
  );
};

export default Events;
