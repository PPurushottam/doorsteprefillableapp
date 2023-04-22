const RefillContract = artifacts.require("RefillContract");

module.exports = function (deployer) {
  deployer.deploy(RefillContract);
};
