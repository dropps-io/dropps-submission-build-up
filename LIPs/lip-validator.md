---
lip: XX
title: Validator
status: Draft
type: Standards Track LSP
author: Samuel Videau <samuel@dropps.io>, António Pedro <antonio@dropps.io>
created: 2022-08-25
requires: ERC725Y
---

## Simple Summary

This standard defines a validator smart contract where any address (contract or external account) can store proof that it knew some information at a given point in time.

## Abstract

This standard defines a registry with an [ERC725Y](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-725.md#erc725y) store. The hash of a message stored of-chain is the key to which current block timestamp and the message sender are assigned as a bytes32 value. 

Anyone can query the registry to validate that a certain address indeed timestamped a given hash, thus providing proof that the address knew the original message at the time.

## Motivation

One should not trust the author of a message to provide an accurate timestamp because it can be faked. Instead, a trustless timestamping service should be used to determine the message's creation date. This is possible using the blockchain as the source of time.

Furthermore, notice that timestamping a given hash is proof that the author was able to generate that hash at that time. This can be used to approach another problem: Cryptographic signatures are usually used to provide proof of ownership and timestamp. However, because a smart contract cannot sign, this method cannot be used for contract based accounts like an [ERC725Account](https://github.com/lukso-network/LIPs/blob/main/LSPs/LSP-0-ERC725Account.md). Current practice if for an Externally Owned Address (EOA) to sign on behalf of the contract. However, it's hard to know if the EOA had permissions to sign at the time and to timestamp the signed message in a trustless way. 

## Specification

#### validate

```solidity
function validate(bytes32 contentHash) external
```

Verifies there isn't already a timestamp for this content. Stores the msgSender and the blocktimestamp under a key equal to the hash of the content to timestamp and claim.  

_Parameters:_
- `contentHash`: the content hash to bind to a timestamp and address.

#### setData 

```solidity
    function setData(bytes32 dataKey, bytes memory dataValue) public virtual override
    function setData(bytes32[] memory dataKeys, bytes[] memory dataValues) public virtual override
```

Overrides the setData function from the ERC725Y core in order to remove the ownership requirements, making this registry public to use and immutable.

#### getTimestamp

```solidity
function getTimestamp(bytes32 key) public view returns(bytes12)
```

Returns only the Timestamp part stored under a give key.

_Parameters:_
- `key`: Key to access the storage. Most frequently will represent the hash of some off-chain content.

#### getAddress

```solidity
function getAddress(bytes32 key) public view returns (bytes20)
```
Returns only the Address part stored under a give key.

_Parameters:_
- `key`: Key to access the storage. Most frequently will represent the hash of some off-chain content.

## Implementation

```solidity
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import { Context } from "@openzeppelin/contracts/utils/Context.sol";
import { ERC725YCore } from "@erc725/smart-contracts/contracts/ERC725YCore.sol";
import { OwnableUnset } from "@erc725/smart-contracts/contracts/custom/OwnableUnset.sol";
import { GasLib } from "@erc725/smart-contracts/contracts/utils/GasLib.sol";

contract Validator is ERC725YCore(), Context {

    constructor(address newOwner) {
        OwnableUnset._setOwner(newOwner);
    }

    function validate(bytes32 contentHash) external {
        require( getData(contentHash).length == 0, 
            "Corresponding value for this hash is not null.");
        setData(contentHash, bytes(abi.encodePacked(address(_msgSender()), bytes12(uint96(block.timestamp)))));
    }

    function setData(bytes32 dataKey, bytes memory dataValue) public virtual override {
        _setData(dataKey, dataValue);
    }

    function setData(bytes32[] memory dataKeys, bytes[] memory dataValues) public virtual override {
        require(dataKeys.length == dataValues.length, "Keys length not equal to values length");
        for (uint256 i = 0; i < dataKeys.length; i = GasLib.uncheckedIncrement(i)) {
            _setData(dataKeys[i], dataValues[i]);
        }
    }

    function getTimestamp(bytes32 key) public view returns(bytes12) {
        return bytes12(bytes32(this.getData(key)) << 160);
    }

    function getAddress(bytes32 key) public view returns (bytes20) {
        return bytes20(this.getData(key));
    }
}
```

## Rationale

## Copyright

Copyright and related rights waived via [CC0](https://creativecommons.org/publicdomain/zero/1.0/).
