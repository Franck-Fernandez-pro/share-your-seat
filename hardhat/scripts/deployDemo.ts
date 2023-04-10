import { ethers } from 'hardhat';

const name = 'Jo de Paris';
const uri =
  'https://gateway.pinata.cloud/ipfs/QmVwVuTS2jVUwvuzBr2oAWdhg5dJMtrE1Yhu7DSKv7YQYU/';

const ticketPrices = [
  ethers.BigNumber.from(1),
  ethers.BigNumber.from(2),
  ethers.BigNumber.from(3),
  ethers.BigNumber.from(4),
  ethers.BigNumber.from(5),
];
const ticketSupplies = [
  ethers.BigNumber.from(100),
  ethers.BigNumber.from(200),
  ethers.BigNumber.from(300),
  ethers.BigNumber.from(400),
  ethers.BigNumber.from(500),
];

async function main() {
  const TicketFactory = await ethers.getContractFactory('TicketFactory');
  const ticketFactory = await TicketFactory.deploy();
  await ticketFactory.deployed();
  const response = await ticketFactory.deployTicket(
    name,
    uri,
    ticketPrices,
    ticketSupplies
  );
  await response.wait();

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
