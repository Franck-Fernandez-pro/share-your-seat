import { useInput } from '@/hooks';
import { FC } from 'react';

interface Props {}

const CreateEventForm: FC<Props> = ({}) => {
  const { props: nameField, setValue: setName } = useInput<string>('');
  const { props: CIDField, setValue: setCID } = useInput<string>('');
  const { props: ticketPricesField, setValue: setTicketPrices } =
    useInput<string>('');
  const { props: availableTicketsField, setValue: setAvailableTickets } =
    useInput<string>('');

  function handleSubmit() {
    const ticketPrices = ticketPricesField.value
      .split(',')
      .map((i) => parseInt(i));
    const availableTickets = availableTicketsField.value
      .split(',')
      .map((i) => parseInt(i));
  }

  return (
    <div className="p-10">
      {/* <ApiKeysForm />
      <div className="divider" />
      <PinMetadata />
      <div className="divider" /> */}

      <div>
        <h2 className="text-2xl font-bold">
          Ajouter les informations de l'événement
        </h2>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Nom</span>
          </label>
          <input
            className="input input-bordered"
            type="text"
            required
            {...nameField}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">CID IPFS</span>
          </label>
          <input
            className="input input-bordered"
            type="text"
            required
            {...CIDField}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Prix des tickets</span>
          </label>
          <input
            className="input input-bordered"
            type="text"
            placeholder="10,15,50"
            required
            {...ticketPricesField}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Places disponibles par ticket</span>
          </label>
          <input
            className="input input-bordered"
            type="text"
            placeholder="100,50,20"
            required
            {...availableTicketsField}
          />
        </div>

        <button className="btn btn-primary mt-5" onClick={handleSubmit}>
          Créer
        </button>
      </div>
    </div>
  );
};

export default CreateEventForm;
