import { ethers } from 'hardhat';

async function main() {
  const TicketFactory = await ethers.getContractFactory('TicketFactory');
  const ticketFactory = await TicketFactory.deploy();
  await ticketFactory.deployed();
  const Marketplace = await ethers.getContractFactory('Marketplace');
  const marketplace = await Marketplace.deploy();
  await marketplace.deployed();

  console.log(`ticketFactory deployed to ${ticketFactory.address}`);
  console.log(`marketplace deployed to ${marketplace.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
