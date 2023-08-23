const { deployments, ethers } = require("hardhat")
async function main() {
    deployer = (await getNamedAccounts()).deployer
    let myContract = await deployments.get("FundMe");
    deployer = (await getNamedAccounts()).deployer
    let fundMe = await ethers.getContractAt(
        myContract.abi,
        myContract.address
    );
    const transactionresponse = await fundMe.withdraw()
    console.log("you successfully funded the contract")
}
main()