import { TicketFactoryContext } from '@/contexts/TicketFactory';
import { FC, useContext, useEffect } from 'react';
import { AiOutlineReload } from 'react-icons/ai';
import { useAccount } from 'wagmi';

interface Props {}

const MyTickets: FC<Props> = ({}) => {
  const { address } = useAccount();
  const {
    collections,
    handler: { fetchCollections },
  } = useContext(TicketFactoryContext);

  return address ? (
    <section id="tickets">
      <h2 className="mx-auto my-20 text-center text-5xl font-extrabold">
        Tickets
        <button className="ml-5" onClick={fetchCollections}>
          <AiOutlineReload className="h-5 w-5" />
        </button>
      </h2>
      <div className="flex flex-wrap justify-center gap-5">
        {collections && collections.map((c, idx) => <p key={idx}>{c}</p>)}
      </div>
    </section>
  ) : (
    <p>Connectez vous</p>
  );
};

export default MyTickets;
