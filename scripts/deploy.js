const main = async () => {
    const FrensContractFactory = await hre.ethers.getContractFactory('Frens');
    const frensContract = await FrensContractFactory.deploy();
    await frensContract.deployed();

    console.log("Contract deployed to:", frensContract.address);
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

runMain();