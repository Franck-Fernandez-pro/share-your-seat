import { ethers } from 'hardhat';

async function main() {
  const TicketFactory = await ethers.getContractFactory('TicketFactory');
  const ticketFactory = await TicketFactory.deploy();
  await ticketFactory.deployed();

  console.log(`ticketFactory deployed to ${ticketFactory.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
