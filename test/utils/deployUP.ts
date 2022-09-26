import { LSPFactory } from '@lukso/lsp-factory.js';
import hre from "hardhat";
import { JsonRpcProvider } from "@ethersproject/providers";


export async function deployUP(provider: JsonRpcProvider) {
    const lspFactory = new LSPFactory(provider as any, {
        deployKey: (hre as any).userConfig.networks.hardhat.accounts[0].privateKey,
        chainId: (await provider.getNetwork()).chainId
    })

    let deployedContracts = await  lspFactory.UniversalProfile.deploy(
        {
        controllerAddresses: [process.env.L16ADDRESS as string], // our EOA that will be controlling the UP
        lsp3Profile: {
            name: 'HardHat Test Profile',
            description: 'Profile to test the LOOKSO Validator contract',
            tags: ['Local Profile'],
            links: [
            {
                title: 'My Website',
                url: 'https://my-website.com',
            },
            ],
        },
        },

        {
            ERC725Account: {
                deployProxy: false,
            }, 
            LSP1UniversalReceiverDelegate: {
                deployProxy:false
            }
        }
    );

    return [deployedContracts.LSP0ERC725Account?.address, deployedContracts.LSP6KeyManager.address];
}