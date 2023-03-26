import { FC } from 'react';
import HomeBGImage from '@/assets/home-bg.jpg';

interface Props {}

const Intro: FC<Props> = ({}) => (
  <div
    className="hero min-h-[730px]"
    style={{
      backgroundImage: `url("${HomeBGImage.src}")`,
    }}
  >
    <div className="hero-overlay bg-opacity-60"></div>
    <div className="hero-content text-neutral-content text-center">
      <div className="max-w-md">
        <h1 className="mb-5 text-5xl font-bold">Share Your Seat</h1>
        <p className="mb-5">
          Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
          excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a
          id nisi.
        </p>
        <a className="btn btn-primary" href="#events">
          Commencer
        </a>
      </div>
    </div>
  </div>
);

export default Intro;
