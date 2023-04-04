import { useEffect } from 'react';
import { useInput } from '@/hooks';

function ApiKeysForm({}: {}) {
  const { props: publicField, setValue: setPublic } = useInput<string>('');
  const { props: secretField, setValue: setSecret } = useInput<string>('');

  useEffect(() => {
    const KEY = localStorage.getItem('PINATA_API_KEY') || '';
    const SECRET = (localStorage.PINATA_SECRET_API_KEY =
      localStorage.getItem('PINATA_SECRET_API_KEY') || '');

    setPublic(KEY);
    setSecret(SECRET);
  }, []);

  function handleSave() {
    localStorage.setItem('PINATA_API_KEY', publicField.value);
    localStorage.setItem('PINATA_SECRET_API_KEY', secretField.value);
  }

  return (
    <div>
      <h2 className="text-2xl font-bold">Ajouter vos clés API Pinata</h2>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Clé public</span>
        </label>
        <input
          className="input input-bordered"
          type="text"
          required
          {...publicField}
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Clé privée</span>
        </label>
        <input
          className="input input-bordered"
          type="password"
          required
          {...secretField}
        />
      </div>

      <button className="btn btn-primary mt-5" onClick={handleSave}>
        Sauvegarder
      </button>
    </div>
  );
}

export default ApiKeysForm;
