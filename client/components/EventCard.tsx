import { FC, MouseEvent } from 'react';

interface Props {
  title: string;
  text: string;
  imgSrc?: string;
  btnText?: string;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

const EventCard: FC<Props> = ({
  title = '',
  text = '',
  imgSrc = 'https://picsum.photos/1500/1000',
  btnText = 'En savoir plus',
  onClick,
}) => (
  <div className="card bg-base-100 w-80 shadow-xl">
    <figure>
      <img className="max-h-64 object-fill" src={imgSrc} alt="" />
    </figure>
    <div className="card-body">
      <h2 className="card-title">{title}</h2>
      <p>{text}</p>
      {onClick && (
        <div className="card-actions mt-5 justify-end">
          <button className="btn btn-primary btn-sm" onClick={onClick}>
            {btnText}
          </button>
        </div>
      )}
    </div>
  </div>
);

export default EventCard;
