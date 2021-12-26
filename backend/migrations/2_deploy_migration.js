const Election = artifacts.require("Election");

module.exports = async function (deployer, network, accounts) {
  // deployment steps
  await deployer.deploy(Election);
};