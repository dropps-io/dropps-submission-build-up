import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-waffle";

const dotenv = require("dotenv")
dotenv.config()

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
    },
    L16: {
      url: "https://rpc.l16.lukso.network",
      accounts: [process.env.L16PRIVATEKEY as string]
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
      accounts: [process.env.RINKEBYPRIVATEKEY as string]
    }
  },
  defaultNetwork: "L16",
};

export default config;
