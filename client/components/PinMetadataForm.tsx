import { ChangeEvent, useState } from 'react';
import axios from 'axios';
import { useInput } from '@/hooks';

function PinMetadata({}: {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { props: nameField, setValue: setName } = useInput<string>('');
  // const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [jsonFile, setJsonFile] = useState(null);

  // const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   //@ts-ignore
  //   setImageFiles(Array.from(e.currentTarget.files));
  // };

  const handleJsonChange = (e: ChangeEvent<HTMLInputElement>) => {
    // @ts-ignore
    setJsonFile(e.currentTarget.files[0]);
  };

  const handleUploadJson = async () => {
    setLoading(true);

    const formData = new FormData();
    jsonFile && formData.append('file', jsonFile);

    try {
      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        formData,
        {
          headers: {
            pinata_api_key: 'YOUR_PINATA_API_KEY',
            pinata_secret_api_key: 'YOUR_PINATA_SECRET_API_KEY',
          },
        }
      );

      console.log('Pinata response:', response.data);

      setLoading(false);
      setSuccess(true);
      setError(null);
    } catch (error) {
      console.error('Error uploading JSON to Pinata:', error);

      setLoading(false);
      setSuccess(false);
      // @ts-ignore
      setError(error.message);
    }
  };
  // const handleUploadImage = async () => {
  //   const pinata_api_key = localStorage.getItem('PINATA_API_KEY');
  //   const pinata_secret_api_key = localStorage.getItem('PINATA_SECRET_API_KEY');
  //   setLoading(true);
  //   const formData = new FormData();
  //   const metadata = JSON.stringify({
  //     name: 'Folder name',
  //   });
  //   imageFiles.forEach((file) => {
  //     formData.append('file', file);
  //   });

  //   formData.append('pinataMetadata', metadata);

  //   try {
  //     const response = await axios.post(
  //       'https://api.pinata.cloud/pinning/pinFileToIPFS',
  //       formData,
  //       {
  //         // @ts-ignore
  //         maxBodyLength: 'Infinity',
  //         headers: {
  //           pinata_api_key: pinata_api_key,
  //           pinata_secret_api_key: pinata_secret_api_key,
  //           // @ts-ignore
  //           'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
  //         },
  //       }
  //     );

  //     console.log('Pinata response:', response.data);

  //     setLoading(false);
  //     setSuccess(true);
  //     setError(null);
  //   } catch (error) {
  //     console.error('Error uploading image to Pinata:', error);

  //     setLoading(false);
  //     setSuccess(false);
  //     //@ts-ignore
  //     setError(error.message);
  //   }
  // };

  return (
    <div>
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
          <span className="label-text">Images</span>
        </label>
        <input
          className="file-input file-input-sm w-full max-w-xs"
          type="file"
          accept=".json"
          onChange={handleJsonChange}
        />
      </div>
      {/* <div className="form-control">
        <label className="label">
          <span className="label-text">Images</span>
        </label>
        <input
          className="file-input file-input-sm w-full max-w-xs"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />
      </div> */}

      <div className="form-control mt-6">
        <button
          className="btn btn-primary"
          onClick={handleUploadJson}
          disabled={loading || success}
        >
          Pin NFT Metadata to Pinata
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {success && <p>Successfully pinned NFT metadata to Pinata!</p>}
    </div>
  );
}

export default PinMetadata;
