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

    error ZeroAddress(string errorMessage);

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

    /// checks if a user exists. If they don't, create a record for them.
    function login() external {
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

    /// checks if a fren is in a user's frenList
    /// @param _pubkey The public key of a fren
    /// returns frenExists A bool indicating whether this fren already exists
    /// returns frenIndex A uint of this frens index in the userList
    function lookForFren(address _pubkey) internal view returns (bool, uint) {
        fren[] storage userFrenlist = userList[msg.sender].frenList;
        bool frenExists = false;
        uint frenIndex = 0;

        for (uint i; i < userFrenlist.length; i++) {
            if (userFrenlist[i].pubkey == _pubkey) {
                frenExists = true;
                frenIndex = i;
                // we handle the rest of this loop in removeFren
                break;
            }
        }

        return (frenExists, frenIndex);
    }

    /// @notice adds a new fren to your fren list
    /// @dev we require this to be called by an "AppUser" and to be a new fren
    /// @param _pubkey The public key of a fren
    /// @param _name The name provided by the user for this fren
    function addFren(address _pubkey, string calldata _name) external isAppUser {      
        (bool frenExists, ) = lookForFren(_pubkey);
        require(frenExists == false, "m'boi, this address is already a fren");
        if (_pubkey == address(0)) revert ZeroAddress({errorMessage: "fren can't be address 0 dood"});

        // create new fren
        fren memory newfren = fren({ pubkey: _pubkey, name: _name });
        // push to user's fren list
        userList[msg.sender].frenList.push(newfren);

        emit FrenListUpdated(userList[msg.sender].frenList);
    }

    /// @notice removes a fren from a user's frenList
    /// @dev we require this to be called by an "AppUser" and to be an existing fren
    /// @param _pubkey The public key of a fren
    function removeFren(address _pubkey) external isAppUser {
        (bool frenExists, uint frenIndex) = lookForFren(_pubkey);
        require(frenExists == true, "u must rly hate this person, they're not even on ur frens list");
        // hypothetically this situation isn't possible BUT KEEP IT SAFE M8
        if (_pubkey == address(0)) revert ZeroAddress({errorMessage: "fren can't be address 0 dood"});
        
        fren[] storage userFrenlist = userList[msg.sender].frenList;

        // loop through a user's fren list starting at frenIndex, the index of the fren to remove
        // left shift the array starting at its index, then pop the array
        if (userFrenlist.length != 1) {
            for (uint i=frenIndex; i < userFrenlist.length-1; i++) {
                userFrenlist[i] = userFrenlist[i+1];
            }
        }

        userFrenlist.pop();

        emit FrenListUpdated(userList[msg.sender].frenList);
    }

}