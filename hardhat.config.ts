import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
    },
    L16: {
      url: "https://rpc.l16.lukso.network",
      accounts: ["68ff865b5ea9671056334f78b3a60e0d534a219e7387705bd39a76b68f0888b8"]
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
      accounts: ["037abee6bb017d5d20eaf8b4d99d1806ff932ee2aa21fb389aeedcb8b006345b"]
    }
  },
  defaultNetwork: "L16",
};

export default config;
