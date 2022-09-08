// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Post {
    string public name;

    //store images
    uint public imageCount = 0;
    mapping(uint => Image) public images;

    struct Image {
        uint id;
        string hash;
        string postit; 
        address author;
        //address payable author;
    }

     event ImageCreated(
            uint id,
            string hash,
            string postit, 
            address author
        );
    constructor() public {
    name = "Post";
  }

  //create images
  function uploadImage(string memory _imgHash, string memory _postit) public {
    // Make sure the image hash exists
    require(bytes(_imgHash).length > 0);
    
    // Make sure image description exists
    require(bytes(_postit).length > 0);
    
    // Make sure uploader address exists
    require(msg.sender!=address(0));

    // Increment image id
    imageCount ++;

    // Add Image to the contract
    images[imageCount] = Image(imageCount, _imgHash, _postit, msg.sender);
    
    // Trigger an event
    emit ImageCreated(imageCount, _imgHash, _postit, msg.sender);
  }

}


    /*string memeHash;

    function set(string memory _memeHash) public {
        memeHash = _memeHash;
    }

    function get() public view returns (string memory) {
        return memeHash;
    }
}*/