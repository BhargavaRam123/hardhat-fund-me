const { networkConfig, developmentchains } = require("../helper-hardhat-config");
const { network } = require("hardhat");
const { verify } = require("../utils/verify")
module.exports = async ({ getNamedAccounts, deployments }) => {
    var ethUsdPriceFeed
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    if (developmentchains.includes(network.name)) {
        const ethusdaggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeed = ethusdaggregator.address
    }
    else {
        ethUsdPriceFeed = networkConfig[chainId]["ethUsdPriceFeed"]
    }
    const FundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeed],
        log: true,
        waitConfirmations: network.config.blockConformations || 1,
    })
    log("____________________________________")
    log(`FundMe deployed at ${FundMe.address}`)

    if (!developmentchains.includes(network.name)) {
        await verify(FundMe.address, [ethUsdPriceFeed])
    }
}

module.exports.tags = ["all", "fundme"]