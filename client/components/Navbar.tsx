import Link from 'next/link';
import { FC } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface Props {}

const Navbar: FC<Props> = ({}) => (
  <div className="navbar text-neutral-content sticky">
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
      <ConnectButton chainStatus="none" />
    </div>
  </div>
);

export default Navbar;
