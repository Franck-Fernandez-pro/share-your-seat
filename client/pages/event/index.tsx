import CreateEventForm from '@/components/CreateEventForm';
import Events from '@/components/Events';
import Head from 'next/head';
import { FC } from 'react';

interface Props {}

const Event: FC<Props> = ({}) => (
  <>
    <Head>
      <title>Événement</title>
    </Head>

    <main>
      <section id="create-event" className="hero bg-base-200 p-20">
        <div className="hero-content flex-row">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-extrabold">Créer un événement</h1>
            <p className="py-6">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>
          </div>
        </div>
      </section>
      <CreateEventForm />

      <Events />
    </main>
  </>
);

export default Event;
