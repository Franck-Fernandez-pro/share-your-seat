import Head from 'next/head';
import { useRouter } from 'next/router';

const Event = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <Head>
        <title>Événement {id}</title>
      </Head>

      <p>Event: {id}</p>
    </>
  );
};

export default Event;
