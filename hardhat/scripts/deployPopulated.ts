import { ethers } from 'hardhat';

async function main() {
  const TicketFactory = await ethers.getContractFactory('TicketFactory');
  const ticketFactory = await TicketFactory.deploy();
  await ticketFactory.deployed();
  await ticketFactory.deployTicket(
    'JO Paris',
    'https://ipfs.io/QmcC4iTuhzzyfyUecGbBVY7KMwJy9Vcd54QmLHDWtdCsCe/',
    [50],
    [100]
  );

  console.log(`ticketFactory deployed to ${ticketFactory.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
