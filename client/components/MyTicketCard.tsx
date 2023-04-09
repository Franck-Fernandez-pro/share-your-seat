import { FC, useEffect, useState } from 'react';
import { useCollection, useInput, useMarketplace } from '@/hooks';
import { toast } from 'react-toastify';

interface Props {
  uri: string;
  id: string;
  addr: string;
  balance: number;
}

const MyTicketCard: FC<Props> = ({ id, addr, uri, balance }) => {
  const { props: amountField, setValue: setAmount } = useInput<number>(0);
  const { props: toField, setValue: setToField } = useInput<string>('');
  const { transfer, setApprovalForAll } = useCollection(addr);
  const { deposit } = useMarketplace();
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
    try {
      const response = await fetch(uri);
      const data = await response.json();
      setData(data);
    } catch (error) {}
  }

  async function handleSend() {
    if (amountField.value > balance) {
      toast.warning(`Vous pouvez envoyer au maximum ${balance} ticket(s)`);
      return;
    }

    if (toField.value === '') {
      toast.warning(`Veuillez entrer un destinataire valide`);
      return;
    }

    await transfer(toField.value, parseInt(id), amountField.value);
    setAmount(0);
    setToField('');
  }

  async function handleDeposit() {
    await setApprovalForAll();
    await deposit(addr, parseInt(id));
  }

  return balance > 0 ? (
    <div className="card bg-base-100 max-h-[550px] w-80 shadow-xl">
      <div className="card-body items-center text-center">
        <h2 className="card-title self-left mb-5">{data.type}</h2>
        <p>{balance} place(s)</p>
        <div className="collapse collapse-arrow w-full rounded-lg bg-gray-100 font-medium">
          <input type="checkbox" />
          <div className="collapse-title">Envoyer</div>
          <div className="collapse-content">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Montant</span>
              </label>

              <input
                className="input input-sm w-full max-w-xs"
                type="number"
                required
                {...amountField}
                min="1"
                max={balance}
              />
            </div>

            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Destinataire</span>
              </label>
              <input
                className="input input-sm w-full"
                type="text"
                placeholder="0x1b8D2I..."
                required
                {...toField}
              />
            </div>

            <button
              className="btn btn-primary btn-sm mt-3"
              onClick={handleSend}
              disabled={amountField.value === 0 || toField.value === ''}
            >
              Envoyer
            </button>
          </div>
        </div>
        <button className="btn btn-primary btn-sm mt-3" onClick={handleDeposit}>
          Mettre en vente 1 ticket
        </button>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default MyTicketCard;
