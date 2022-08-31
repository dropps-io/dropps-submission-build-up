---
lip: XX
title: Social Media Feed
status: Draft
type: Meta
author: Samuel Videau <samuel@dropps.io>, António Pedro <antonio@dropps.io>
created: 2022-07-26
updated: 2022-08-24
requires: ERC725Y, LSP2
---

## Simple Summary

This standard describes a data model to store Social Media information such as posts, likes and follows. 

## Abstract

This standard defines a set of data formats and a key-value pair to create a Social Media Feed, combining [ERC725Account](https://github.com/lukso-network/LIPs/blob/main/LSPs/LSP-0-ERC725Account.md) and an open distributed storage network such as [IPFS](https://ipfs.tech/) or [ARWEAVE](https://arweave.org).

## Motivation

Real interoperability requires social media itself to be separated from social media companies. This proposal aims to create a common interoperable standard in which messages generated on one social media app could be transported and read in any other application.

Using a standardized data model to store social media makes content platform-independent and allows it to be read and stored easily. This content can be added to an [ERC725Account](https://github.com/lukso-network/LIPs/blob/main/LSPs/LSP-0-ERC725Account.md), giving it a Social Media Account character.

## Specification

### LSPXXSocialRegistry

A Universal Profile's Social Media State will live under a record referenced by the "LSPXXSocialRegistry" data key of their ERC725Y store.

The JSON Url stored inside points to a JSON file that lists all the social media actions of a profile, including posts, likes and follows.

```json
  {
      "name": "LSPXXSocialRegistry",
      "key": "0x661d289e41fcd282d8f4b9c0af12c8506d995e5e9e685415517ab5bc8b908247",
      "keyType": "Singleton",
      "valueType": "bytes",
      "valueContent": "JSONURL"
  }
```

This should be updated everytime a new post is added by the user.

The linked JSON file SHOULD have the following format:

```js
{
  "LSPXXSocialRegistry": {
    "posts": [ // Messages authored by the profile. Includes original posts, comments and reposts.
      {
        "url": "string", // The url in decentralized storage with the post content and metadata
        "hash": "string" // The hash of the post object
      },
      ...
    ],
    "follows": [ "Address", ... ], // UPs this account has subscribed.  Will compose the account's feed.
    "likes": ["bytes32", ...], // The identifier (hash) of all the posts this account has liked
  }
}
```

### Profile Posts

A Profile Post can be an original message, a comment on another post or a repost. The JSON file should have the following format:

```js
{
  "LSPXXProfilePost": {
    "version": "0.0.1",
    "author": "Address", // The Universal Profile who authored the post
    "validator": "Address", // Address of a validator smart contract which will authenticate a post and provide its publication date
    "nonce": "string", // Random value to avoid having same hash for different posts
    "message": "string", // The post original content
    "links": [
      {
        "title": "string", // The link's label
        "url": "string"
      },
      ...
    ],
    "tags": [ // Tags attached to a post
      "string",
      ...
    ],
    "asset": { // Each post can have up to 1 media file attached
      "hashFunction": "keccak256(bytes)",
      "hash": "string",
      "url": "string", 
      "fileType": "string"
    },
    "parentHash": "string", // or null. A post with a parent is a comment
    "childHash": "string", // or null. A post with a child is a repost
    "nonce":"string",
  },
  "LSPXXProfilePostHash": {// Hash of the LSPXXProfilePost object
    "hashFunction": 'keccak256(bytes)',
    "hash": "string",
  }, 
  "LSPXXProfilePostEOASignature": "string"
}
```
Below is an example of a post object:

```JSON
{
  "LSPXXProfilePost": {
    "version":"0.0.1",
    "message": "This is the first Lookso post.",
    "author": "0x742242E9572cEa7d3094352472d8463B0a488b80",
    "validator": "0x049bAfA4bF69bCf6FcB7246409bc92a43f0a7264",
    "nonce": "415665014",
    "links": [
      {
        "title": "Our website",
        "url": "https://dropps.io"
      }
    ],
    "asset": {
      "hashFunction": "keccak256(bytes)",
      "hash": "0x813a0027c9201ccdec5324aa32ddf0e8b9400479662b6f243500a42f2f85d2eb",
      "url": "ar://gkmVUoHE4Ay6ScIlgV4E7Fs1m13LfpAXSuwuRGRQbeA",
      "fileType": "jpg"
    },
    "parentHash":"0xdc1812e317c6cf84760d59bda99517de5b5c5190fcf820713075430337805340",
    "childHash":""
  },
  "LSPXXProfilePostHash": "0x0017eb3f3b2c10c3387c710e849c64527ae331bfb2d42fb70fbe95588ff5d6cd",
  "LSPXXProfilePostHashFunction": "keccak256(utf-8)",
  "LSPXXProfilePostSignature": "0x2845551019619d59657b6e485d1cb2067479a5bc364270030d7c4143b4cc0ee5279432bee8425f17d091f067e6b8f987390900b1fd82bef52fcb4c8b2b06ab901b"
}
```

The post content and metadata is stored under  _LSPXXProfilePost_. The content and metadata are hashed and the hash is saved under _LSPXXProfilePostHash_. Finally, the controller address is requested to sign the _LSPXXProfilePost_ object. This signature can be obtained, for example, using `web3.eth.accounts.sign(data, privateKey);`

Let's breakdown the _LSPXXProfilePost_ attributes: 

* **version** will allow clients that adhere to the protocol to display posts properly, even if some attributes change. 
* **message** is the actual content of a post that will be displayed as text.
* **author** is the address of the Universal Profile that submitted the post.
* **validator** is the address of the contract that timestamped this particular post. Use it to retrieve the post data.
* **nonce** is what makes a post unique. Otherwise, posts written by the same author with the same message would generate the same hash and collide in the validator storage. The transaction would then revert when someone tried posting the same content twice. Even if on different dates! We don't want that. Anyone has the right to just pass by and say "Goodmorning!" everyday.
* **links** they can be used in the future to extend the standard.
* **tags** they can be used in the future as hashtags.
* **asset** A media file attached to the post. An image, video, or any other file type.
* **parentHash** If this post is a comment, the hash of the original post should go in here.
* **childHash** If this post is a repost, the hash of the original post should go in here. 

## Copyright

Copyright and related rights waived via [CC0](https://creativecommons.org/publicdomain/zero/1.0/).
