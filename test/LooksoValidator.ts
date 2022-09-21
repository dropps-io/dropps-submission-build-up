import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "@ethersproject/contracts/src.ts/index";

import { ERC725, ERC725JSONSchema} from '@erc725/erc725.js';
import erc725schema from '@erc725/erc725.js/schemas/LSP3UniversalProfileMetadata.json'; 

import KeyManager from '@lukso/lsp-smart-contracts/artifacts/LSP6KeyManager.json';
import LSP6Schema from "@erc725/erc725.js/schemas/LSP6KeyManager.json";
import { EncodeDataInput } from "@erc725/erc725.js/build/main/src/types/decodeData";
import UniversalProfile from "@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json";

require('dotenv').config();

describe("LooksoValidator", function () {
 before(async function() {
    // Get the provider
    const luksoProvider = ethers.getDefaultProvider("https://rpc.l16.lukso.network");
    // Get an address with LYXt that has permissions on a UP
    const wallet = new ethers.Wallet(process.env.L16PRIVATEKEY as string, luksoProvider)
    // Instantiate an UP
    const up = new ethers.Contract(process.env.UPADDRESS as string, UniversalProfile.abi, luksoProvider);
    //const up = new ERC725(erc725schema as ERC725JSONSchema[], process.env.UPADDRESS, luksoProvider)
    //console.log(up)

    // Deploy the Validator Timestamper Contract
    const LooksoPostValidator = await ethers.getContractFactory("LooksoPostValidator");
    const looksoPostValidator = await LooksoPostValidator.deploy();
    console.log("validator address: "+looksoPostValidator.address)
    // Grant the Validator access to the UP

    const erc725 = new ERC725(LSP6Schema as ERC725JSONSchema[]);
    const permissions = erc725.encodePermissions({
      SETDATA: true,
      CALL: true,
      STATICCALL: true,
      DELEGATECALL: true,
    })
    const grantedAddress = looksoPostValidator.address;
    const permissionData = erc725.encodeData([{
      keyName: "AddressPermissions:Permissions:<address>",
      dynamicKeyParts: grantedAddress,
      value: permissions,
    }] as EncodeDataInput[])

    let upInterface = new ethers.utils.Interface(UniversalProfile.abi)
    const payload = upInterface.encodeFunctionData("setData(bytes32,bytes)", [permissionData.keys[0], permissionData.values[0]]);
    console.log("PAYLOAD: "+payload)

    // Instantiate the UP's KeyManager
    const keyManager = new ethers.Contract( (await up.owner()), KeyManager.abi, wallet);
    await keyManager.execute(payload);


  })
  const postHash = "0xebd6f888b589f38ab6d5d1da951dcb2c8146ae589ab46d452a4a986e524c0512";
  const jsonUrl = "0xaa0b2cdbb4ac4db5cc71238d6f3f77edc521b0106152b420f4dd1d39b145b12a"
      it("Should timestamp a message and return the correct value", async function() {
        // runs once before the first test in this block
        const [owner, otherAccount] = await ethers.getSigners();
        const LooksoValidator = await ethers.getContractFactory("LooksoPostValidator");
        const looksoValidator = await LooksoValidator.deploy();

        await looksoValidator.post(postHash, jsonUrl)
        //expect(looksoValidator.get)
      })
})