import { utils } from "ethers";
import UniversalProfile from "@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json"; 

export async function callPost(postHash:string, jsonUrl:string, validatorContract:any, keyManagerContract:any) {
    let upInterface = new utils.Interface(UniversalProfile.abi)
    let validatorInterface = validatorContract.interface;
    const validatorPayload = validatorInterface.encodeFunctionData("post", [postHash, jsonUrl])
    const upPayload = upInterface.encodeFunctionData("execute(uint256,address,uint256,bytes)", [0, validatorContract.address,0,validatorPayload]);
    // runs once before the first test in this block
    try {
        let tx =  (await keyManagerContract.execute(upPayload));
        if (tx.chainId == 2828) return await tx.wait(2) // LUKSO L16 Network
        else return tx;
    } catch (err) {
        throw(err);
    }
}
