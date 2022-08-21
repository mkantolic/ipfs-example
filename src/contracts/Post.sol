// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Post {
    string memeHash;

    function set(string memory _memeHash) public {
        memeHash = _memeHash;
    }

    function get() public view returns (string memory) {
        return memeHash;
    }
}