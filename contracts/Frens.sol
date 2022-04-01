// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
 * @title Frens
 * @dev Store and retrieve your fren list
 */
contract Frens {
    constructor() payable {}

    // stores the public address of a user and their fren list
    struct user {
        address walletAddress;
        fren[] frenList;
    }

    // each fren is identified by their address and assigned a name by a user
    struct fren {
        address pubkey;
        string name;
    }

    // collection of users registered on the application
    mapping(address => user) userList;

    // this event fires whenever a user adds or removes a fren
    event FrenListUpdated(fren[] _frenlist);

    // checks if a user exists. If they don't, create a record for them
    function createOrFindNewUser() external {
        if (userList[msg.sender].walletAddress == address(0)) {
            userList[msg.sender].walletAddress = msg.sender;
        }

        emit FrenListUpdated(userList[msg.sender].frenList);
    }

    // when a user logs into the app, a record with their address is created
    // this prevents users from calling functions if they have not signed in through the app
    modifier isAppUser {
        require(userList[msg.sender].walletAddress != address(0), "stop cheatin bruv, use the app");
        _;
    }

    // // Returns list of frens of the sender
    // function getMyfrenList() external view isAppUser returns (fren[] memory) {
    //     return userList[msg.sender].frenList;
    // }

    function checkIfAlreadyAfren(address _pubkey) internal view returns (bool) {
        uint numfrens = userList[msg.sender].frenList.length;
        bool frenExists = false;
        for (uint i; i < numfrens; i++) {
            if (userList[msg.sender].frenList[i].pubkey == _pubkey) {
                frenExists = true;
            }
        }

        return frenExists;
    }

    // adds a new fren to your fren list
    function addfren(address _pubkey, string calldata _name) external isAppUser {      
        require(checkIfAlreadyAfren(_pubkey) == false, "m'boi, this address is already a fren");
        // require(userList[msg.sender].frenList.length < 20, "max 20 frens homie, we saving gas over here");

        // create new fren
        fren memory newfren = fren({ pubkey: _pubkey, name: _name });
        // push to user's fren list
        userList[msg.sender].frenList.push(newfren);

        emit FrenListUpdated(userList[msg.sender].frenList);
    }

    // remove a fren from your fren list
    function removefren(address _pubkey) external isAppUser {
        require(checkIfAlreadyAfren(_pubkey) == true, "u must rly hate this person, they're not even on ur frens list");

        // loop through fren list, remove this bad guy
        uint numfrens = userList[msg.sender].frenList.length;
        // uint evilfrenIndex;
        for (uint i=0; i < numfrens; i++) {
            if (userList[msg.sender].frenList[i].pubkey == _pubkey) {
                // this may screw up indexing
                // this just zeroes records, filter on client side
                delete userList[msg.sender].frenList[i];
            }
        }

        emit FrenListUpdated(userList[msg.sender].frenList);
    }

}