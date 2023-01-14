const { ethers } = require("hardhat");

async function main() {
    const BasicMarketplace = await ethers.getContractFactory("BasicMarketplace");
    
    const basicMarketplace = await BasicMarketplace.deploy();

    await basicMarketplace.deployed();

    console.log("BasicMarketplace deployed to: ", basicMarketplace.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })