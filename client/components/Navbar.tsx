import Link from 'next/link';
import { FC } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useRouter } from 'next/router';

interface Props {}

const Navbar: FC<Props> = ({}) => {
  const { pathname } = useRouter();
 
  return (
    <div
      className={`navbar sticky ${
        pathname === '/' ? 'text-neutral-content' : ''
      }`}
    >
      <div className="navbar-start">
        <Link href="/" className="btn btn-ghost text-xl normal-case">
          Share Your Seat
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/event">Événements</Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <ConnectButton chainStatus="name" />
      </div>
    </div>
  );
};

export default Navbar;
