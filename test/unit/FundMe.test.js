// const { assert, expect } = require("chai")
// const { deployments, ethers } = require("hardhat")
// const { developmentchains } = require("../../helper-hardhat-config")
// developmentchains.includes(network.name)
//     ? describe("FundMe", async function () {
//         let fundMe, MockV3Aggregator, deployer, myContract, myContract1
//         let sentvalue = ethers.parseEther("1")
//         beforeEach(async function () {

//             await deployments.fixture(["all"]);

//             myContract = await deployments.get("FundMe");
//             deployer = (await getNamedAccounts()).deployer
//             fundMe = await ethers.getContractAt(
//                 myContract.abi,
//                 myContract.address
//             );

//             myContract1 = await deployments.get("MockV3Aggregator");

//             MockV3Aggregator = await ethers.getContractAt(
//                 myContract1.abi,
//                 myContract1.address
//             );
//         })


//         describe("constructor", async function () {
//             it("sets the aggregator address correctly", async function () {
//                 const response = await fundMe.getPriceFeed()
//                 assert.equal(response, myContract1.address)
//             })
//         })

//         describe("fund", async function () {
//             it("it fails if you dont send any enough eth", async function () {
//                 await expect(fundMe.fund()).to.be.reverted
//             })
//             it("The amount sent by the sender should be equal to the amount stored in the data structure", async function () {
//                 await fundMe.fund({ value: sentvalue })
//                 const valuestored = await fundMe.getAddressToAmountFunded(deployer)
//                 assert.equal(valuestored.toString(), sentvalue.toString())
//             })
//             it("checks if the funder is added into the array", async function () {
//                 await fundMe.fund({ value: sentvalue })
//                 const funder = await fundMe.getFunder(0)
//                 assert.equal(deployer.toString(), funder.toString())
//             })

//         })

//         describe("withdraw", async function () {
//             beforeEach(async function () {
//                 await fundMe.fund({ value: sentvalue })
//             })
//             it("withdrawl is checked between contract and deployer", async function () {

//                 // arrange
//                 let startingcontractbalance = await ethers.provider.getBalance(myContract.address)
//                 let startingdeployerbalance = await ethers.provider.getBalance(deployer)

//                 // act
//                 const transactionresponse = await fundMe.withdraw()
//                 const transactionrecipt = await transactionresponse.wait(1)
//                 const { gasUsed, gasPrice } = transactionrecipt;

//                 // Convert gasUsed and effectiveGasPrice to BigInt
//                 const gasUsedBigInt = BigInt(gasUsed);
//                 const gasPriceBigInt = BigInt(gasPrice);

//                 // Multiply the BigInt values
//                 const gascost = gasUsedBigInt * gasPriceBigInt;

//                 let endingcontractbalance = await ethers.provider.getBalance(myContract.address)
//                 let endingdeployerbalance = await ethers.provider.getBalance(deployer)

//                 // assert
//                 assert.equal(endingcontractbalance, BigInt(0))
//                 assert.equal((startingdeployerbalance + startingcontractbalance).toString(), (endingdeployerbalance + gascost).toString())
//                 // console.log(endingcontractbalance)
//                 // console.log(startingdeployerbalance)
//                 // console.log(startingcontractbalance)
//                 // console.log(endingdeployerbalance)
//                 // console.log(gascost)
//                 // console.log(startingdeployerbalance + startingcontractbalance)
//                 // console.log(endingdeployerbalance + gascost)
//             })
//             it("is allows us to withdraw with multiple funders", async function () {
//                 let accounts = await ethers.getSigners()
//                 for (var i = 1; i < 6; i++) {
//                     const connection = await fundMe.connect(accounts[i])
//                     await connection.fund({ value: sentvalue })
//                 }

//                 let startingcontractbalance = await ethers.provider.getBalance(myContract.address)
//                 let startingdeployerbalance = await ethers.provider.getBalance(deployer)

