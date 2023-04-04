import { FC, useContext } from 'react';
import EventCard from './EventCard';
import { TicketFactoryContext } from '@/contexts/TicketFactory';

interface Props {}

const Events: FC<Props> = ({}) => {
  const {
    state: {
      event: { TicketCreated },
    },
  } = useContext(TicketFactoryContext);

  return (
    <section id="events">
      <h2 className="mx-auto my-20 text-center text-5xl font-extrabold">
        Événements
      </h2>
      <div className="flex flex-wrap justify-center gap-5">
        {TicketCreated &&
          TicketCreated.map(({ contractAddr, name, owner }, idx) => (
            <EventCard
              key={idx}
              text={`${contractAddr} - ${owner}`}
              title={name}
              href={`event/${idx}`}
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
