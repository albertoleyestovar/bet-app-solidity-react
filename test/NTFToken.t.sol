// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {NFTToken} from "../src/NFTToken.sol";

contract NTFTokenTest is Test {
    NFTToken public ntfToken;

    function setUp() public {
        nftToken = new NTFToken("TestNTF", "NTF");
    }
}
