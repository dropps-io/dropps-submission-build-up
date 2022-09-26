// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import { ERC725Y } from "@erc725/smart-contracts/contracts/ERC725Y.sol";
import {_INTERFACEID_ERC725Y} from "@erc725/smart-contracts/contracts/constants.sol";
import { OwnableUnset } from "@erc725/smart-contracts/contracts/custom/OwnableUnset.sol";
import { ERC165Checker } from "@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";
import { ILSP6KeyManager} from "@lukso/lsp-smart-contracts/contracts/LSP6KeyManager/ILSP6KeyManager.sol";
import { Validator } from "./Validator.sol";

import "hardhat/console.sol";

/**
* @title LOOKSO post validator
* @notice A validator tailored for Universal Profiles and content publishing
* @author https://lookso.io
* @dev Writes to the Universal Profile key/value store
*/
contract LooksoPostValidator is Validator {

    bytes32 public constant REGISTRY_KEY = keccak256("LSPXXSocialRegistry");

    constructor() Validator() {}

    /**
    * @notice Universal Profile (message sender) makes a post
    * @dev This contract must have permissions to write on the Universal Profile
    * @param postHash Will be used as key in this contract's mapping
    * @param jsonUrl Reference to the latest Social Media Record of the sender
    */
    function post(bytes32 postHash, bytes calldata jsonUrl) public {
        // Save block.timestamp and msgSender().address under the key "postHash" in mapping.
        validate(postHash);
        //Update the registry reference in the UP
        //// Verify sender supports the IERC725Y standard
        require(ERC165Checker.supportsERC165(_msgSender()), "Sender must implement ERC165. A UP does.");
        require(ERC165Checker.supportsInterface(_msgSender(), _INTERFACEID_ERC725Y), "Sender must implement IERC725Y (key/value store). A UP does");

        bytes memory encodedCall = abi.encodeWithSelector(
            bytes4(keccak256(bytes("setData(bytes32,bytes)"))), //function.selector
            REGISTRY_KEY, jsonUrl
        );
        ILSP6KeyManager( OwnableUnset(_msgSender()).owner() ).execute(encodedCall);
    }
}