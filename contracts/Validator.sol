// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import { Context } from "@openzeppelin/contracts/utils/Context.sol";
import { ERC725YCore } from "@erc725/smart-contracts/contracts/ERC725YCore.sol";
import { OwnableUnset } from "@erc725/smart-contracts/contracts/custom/OwnableUnset.sol";

import "hardhat/console.sol";

/// @title A validator for hash values
/// @author https://lookso.io
/// @notice Acts as a registry that contains proof of authorship and creation date
/// @dev The registry is saved according to the ERC725Y storage standard
contract Validator is ERC725YCore(), Context {

    constructor() {
        _setOwner(address(0));
    }

    /**
    * @notice Saves a hash value and appends a timestamp and an address to it
    * @dev Uses block.timestamp to set a date and msgSender to set the address
    * @param contentHash A hash value to validate
    */ 
    function validate(bytes32 contentHash) public {
        setData(contentHash, bytes(abi.encodePacked(address(_msgSender()), bytes12(uint96(block.timestamp)))));
    }

    /**
    * @dev Overrides parent function to remove onlyOwner modifier
    * @notice Disallows setting a non-zero value
    * @param dataKey Memory position to store the new value
    * @param dataValue The value to be stored
    */
    function setData(bytes32 dataKey, bytes memory dataValue) public virtual override {
        require(getData(dataKey).length == 0, 
            "Provided hash already maps to a non-null value.");
        _setData(dataKey, dataValue);
    }

    /**
    * @dev Overrides parent function to remove onlyOwner modifier
    * @notice Allows setting multiple keys in one call
    * @param dataKeys Memory positions to store the new value
    * @param dataValues The values to be stored
    */
    function setData(bytes32[] memory dataKeys, bytes[] memory dataValues)
        public
        virtual
        override
    {
        require(dataKeys.length == dataValues.length, "Keys length not equal to values length");
        for (uint256 i = 0; i < dataKeys.length; i++) {
            _setData(dataKeys[i], dataValues[i]);
        }
    }

    /**
    * @dev Uses the Left Shift operator to discard the bytes that do not correspond to the timestamp.
    * The timestamp is saved right padded, in the 12 bytes left after storing the address 
    * @notice Breaks down the 32 byte memory slot and retrieves the timestamp part
    * @param key Memory positions to retrieve the value from
    * @return The date when the key was registered in the validator in UNIX Timestamp form
    */
    function getTimestamp(bytes32 key) public view returns(bytes12) {
        return bytes12(bytes32(this.getData(key)) << 160);
        // return
    }

    /**
    * @notice Breaks down the 32 bytes slot and retrieves the address part
    * @param key Memory positions to retrieve the value from
    * @return The address that registerd this key in the validator
    */
    function getSender(bytes32 key) public view returns (bytes20) {
        return bytes20(this.getData(key));
    }
}