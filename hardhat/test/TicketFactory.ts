import { expect } from 'chai';
import { ethers } from 'hardhat';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';

const eventName = 'My Event';
const uri = 'https://ipfs.io/QmSx6g3q6zweDydyfS9XLYPcbJo47e2QY1Z4K4xQxupzjd/';
const ticketPrices = [10, 20, 30];
const availableTickets = [100, 200, 300];

async function deployTicketFactoryFixture() {
  const TicketFactory = await ethers.getContractFactory('TicketFactory');
  const ticketFactory = await TicketFactory.deploy();
  await ticketFactory.deployed();

  const [owner, other] = await ethers.getSigners();
  const ownerAddr = await owner.getAddress();
  const otherAddr = await other.getAddress();

  return { ticketFactory, owner, ownerAddr, other, otherAddr };
}

describe('TicketFactory', () => {
  describe('deployTicket', () => {
    it('should store deployed ERC-1155 address in sftCollections', async () => {
      const { ticketFactory } = await loadFixture(deployTicketFactoryFixture);
      const response = await ticketFactory.deployTicket(
        eventName,
        uri,
        ticketPrices,
        availableTickets
      );
      const receipt = await response.wait();
      const event =
        receipt.events &&
        receipt.events.find(({ event }) => event === 'TicketCreated');
      const collectionAddress = event?.args ? event.args.collectionAddress : '';
      const contractAddress = await ticketFactory.sftCollections(0);

      expect(contractAddress).to.equal(collectionAddress);
    });

    it('should deploy a new ERC-1155 with right args', async () => {
      const { ticketFactory } = await loadFixture(deployTicketFactoryFixture);
      await ticketFactory.deployTicket(
        eventName,
        uri,
        ticketPrices,
        availableTickets
      );
      const contractAddress = await ticketFactory.sftCollections(0);
      const TicketSFTFactory = await ethers.getContractFactory('TicketSFT');
      const ticketSFT = TicketSFTFactory.attach(contractAddress);

      const name = await ticketSFT.name();
      const baseMetadataURI = await ticketSFT.baseMetadataURI();
      const availableTs0 = await ticketSFT.availableTickets(0);
      const availableTs1 = await ticketSFT.availableTickets(1);
      const availableTs2 = await ticketSFT.availableTickets(2);

      expect(name).to.equal(eventName);
      expect(baseMetadataURI).to.equal(uri);
      expect(availableTs0).to.equal(availableTickets[0]);
      expect(availableTs1).to.equal(availableTickets[1]);
      expect(availableTs2).to.equal(availableTickets[2]);
    });

    it('should emit TicketCreated event', async () => {
      const { ticketFactory, ownerAddr } = await loadFixture(
        deployTicketFactoryFixture
      );
      const response = await ticketFactory.deployTicket(
        eventName,
        uri,
        ticketPrices,
        availableTickets
      );
      const receipt = await response.wait();
      const event =
        receipt.events &&
        // @ts-ignore
        receipt.events.find(({ event }) => event === 'TicketCreated');
      const collectionAddress = event?.args ? event.args.collectionAddress : '';

      await expect(response)
        .to.emit(ticketFactory, 'TicketCreated')
        .withArgs(ownerAddr, collectionAddress, eventName);
    });

    describe('Revert', () => {
      it('should revert when missing _eventName', async () => {
        const { ticketFactory } = await loadFixture(deployTicketFactoryFixture);
        await expect(
          ticketFactory.deployTicket('', uri, ticketPrices, availableTickets)
        ).to.be.revertedWith('_eventName is empty');
      });

      it('should revert when missing _uri', async () => {
        const { ticketFactory } = await loadFixture(deployTicketFactoryFixture);
        await expect(
          ticketFactory.deployTicket(
            eventName,
            '',
            ticketPrices,
            availableTickets
          )
        ).to.be.revertedWith('_uri is empty');
      });

      it('should revert when missing _ticketPrices', async () => {
        const { ticketFactory } = await loadFixture(deployTicketFactoryFixture);
        await expect(
          ticketFactory.deployTicket(eventName, uri, [], availableTickets)
        ).to.be.revertedWith('You should have at least one ticket');
      });

      it('should revert when missing _availableTickets', async () => {
        const { ticketFactory } = await loadFixture(deployTicketFactoryFixture);
        await expect(
          ticketFactory.deployTicket(eventName, uri, ticketPrices, [])
        ).to.be.revertedWith('You should have at least one ticket');
      });

      it('should revert when _ticketPrices !== _availableTickets', async () => {
        const { ticketFactory } = await loadFixture(deployTicketFactoryFixture);
        await expect(
          ticketFactory.deployTicket(eventName, uri, [1, 2], [1])
        ).to.be.revertedWith('Provided array have not same length');
      });
    });
  });
});