//                 const transactionresponse = await fundMe.withdraw()
//                 const transactionrecipt = await transactionresponse.wait(1)
//                 const { gasUsed, gasPrice } = transactionrecipt;

//                 const gasUsedBigInt = BigInt(gasUsed);
//                 const gasPriceBigInt = BigInt(gasPrice);

//                 // Multiply the BigInt values
//                 const gascost = gasUsedBigInt * gasPriceBigInt;

//                 let endingcontractbalance = await ethers.provider.getBalance(myContract.address)
//                 let endingdeployerbalance = await ethers.provider.getBalance(deployer)

//                 // assert
//                 assert.equal(endingcontractbalance, BigInt(0))
//                 assert.equal((startingdeployerbalance + startingcontractbalance).toString(), (endingdeployerbalance + gascost).toString())

//                 for (var i = 1; i < 6; i++) {
//                     assert.equal(await fundMe.getAddressToAmountFunded(accounts[i]), 0)
//                 }
//             })
//             it("only owner can withdraw the funds", async function () {
//                 let accounts = await ethers.getSigners()
//                 let attacker = accounts[2]
//                 let connection = fundMe.connect(attacker)
//                 await expect(connection.withdraw()).to.be.reverted
//             })
//         })


//     })
//     : describe.skip


const { assert, expect } = require("chai");
const { deployments, ethers } = require("hardhat");
const { developmentchains } = require("../../helper-hardhat-config");

developmentchains.includes(network.name) ? describe("FundMe", function () {
    let fundMe, MockV3Aggregator, deployer, myContract, myContract1;
    const sentValue = ethers.parseEther("1");

    beforeEach(async function () {
        await deployments.fixture(["all"]);

        myContract = await deployments.get("FundMe");
        deployer = (await getNamedAccounts()).deployer;
        fundMe = await ethers.getContractAt(myContract.abi, myContract.address);

        myContract1 = await deployments.get("MockV3Aggregator");
        MockV3Aggregator = await ethers.getContractAt(myContract1.abi, myContract1.address);
    });

    describe("constructor", function () {
        it("sets the aggregator address correctly", async function () {
            assert.equal(await fundMe.getPriceFeed(), myContract1.address);
        });
    });

    describe("fund", function () {
        it("fails if you don't send enough ETH", async function () {
            await expect(fundMe.fund()).to.be.reverted;
        });

        it("stores the correct amount and adds the funder to the array", async function () {
            await fundMe.fund({ value: sentValue });

            assert.equal((await fundMe.getAddressToAmountFunded(deployer)).toString(), sentValue.toString());
            assert.equal(await fundMe.getFunder(0), deployer);
        });
    });

    describe("withdraw", function () {
        beforeEach(async function () {
            await fundMe.fund({ value: sentValue });
        });

        it("checks withdrawal between contract and deployer", async function () {
            // ... (unchanged)

            assert.equal(endingcontractbalance, BigInt(0));
            assert.equal((startingdeployerbalance + startingcontractbalance).toString(), (endingdeployerbalance + gascost).toString());
        });

        it("allows withdrawing with multiple funders", async function () {
            let accounts = await ethers.getSigners();
            for (var i = 1; i < 6; i++) {
                await fundMe.connect(accounts[i]).fund({ value: sentValue });
            }

            // ... (unchanged)

            assert.equal(endingcontractbalance, BigInt(0));
            assert.equal((startingdeployerbalance + startingcontractbalance).toString(), (endingdeployerbalance + gascost).toString());

            for (var i = 1; i < 6; i++) {
                assert.equal(await fundMe.getAddressToAmountFunded(accounts[i]), 0);
            }
        });

        it("only owner can withdraw the funds", async function () {
            let accounts = await ethers.getSigners();
            let attacker = accounts[2];
            let connection = fundMe.connect(attacker);
            await expect(connection.withdraw()).to.be.reverted;
        });
    });
}) : describe.skip;
