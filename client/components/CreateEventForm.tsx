import { useInput } from '@/hooks';
import { FC } from 'react';

interface Props {}

const CreateEventForm: FC<Props> = ({}) => {
  const { props: nameField, setValue: setName } = useInput<string>('');
  const { props: descriptionField, setValue: setDescription } =
    useInput<string>('');
  const { props: dateField, setValue: setDate } = useInput<string>('');
  const { props: addressField, setValue: setAddress } = useInput<string>('');

  function handleSubmit() {
    console.group('handleSubmit');
    console.log('name', nameField.value);
    console.log('descriptionField', descriptionField.value);
    console.log('date', dateField.value);
    console.log('address', addressField.value);
    console.groupEnd();
  }

  return (
    <div className="card bg-base-100 w-full max-w-sm flex-shrink-0 shadow-2xl">
      <div className="card-body">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Nom</span>
          </label>
          <input
            className="input input-bordered"
            type="text"
            placeholder="Jeux olympiques"
            {...nameField}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            className="textarea textarea-bordered textarea-lg"
            placeholder="En 2024, ..."
            {...descriptionField}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Date</span>
          </label>
          <input
            className="input input-bordered"
            type="datetime-local"
            {...dateField}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Adresse</span>
          </label>
          <input
            className="input input-bordered"
            type="text"
            placeholder="12 rue..."
            {...addressField}
          />
        </div>

        <div className="form-control mt-6">
          <button className="btn btn-primary" onClick={handleSubmit}>
            Créer
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateEventForm;
