import Link from 'next/link';
import { FC } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface Props {}

const Navbar: FC<Props> = ({}) => (
  <div className="navbar bg-base-100">
    <div className="navbar-start">
      <Link href="/" className="btn btn-ghost text-xl normal-case">
        Share Your Seat
      </Link>
    </div>
    <div className="navbar-center hidden lg:flex">
      {/* <ul className="menu menu-horizontal px-1">
        <li>
          <Link href="/">Accueil</Link>
        </li>
      </ul> */}
    </div>
    <div className="navbar-end">
      <ConnectButton />
    </div>
  </div>
);

export default Navbar;
