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

    it('should set the availableTicketsLength correctly', async () => {
      const { ticketSFT } = await loadFixture(deployTicketSFTFixture);

      expect(await ticketSFT.availableTicketsLength()).to.equal(
        availableTickets.length
      );
    });

    it('should set the tickets prices correctly', async () => {
      const { ticketSFT } = await loadFixture(deployTicketSFTFixture);

      expect(await ticketSFT.ticketPrices(0)).to.equal(ticketPrices[0]);
      expect(await ticketSFT.ticketPrices(1)).to.equal(ticketPrices[1]);
      expect(await ticketSFT.ticketPrices(2)).to.equal(ticketPrices[2]);
    });

    describe('Revert', () => {
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
  });

  describe('uri', () => {
    it('should return the correct URI', async () => {
      const { ticketSFT } = await loadFixture(deployTicketSFTFixture);
      const tokenId = 123;
      const expectedURI = `${uri}${tokenId}.json`;

      expect(await ticketSFT.uri(tokenId)).to.equal(expectedURI);
    });
  });

  describe('mint()', () => {
    it('should mint the correct amount of tokens to the correct account', async () => {
      const { ticketSFT, ownerAddr } = await loadFixture(
        deployTicketSFTFixture
      );
      const tokenId = 0;
      const amount = 10;
      const tx = await ticketSFT.mint(ownerAddr, tokenId, amount, {
        value: ticketPrices[0] * amount,
      });

      expect(await ticketSFT.balanceOf(ownerAddr, tokenId)).to.equal(amount);
    });

    describe('Event', () => {
      it('should emit TicketCreated event', async () => {
        const { ticketSFT, ownerAddr } = await loadFixture(
          deployTicketSFTFixture
        );
        const tokenId = 0;
        const amount = 10;
        const response = await ticketSFT.mint(ownerAddr, tokenId, amount, {
          value: ticketPrices[0] * amount,
        });

        await expect(response)
          .to.emit(ticketSFT, 'TicketMinted')
          .withArgs(ownerAddr, ticketSFT.address, amount, tokenId);
      });
    });

    describe('Revert', () => {
      it('should revert without value', async () => {
        const { ticketSFT, ownerAddr } = await loadFixture(
          deployTicketSFTFixture
        );
        const tokenId = 0;
        const amount = 10;

        await expect(
          ticketSFT.mint(ownerAddr, tokenId, amount, { value: 0 })
        ).to.be.revertedWith('Not enough wei sended');
      });
    });
  });

  describe('mintBatch()', () => {
    it('should mintBatch the correct amount of tokens', async () => {
      const { ticketSFT, ownerAddr } = await loadFixture(
        deployTicketSFTFixture
      );
      const tokenIds = [0, 1];
      const amount = [10, 5];
      const price = amount[0] * ticketPrices[0] + amount[1] * ticketPrices[1];
      await ticketSFT.mintBatch(ownerAddr, tokenIds, amount, '0x', {
        value: price,
      });

      expect(await ticketSFT.balanceOf(ownerAddr, tokenIds[0])).to.equal(
        amount[0]
      );
      expect(await ticketSFT.balanceOf(ownerAddr, tokenIds[1])).to.equal(
        amount[1]
      );
    });

    describe('Event', () => {
      it('should emit TicketCreated event', async () => {
        const { ticketSFT, ownerAddr } = await loadFixture(
          deployTicketSFTFixture
        );
        const tokenIds = [0, 1];
        const amount = [10, 5];
        const price = amount[0] * ticketPrices[0] + amount[1] * ticketPrices[1];
        const response = await ticketSFT.mintBatch(
          ownerAddr,
          tokenIds,
          amount,
          '0x',
          {
            value: price,
          }
        );

        await expect(response)
          .to.emit(ticketSFT, 'TicketMintedBatch')
          .withArgs(ownerAddr, ticketSFT.address, amount, tokenIds);
      });
    });

    describe('Revert', () => {
      it('should revert without value', async () => {
        const { ticketSFT, ownerAddr } = await loadFixture(
          deployTicketSFTFixture
        );
        const tokenId = 0;
        const amount = 10;

        await expect(
          ticketSFT.mint(ownerAddr, tokenId, amount, { value: 0 })
        ).to.be.revertedWith('Not enough wei sended');
      });
    });
  });

  describe('withdraw()', () => {
    it('should emit TicketCreated event', async () => {
      const { ticketSFT, ownerAddr, owner } = await loadFixture(
        deployTicketSFTFixture
      );
      const amount = ethers.utils.parseEther('1.0');
      const balanceBeforeSend = await owner.getBalance();
      await owner.sendTransaction({
        to: ticketSFT.address,
        value: amount,
      });
      const balanceAfterSend = await owner.getBalance();
      await ticketSFT.withdraw(ownerAddr);
      const balanceAfterWithdraw = await owner.getBalance();

      expect(balanceBeforeSend).to.be.greaterThan(balanceAfterSend);
      expect(balanceAfterWithdraw).to.be.greaterThan(balanceAfterSend);
    });

    describe('Event', () => {
      it('should emit TicketCreated event', async () => {
        const { ticketSFT, ownerAddr, owner } = await loadFixture(
          deployTicketSFTFixture
        );
        await owner.sendTransaction({
          to: ticketSFT.address,
          value: ethers.utils.parseEther('1.0'), // Sends exactly 1.0 ether
        });
        const response = await ticketSFT.withdraw(ownerAddr);

        await expect(response)
          .to.emit(ticketSFT, 'Withdraw')
          .withArgs(ownerAddr, ethers.utils.parseEther('1.0'));
      });
    });

    describe('Revert', () => {
      it('should be onlyOwner', async () => {
        const { ticketSFT, other, otherAddr } = await loadFixture(
          deployTicketSFTFixture
        );
        await expect(
          ticketSFT.connect(other).withdraw(otherAddr)
        ).to.be.revertedWith('Ownable: caller is not the owner');
      });
    });
  });

  describe('collectionBalance()', () => {
    it('should return contract balance', async () => {
      const { ticketSFT, owner } = await loadFixture(deployTicketSFTFixture);
      const amount = ethers.utils.parseEther('1.0');
      await owner.sendTransaction({
        to: ticketSFT.address,
        value: amount,
      });
      const response = await ticketSFT.collectionBalance();

      expect(response).to.be.eq(amount);
    });
  });

  describe('receive()', () => {
    it('should emit Deposit event', async () => {
      const { ticketSFT, ownerAddr, owner } = await loadFixture(
        deployTicketSFTFixture
      );
      const amount = ethers.utils.parseEther('1.0');
      const response = await owner.sendTransaction({
        to: ticketSFT.address,
        value: amount,
      });

      await expect(response)
        .to.emit(ticketSFT, 'Deposit')
        .withArgs(ownerAddr, amount);
    });
  });

  // NOT WORKING
  // describe('fallback()', () => {
  //   it('should invoke the fallback function', async () => {
  //     const { ticketSFT, ownerAddr, owner } = await loadFixture(
  //       deployTicketSFTFixture
  //     );
  //     const response = await owner.sendTransaction({
  //       to: ticketSFT.address,
  //       data: "0x0000000000000"
  //     });

  //     await expect(response)
  //       .to.emit(ticketSFT, 'FallbackEvent')
  //       .withArgs(ownerAddr);
  //   });
  // });
});
