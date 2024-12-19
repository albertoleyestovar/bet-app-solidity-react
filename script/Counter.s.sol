// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {MyFirstToken} from "../src/Counter.sol";

contract CounterScript is Script {
    MyFirstToken public counter;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        // account 1
        counter = new MyFirstToken(0xD12A3f512Dd71eA1b1421C01c9e9927c05681FdB);

        vm.stopBroadcast();
    }
}
