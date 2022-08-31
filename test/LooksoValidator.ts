import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "@ethersproject/contracts/src.ts/index"

describe("LooksoValidator", function () {
      it("Should timestamp a message and return the correct value", async function() {
        // runs once before the first test in this block
        const [owner, otherAccount] = await ethers.getSigners();
        const LooksoValidator = await ethers.getContractFactory("LooksoPostValidator");
        const looksoValidator = await LooksoValidator.deploy(owner.address);

        await looksoValidator.post("0xebd6f888b589f38ab6d5d1da951dcb2c8146ae589ab46d452a4a986e524c0512", "0xaa0b2cdbb4ac4db5cc71238d6f3f77edc521b0106152b420f4dd1d39b145b12a")

      })
})