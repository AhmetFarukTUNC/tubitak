    //require("@nomiclabs/hardhat-ethers");
    require("@nomiclabs/hardhat-waffle");

    const PRIVATE_KEY = "c524e29cc8923a1104ac9e41007aa97b4cdaaae3295982d0447654c97ca92a07";


    module.exports = {
        solidity: "0.8.20",
        networks: {
          mainnet: {
            url: `https://sepolia.infura.io/v3/c162e17fb4814354bff17441b72e4b3a`,
              accounts: [`${PRIVATE_KEY}`]
          },
          fuji: {
            url: `https://sepolia.infura.io/v3/c162e17fb4814354bff17441b72e4b3a`,
              accounts: [`${PRIVATE_KEY}`]
          }
        }
    };