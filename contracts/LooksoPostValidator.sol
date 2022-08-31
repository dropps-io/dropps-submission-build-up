// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import { ERC725Y } from "@erc725/smart-contracts/contracts/ERC725Y.sol";
import {_INTERFACEID_ERC725Y} from "@erc725/smart-contracts/contracts/constants.sol";
import { OwnableUnset } from "@erc725/smart-contracts/contracts/custom/OwnableUnset.sol";
import { ERC165Checker } from "@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";
import { ILSP6KeyManager} from "@lukso/lsp-smart-contracts/contracts/LSP6KeyManager/ILSP6KeyManager.sol";
import { Validator } from "./Validator.sol";

contract LooksoPostValidator is Validator {

    bytes32 public constant REGISTRY_KEY = keccak256("LSPXXSocialRegistry");
    //event NewPost (bytes32 indexed postHash);

    constructor(address owner) Validator(owner) {}

    function post(bytes32 postHash, bytes calldata jsonUrl) public {
        // Save timestamp on mapping. Performs 1 new write to storage
        this.validate(postHash);
        //Update the registry in the UP
        //// Verify sender supports the IERC725Y standard
        require(ERC165Checker.supportsERC165(_msgSender()), "Sender must implement ERC165. A UP does.");
        require(ERC165Checker.supportsInterface(_msgSender(), _INTERFACEID_ERC725Y), "Sender must implement IERC725Y (key/value store). A UP does");
        //// ! Missing: Verify sender supports the LSPXXSocialNetwork standard

        bytes memory encodedCall = abi.encodeWithSelector(
            bytes4(keccak256(bytes("setData(bytes32,bytes)"))), //function.selector
            REGISTRY_KEY, jsonUrl
        );
        ILSP6KeyManager( OwnableUnset(_msgSender()).owner() ).execute(encodedCall);
        // emit NewPost(postHash); don't trigger the event because we already have the UP event from setData
    }
}