import { expect } from 'chai';
import { ethers } from 'hardhat';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { Marketplace, TicketSFT } from '../typechain-types';
import { Signer } from 'ethers';

const uri = 'https://ipfs.io/QmSx6g3q6zweDydyfS9XLYPcbJo47e2QY1Z4K4xQxupzjd/';
const name: string = 'My Event';
const ticketPrices = [ethers.utils.parseEther('1.0')];
const availableTickets = [100];

async function deployTicketSFTFixture() {
  const ticketSFTFactory = await ethers.getContractFactory('TicketSFT');
  const ticketSFT = await ticketSFTFactory.deploy(
    name,
    uri,
    ticketPrices,
    availableTickets
  );

  const [owner, other] = await ethers.getSigners();
  const ownerAddr = await owner.getAddress();
  const otherAddr = await other.getAddress();

  return { ticketSFT, owner, ownerAddr, other, otherAddr };
}

async function deployMarketplaceFixture() {
  const MarketplaceFactory = await ethers.getContractFactory('Marketplace');
  const marketplace = await MarketplaceFactory.deploy();

  const [owner, other] = await ethers.getSigners();
  const ownerAddr = await owner.getAddress();
  const otherAddr = await other.getAddress();

  return { marketplace, owner, ownerAddr, other, otherAddr };
}

describe('Marketplace', () => {
  let tSFT: TicketSFT;
  let mp: Marketplace;
  let own: Signer;
  let ownAddr: string;
  let oth: Signer;
  let othAddr: string;

  // Mint 1 token by owner and run
  beforeEach(async () => {
    const { ticketSFT, ownerAddr } = await loadFixture(deployTicketSFTFixture);
    await ticketSFT.mint(ownerAddr, 0, 1, {
      value: ticketPrices[0],
    });
    tSFT = ticketSFT;

    const { marketplace, other, otherAddr, owner } = await loadFixture(
      deployMarketplaceFixture
    );
    await tSFT.setApprovalForAll(marketplace.address, true);

    mp = marketplace;
    own = owner;
    ownAddr = ownerAddr;
    oth = other;
    othAddr = otherAddr;
  });

  describe('deposit()', () => {
    it('should update supply storage', async () => {
      await mp.deposit(tSFT.address, ownAddr, 0);
      const response = await mp.getSupply(tSFT.address, 0);
      expect(response.available).to.equal(1);
      expect(response.price).to.equal(ticketPrices[0]);
    });

    it('should emit Deposit event', async () => {
      const response = await mp.deposit(tSFT.address, ownAddr, 0);

      await expect(response)
        .to.emit(mp, 'Deposit')
        .withArgs(ownAddr, tSFT.address, 0, ticketPrices[0]);
    });
  });

  describe('buy()', () => {
    beforeEach(async () => {
      await mp.deposit(tSFT.address, ownAddr, 0);
    });

    it('should run safeTransferFrom owner to other', async () => {
      await mp.connect(oth).buy(tSFT.address, 0, { value: ticketPrices[0] });
      expect(await tSFT.balanceOf(othAddr, 0)).to.equal(1);
    });

    it('should emit Deposit event', async () => {
      const response = await mp
        .connect(oth)
        .buy(tSFT.address, 0, { value: ticketPrices[0] });

      await expect(response)
        .to.emit(mp, 'Buy')
        .withArgs(othAddr, ownAddr, tSFT.address, 0);
    });

    describe('Revert()', () => {
      it('should revert without money', async () => {
        await expect(
          mp.connect(oth).buy(tSFT.address, 0, { value: 0 })
        ).to.be.revertedWith('Not enough money sended');
      });
    });
  });

  describe('withdrawBalance()', () => {
    beforeEach(async () => {
      await mp.deposit(tSFT.address, ownAddr, 0);
      await mp.connect(oth).buy(tSFT.address, 0, { value: ticketPrices[0] });
    });

    it('should run safeTransferFrom owner to other', async () => {
      const balanceBefore = await own.getBalance();
      await mp.connect(own).withdrawBalance();
      const balanceAfter = await own.getBalance();

      expect(balanceAfter).to.greaterThan(balanceBefore);
    });

    it('should emit WithdrawBalance event', async () => {
      const response = await mp.connect(own).withdrawBalance();

      await expect(response)
        .to.emit(mp, 'WithdrawBalance')
        .withArgs(ownAddr, ticketPrices[0]);
    });
  });
});
