import { FC, MouseEvent, useEffect, useState } from 'react';
import { useCollection, useInput, useMarketplace } from '@/hooks';

interface Props {
  uri: string;
  id: string;
  onMint: (ticketId: number, amount: number, price: number) => void;
  addr: string;
}

const TicketCard: FC<Props> = ({ uri = '', onMint, id, addr }) => {
  const { props: amountProps } = useInput<string>('');
  const {
    getTicketPrice,
    getAvailableTicket,
    state: { ticketPrice, availableTickets },
  } = useCollection(addr);
  const { fetchSupply, supply, buy } = useMarketplace();
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
    getTicketPrice(parseInt(id));
    getAvailableTicket(parseInt(id));
    fetchSupply(addr, parseInt(id));
  }, []);

  async function fetchMetadata() {
    try {
      const response = await fetch(uri);
      const data = await response.json();
      setData(data);
    } catch (error) {}
  }

  function handleMint(e: MouseEvent<HTMLButtonElement>) {
    onMint &&
      onMint(
        parseInt(e.currentTarget.id),
        parseInt(amountProps.value),
        ticketPrice
      );
  }

  async function handleBuy(e: MouseEvent<HTMLButtonElement>) {
    await buy(addr, parseInt(e.currentTarget.id), supply.price);
    await fetchSupply(addr, parseInt(id));
  }

  return data.name ? (
    <div className="card bg-base-100 max-h-[550px] w-80 shadow-xl">
      <figure>
        <img className="object-fill" src={data.image} alt="" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{data.type}</h2>

        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Montant à mint</span>
            {ticketPrice && (
              <span className="label-text-alt">{ticketPrice} Wei/place</span>
            )}
          </label>

          <input
            className="input input-bordered input-sm"
            type="number"
            placeholder="1"
            {...amountProps}
          />
          {availableTickets >= 0 && (
            <label className="label">
              <span className="label-text-alt ml-auto">
                {availableTickets} places disponibles
              </span>
            </label>
          )}

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

        {supply.available > 0 ? (
          <>
            <div className="divider mb-0" />
            <div className="flex flex-row items-center">
              <div className="flex flex-col">
                <span className="label-text mb-2 text-lg font-bold">
                  Place d'occasion
                </span>
                <span className="label-text-alt">
                  {supply.available} places disponibles
                </span>
                <span className="label-text-alt">{supply.price} Wei/place</span>
              </div>

              <button
                className="btn btn-primary btn-sm ml-auto max-w-[100px] self-end"
                onClick={handleBuy}
                id={id}
              >
                Acheter 1 place
              </button>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  ) : (
    <></>
  );
};

export default TicketCard;
