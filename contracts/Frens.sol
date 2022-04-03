// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
 * @title Frens
 * @author delafields
 * @notice store and retrieve your fren's by their wallet addresses and names
 * @custom:experimental This is an experimental contract.
 */
contract Frens {
    constructor() payable {}

    /// @notice: stores the public address of a user and their fren list
    struct user {
        address walletAddress;
        fren[] frenList;
    }

    /// @notice: each fren is identified by their address and assigned a name by a user
    struct fren {
        address pubkey;
        string name;
    }

    /// collection of users registered on the application
    mapping(address => user) userList;

    /// fires whenever a user adds or removes a fren
    /// we use this to make state changes on the client
    event FrenListUpdated(fren[] _frenlist);

    /// checks if a user exists. If they don't, create a record for them
    function createOrFindNewUser() external {
        if (userList[msg.sender].walletAddress == address(0)) {
            userList[msg.sender].walletAddress = msg.sender;
        }

        emit FrenListUpdated(userList[msg.sender].frenList);
    }

    /// when a user logs into the app, a record with their address is created
    /// hypothetically this prevents non-app users from calling external functions
    modifier isAppUser {
        require(userList[msg.sender].walletAddress != address(0), "stop cheatin bruv, use the app");
        _;
    }


    /// ensures no duplicate frens
    /// loops through fren records for a given user
    /// @param _pubkey The public key of a fren
    /// returns frenExists A bool indicating whether this fren already exists
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

    /// @notice adds a new fren to your fren list
    /// @dev we require this to be called by an "AppUser" and to be a new fren
    /// @param _pubkey The public key of a fren
    /// @param _name The name provided by the user for this fren
    function addfren(address _pubkey, string calldata _name) external isAppUser {      
        require(checkIfAlreadyAfren(_pubkey) == false, "m'boi, this address is already a fren");
        // require(userList[msg.sender].frenList.length < 20, "max 20 frens homie, we saving gas over here");

        // create new fren
        fren memory newfren = fren({ pubkey: _pubkey, name: _name });
        // push to user's fren list
        userList[msg.sender].frenList.push(newfren);

        emit FrenListUpdated(userList[msg.sender].frenList);
    }

    /// @notice removes a fren from a user's frenList
    /// @dev we require this to be called by an "AppUser" and to be an existing fren
    /// @param _pubkey The public key of a fren
    function removefren(address _pubkey) external isAppUser {
        require(checkIfAlreadyAfren(_pubkey) == true, "u must rly hate this person, they're not even on ur frens list");

        // loop through fren list, remove the bad guy
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