// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
 * @title Frens
 * @dev Store and retrieve your friend list
 */

contract Frens {
    constructor() payable {}

    // stores the public address of a user and their friend list
    struct user {
        address walletAddress;
        friend[] friendList;
    }

    // each friend is identified by their address and assigned a name by a user
    struct friend {
        address pubkey;
        string name;
    }

    // collection of users registered on the application
    mapping(address => user) userList;

    // checks if a user exists. If they don't, create a record for them
    function createOrFindNewUser() external {
        if (userList[msg.sender].walletAddress == address(0)) {
            userList[msg.sender].walletAddress = msg.sender;
        }
    }

    // when a user logs into the app, a record with their address is created
    // this prevents users from calling functions if they have not signed in through the app
    modifier isAppUser {
        // fix this
        require(userList[msg.sender].walletAddress != address(0));
        _;
    }

    // Returns list of friends of the sender
    function getMyFriendList() external view isAppUser returns (friend[] memory) {
        return userList[msg.sender].friendList;
    }

    // checks if a user already has a friend
    modifier checkIfAlreadyAFriend(address _pubkey) {
        uint numFriends = userList[msg.sender].friendList.length;
        bool friendExists = false;
        for (uint i=0; i < numFriends; i++) {
            if (userList[msg.sender].friendList[i].pubkey == _pubkey) {
                friendExists = true;
            }
        }

        require(friendExists == false);
        _;
    }

    // adds a new friend to your friend list
    function addFriend(address _pubkey, string calldata _name) external { //isAppUser checkIfAlreadyAFriend(_pubkey) {        
        // create new friend
        friend memory newFriend = friend({ pubkey: _pubkey, name: _name });
        // push to user's friend list
        userList[msg.sender].friendList.push(newFriend);

        // refetch friend list
        this.getMyFriendList();
    }

    // remove a friend from your friend list
    function removeFriend(address _pubkey) external { // isAppUser {
        // loop through friend list, remove this bad guy
        uint numFriends = userList[msg.sender].friendList.length;
        // uint evilFriendIndex;
        for (uint i=0; i < numFriends; i++) {
            if (userList[msg.sender].friendList[i].pubkey == _pubkey) {
                // this may screw up indexing
                delete userList[msg.sender].friendList[i];
            }
        }

        // refetch friend list
        this.getMyFriendList();
    }


}