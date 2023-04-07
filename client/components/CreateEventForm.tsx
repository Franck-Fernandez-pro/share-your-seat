import { TicketFactoryContext } from '@/contexts/TicketFactory';
import { useInput } from '@/hooks';
import { FC, useContext } from 'react';
import ApiKeysForm from './ApiKeysForm';
import PinMetadata from './PinMetadataForm';

interface Props {}

const CreateEventForm: FC<Props> = ({}) => {
  const { props: nameField, setValue: setName } = useInput<string>('');
  const { props: CIDField, setValue: setCID } = useInput<string>('');
  const { props: ticketPricesField, setValue: setTicketPrices } =
    useInput<string>('');
  const { props: availableTicketsField, setValue: setAvailableTickets } =
    useInput<string>('');
  const {
    handler: { deployEvent },
  } = useContext(TicketFactoryContext);

  function handleSubmit() {
    const ticketPrices = ticketPricesField.value
      .split('/')
      .map((i) => parseInt(i));
    const availableTickets = availableTicketsField.value
      .split('/')
      .map((i) => parseInt(i));

    deployEvent(
      nameField.value,
      `https://gateway.pinata.cloud/ipfs/${CIDField.value}/`,
      ticketPrices,
      availableTickets
    );
  }

  function handleDemo() {
    setName('Jo de Paris');
    setCID('QmVwVuTS2jVUwvuzBr2oAWdhg5dJMtrE1Yhu7DSKv7YQYU');
    setTicketPrices('1/2/3/4/5');
    setAvailableTickets('100/200/300/400/500');
  }

  return (
    <div className="mx-auto max-w-3xl p-10">
      {/* <div className=''>
        <ApiKeysForm />
        <div className="divider" />
        <PinMetadata />
        <div className="divider" />
      </div> */}

      <div className="[&_.form-control]:mb-5">
        <h2 className="mb-6 text-center text-2xl font-bold">
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
            <span className="label-text">CID Pinata</span>
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
            <span className="label-text">Prix des tickets en Wei</span>
          </label>
          <input
            className="input input-bordered"
            type="text"
            placeholder="10/15/50"
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
            placeholder="100/50/20"
            required
            {...availableTicketsField}
          />
        </div>

        <div className="text-center">
          <button
            className="btn btn-primary mx-auto mt-5"
            onClick={handleSubmit}
          >
            Créer
          </button>
          <button
            className="btn btn-secondary mx-auto mt-5 ml-5"
            onClick={handleDemo}
          >
            Demo
          </button>
        </div>
      </div>
      <div className="divider mt-5" />
    </div>
  );
};

export default CreateEventForm;
