import { expect } from 'chai';
import { ethers } from 'hardhat';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';

const uri = 'https://ipfs.io/QmSx6g3q6zweDydyfS9XLYPcbJo47e2QY1Z4K4xQxupzjd/';
const name: string = 'My Event';
const ticketPrices = [10, 20, 30];
const availableTickets = [100, 200, 300];

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

describe('TicketSFT', () => {
  describe('constructor', () => {
    it('should set the name correctly', async () => {
      const { ticketSFT } = await loadFixture(deployTicketSFTFixture);
      expect(await ticketSFT.name()).to.equal(name);
    });

    it('should set the base metadata URI correctly', async () => {
      const { ticketSFT } = await loadFixture(deployTicketSFTFixture);
      expect(await ticketSFT.baseMetadataURI()).to.equal(uri);
    });

    it('should set the available tickets correctly', async () => {
      const { ticketSFT } = await loadFixture(deployTicketSFTFixture);

      expect(await ticketSFT.availableTickets(0)).to.equal(availableTickets[0]);
      expect(await ticketSFT.availableTickets(1)).to.equal(availableTickets[1]);
      expect(await ticketSFT.availableTickets(2)).to.equal(availableTickets[2]);
    });

    it('should revert if the ticket prices and available tickets array have different lengths', async () => {
      const ticketSFTFactory = await ethers.getContractFactory('TicketSFT');
      const invalidTicketPrices = [10, 20];
      const invalidAvailableTickets = [100, 200, 300];

      await expect(
        ticketSFTFactory.deploy(
          name,
          uri,
          invalidTicketPrices,
          invalidAvailableTickets
        )
      ).to.be.revertedWith('Provided array have not same length');
    });

    it('should revert if the URI is empty', async () => {
      const ticketSFTFactory = await ethers.getContractFactory('TicketSFT');

      await expect(
        ticketSFTFactory.deploy(name, '', ticketPrices, availableTickets)
      ).to.be.revertedWith('_uri is empty');
    });
  });

  describe('uri', () => {
    it('should return the correct URI', async () => {
      const { ticketSFT } = await loadFixture(deployTicketSFTFixture);
      const tokenId = 123;
      const expectedURI = `${uri}${tokenId}.json`;

      expect(await ticketSFT.uri(tokenId)).to.equal(expectedURI);
    });
  });

  describe('mint', () => {
    it('should mint the correct amount of tokens to the correct account', async () => {
      const { ticketSFT, ownerAddr, otherAddr } = await loadFixture(
        deployTicketSFTFixture
      );
      const tokenId = 0;
      const amount = 10;
      const tx = await ticketSFT.mint(otherAddr, tokenId, amount);

      expect(await ticketSFT.balanceOf(otherAddr, tokenId)).to.equal(amount);
      expect(tx)
        .to.emit(ticketSFT, 'TransferSingle')
        .withArgs(
          ownerAddr,
          ethers.constants.AddressZero,
          otherAddr,
          tokenId,
          amount
        );
    });
  });
});
