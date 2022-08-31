// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import { Context } from "@openzeppelin/contracts/utils/Context.sol";
import { ERC725YCore } from "@erc725/smart-contracts/contracts/ERC725YCore.sol";
import { OwnableUnset } from "@erc725/smart-contracts/contracts/custom/OwnableUnset.sol";
import { GasLib } from "@erc725/smart-contracts/contracts/utils/GasLib.sol";

contract Validator is ERC725YCore(), Context {

    constructor() {
    }

    function validate(bytes32 contentHash) external {
        require( getData(contentHash).length == 0, 
            "Corresponding value for this hash is not null. Content has been added under this hash before.");
        // Write to the Key-Value Storage.
        setData(contentHash, bytes(abi.encodePacked(address(_msgSender()), bytes12(uint96(block.timestamp)))));
    }

    function setData(bytes32 dataKey, bytes memory dataValue) public virtual override {
        _setData(dataKey, dataValue);
    }

    function setData(bytes32[] memory dataKeys, bytes[] memory dataValues)
        public
        virtual
        override
    {
        require(dataKeys.length == dataValues.length, "Keys length not equal to values length");
        for (uint256 i = 0; i < dataKeys.length; i = GasLib.uncheckedIncrement(i)) {
            _setData(dataKeys[i], dataValues[i]);
        }
    }

    function getTimestamp(bytes32 key) public view returns(bytes12) {
        return bytes12(bytes32(this.getData(key)) << 160);
        // return
    }

    function getAddress(bytes32 key) public view returns (bytes20) {
        return bytes20(this.getData(key));
    }
}