import { useRouter } from 'next/router';

const Event = () => {
  const router = useRouter();
  const { id } = router.query;

  return <p>Event: {id}</p>;
};

export default Event;
