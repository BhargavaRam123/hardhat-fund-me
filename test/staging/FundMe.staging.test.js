const { assert } = require("chai")
const { network, ethers, getNamedAccounts } = require("hardhat")
const { developmentchains } = require("../../helper-hardhat-config")
developmentchains.includes(network.name)
    ? describe.skip
    :
    describe("FundMe Staging Tests", function () {
        let deployer, myContract
        let fundMe
        const sendValue = ethers.parseEther("0.04")
        beforeEach(async function () {
            // await deployments.fixture(["all"]);
            myContract = await deployments.get("FundMe");
            deployer = (await getNamedAccounts()).deployer
            fundMe = await ethers.getContractAt(
                myContract.abi,
                myContract.address
            );
        })

        it("allows people to fund and withdraw", async function () {
            this.timeout(60000);
            const fundTxResponse = await fundMe.fund({ value: sendValue })
            await fundTxResponse.wait(1)
            const withdrawTxResponse = await fundMe.withdraw()
            await withdrawTxResponse.wait(1)

            const endingFundMeBalance = await ethers.provider.getBalance(
                myContract.address
            )
            console.log(
                endingFundMeBalance.toString() +
                " should equal 0, running assert equal..."
            )
            assert.equal(endingFundMeBalance.toString(), "0")
        })
    })