    //require("@nomiclabs/hardhat-ethers");
    require("@nomiclabs/hardhat-waffle");

    const PRIVATE_KEY = "c524e29cc8923a1104ac9e41007aa97b4cdaaae3295982d0447654c97ca92a07";


    module.exports = {
        solidity: "0.8.24",
        networks: {
          mainnet: {
            url: `https://eth-sepolia.g.alchemy.com/v2/gaSqGc4gDONKTkGJcXdHe3BJnwgdov9c`,
              accounts: [`${PRIVATE_KEY}`]
          },
          fuji: {
            url: `https://eth-sepolia.g.alchemy.com/v2/gaSqGc4gDONKTkGJcXdHe3BJnwgdov9c`,
              accounts: [`${PRIVATE_KEY}`]
          }
        }
    };
