import ERC725 from "@erc725/erc725.js";
import { ethers } from "hardhat";
import UniversalProfile from "@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json";


export async function setPermissions(up:any, keyManager:any, erc725:any, grantedAddress:string) {

    let keys:string[] = [];
    let values:string[] = [];

    // 1. Updates AddressPermissions[] length
    keys.push(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("AddressPermissions[]"))); 
    let permissionsLength = (await (up.functions.getData(keys[0])))[0];
    let lengthBN = ethers.BigNumber.from(permissionsLength);
    let newLengthBN = lengthBN.add(1);
    values.push( ethers.utils.hexZeroPad((newLengthBN.toHexString()), 32));

    // 2. Updates AddressPermissions[i] value
    keys.push(keys[0].slice(0,34) + (ethers.utils.hexDataSlice( ethers.utils.hexZeroPad( ( (newLengthBN.add(1) ).toHexString() ), 32 ), 16)).slice(2));
    values.push(grantedAddress);

    // 3. Updates address permissions in the mapping
    const permissionsData = erc725.encodeData([{
        keyName: "AddressPermissions:Permissions:<address>",
        dynamicKeyParts: grantedAddress,
        value:'0x000000000000000000000000000000000000000000000000000000000000ffff' // full permissions
    }])
    keys = keys.concat(permissionsData.keys);
    values = values.concat(permissionsData.values);

    // Final: Send the transaction through the KeyManager
    let upInterface = new ethers.utils.Interface(UniversalProfile.abi)
    const payload = upInterface.encodeFunctionData("setData(bytes32[],bytes[])", [keys, values]);
    await (await keyManager.execute(payload)).wait(1);

    return;

}