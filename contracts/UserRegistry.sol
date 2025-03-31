// // pragma solidity ^0.8.28;

// // contract UserRegistry {
// //     struct User {
// //         string name;
// //         bool isLandlord;
// //     }

// //     mapping(address => User) public users;
// //     mapping(address => uint256[]) public userProperties;

// //     event UserRegistered(address indexed user, string name, bool isLandlord);
// //     event ProfileUpdated(address indexed user, string newName);

// //     function registerUser(string memory _name, bool _isLandlord) external {
// //         require(bytes(users[msg.sender].name).length == 0, "User already registered");

// //         users[msg.sender] = User({ name: _name, isLandlord: _isLandlord });

// //         emit UserRegistered(msg.sender, _name, _isLandlord);
// //     }

// //     function getUserProfile(address _user) external view returns (User memory) {
// //         return users[_user];
// //     }

// //     function updateUserProfile(string memory _newName) external {
// //         require(bytes(users[msg.sender].name).length > 0, "User not registered");

// //         users[msg.sender].name = _newName;
// //         emit ProfileUpdated(msg.sender, _newName);
// //     }
// // }

// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.20;

// contract UserRegistry {
//     struct UserProfile {
//         string name;
//         bool isRegistered; // Better flag than checking name length
//         // Add more profile fields if needed (e.g., contact info IPFS hash)
//     }

//     mapping(address => UserProfile) public users;
//     // Removed userProperties mapping - better handled off-chain via events from PropertyListing

//     event UserRegistered(address indexed user, string name);
//     event ProfileUpdated(address indexed user, string newName);

//     function registerUser(string memory _name) external {
//         require(!users[msg.sender].isRegistered, "UR: User already registered");
//         require(bytes(_name).length > 0, "UR: Name cannot be empty");

//         users[msg.sender] = UserProfile({ name: _name, isRegistered: true });

//         emit UserRegistered(msg.sender, _name);
//     }

//     function getUserProfile(address _userAddress) external view returns (UserProfile memory) {
//         // No need to check if registered, returns default struct if not
//         return users[_userAddress];
//     }

//     function updateProfile(string memory _newName) external {
//         require(users[msg.sender].isRegistered, "UR: User not registered");
//         require(bytes(_newName).length > 0, "UR: Name cannot be empty");

//         users[msg.sender].name = _newName;
//         emit ProfileUpdated(msg.sender, _newName);
//     }

//     function isUserRegistered(address _userAddress) external view returns (bool) {
//         return users[_userAddress].isRegistered;
//     }
// }