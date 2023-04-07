import { FC, useEffect, useState } from 'react';
import { useCollection } from '@/hooks';

interface Props {
  uri: string;
  id: string;
  addr: string;
  balance: number;
}

const MyTicketCard: FC<Props> = ({ id, addr, uri, balance }) => {
  const {} = useCollection(addr);
  const [data, setData] = useState({
    name: '',
    description: '',
    image: '',
    type: '',
    properties: {
      address: '',
      date: '',
      price: '',
    },
  });

  useEffect(() => {
    fetchMetadata();
  }, []);

  async function fetchMetadata() {
    console.log('uri:', uri);
    try {
      const response = await fetch(uri);
      const data = await response.json();
      setData(data);
    } catch (error) {}
  }

  return balance > 0 ? (
    <div className="card bg-base-100 max-h-[550px] w-80 shadow-xl">
      <div className="card-body items-center text-center">
        <h2 className="card-title self-left mb-5">{data.type}</h2>
        <p>{balance} place(s)</p>
        <div className="card-actions mt-5 justify-end">
          <button className="btn btn-primary btn-sm">Envoyer</button>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default MyTicketCard;
