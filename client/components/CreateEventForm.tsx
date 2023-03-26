import { useInput } from '@/hooks';
import { FC } from 'react';

interface Props {}

const CreateEventForm: FC<Props> = ({}) => {
  const { props: eventNameField, setValue: setEventName } =
    useInput<string>('');
  const { props: eventDescriptionField, setValue: setEventDescription } =
    useInput<string>('');

  function handleSubmit() {
    console.group('handleSubmit');
    console.log('eventName', eventNameField.value);
    console.log('eventDescription', eventDescriptionField.value);
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
            {...eventNameField}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            className="textarea textarea-bordered textarea-lg"
            placeholder="En 2024, ..."
            {...eventDescriptionField}
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
