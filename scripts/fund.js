const { deployments, ethers } = require("hardhat")
async function main() {
    deployer = (await getNamedAccounts()).deployer
    let myContract = await deployments.get("FundMe");
    deployer = (await getNamedAccounts()).deployer
    let fundMe = await ethers.getContractAt(
        myContract.abi,
        myContract.address
    );
    var sentvalue = ethers.parseEther("0.1")
    const transactionresponse = await fundMe.fund({ value: sentvalue })
    console.log("you successfully funded the contract")
}
main()