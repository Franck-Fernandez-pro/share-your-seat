import { useInput } from '@/hooks';
import { FC, MouseEvent, useEffect, useState } from 'react';

interface Props {
  uri: string;
  id: string;
  onMint: (ticketId: number, amount: number) => void;
}

const TicketCard: FC<Props> = ({ uri = '', onMint, id }) => {
  const { props: amountProps } = useInput<string>('');
  const [data, setData] = useState({
    name: 'qsd',
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
    try {
      const response = await fetch(uri);
      const data = await response.json();
      setData(data);
    } catch (error) {}
  }

  function handleMint(e: MouseEvent<HTMLButtonElement>) {
    onMint && onMint(parseInt(e.currentTarget.id), parseInt(amountProps.value));
  }

  return data.name ? (
    <div className="card bg-base-100 w-80 shadow-xl">
      <figure>
        <img className="max-h-64 object-fill" src={data.image} alt="" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{data.type}</h2>

        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Montant à mint</span>
            <span className="label-text-alt">
              {data.properties.price} Wei/place
            </span>
          </label>

          <input
            className="input input-bordered input-sm"
            type="number"
            placeholder="1"
            {...amountProps}
          />

          <div className="card-actions mt-5 justify-end">
            <button
              id={id}
              className="btn btn-primary btn-sm"
              onClick={handleMint}
            >
              Mint
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default TicketCard;
