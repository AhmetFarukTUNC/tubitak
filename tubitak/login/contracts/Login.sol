// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract Login {
    struct User {
        string username;
        bytes32 passwordHash;
        string password;
    }

    mapping(address => User) private users;
    mapping(string => address) private usernameToAddress;

    function register(string memory _username, string memory _password) public {
        require(bytes(_username).length > 0, "Username cannot be empty");
        require(bytes(_password).length > 0, "Password cannot be empty");
        require(usernameToAddress[_username] == address(0), "Username already taken");
        

        users[msg.sender] = User({
            username: _username,
            passwordHash: keccak256(abi.encodePacked(_password)),
            password: _password // Şifreyi düz metin olarak saklamak güvenli değildir, sadece gösterim amaçlıdır
        });

        usernameToAddress[_username] = msg.sender;
    }

    function login(string memory _username, string memory _password) public view returns (bool) {
        address userAddress = usernameToAddress[_username];
        

        User memory user = users[userAddress];
        bytes32 passwordHash = keccak256(abi.encodePacked(_password));

        return user.passwordHash == passwordHash;
    }

    function getUser(address _userAddress) public view returns (string memory) {
        require(bytes(users[_userAddress].username).length > 0, "User does not exist");

        User memory user = users[_userAddress];
        return user.username;
    }
    
    function getPassword(address _userAddress) public view returns (string memory) {
        
        
        User memory user = users[_userAddress];
        return user.password; 
    }

    function updatePassword(string memory _newPassword) public {
        require(bytes(users[msg.sender].username).length > 0, "User does not exist");
        require(bytes(_newPassword).length > 0, "Password cannot be empty");
        
        users[msg.sender].passwordHash = keccak256(abi.encodePacked(_newPassword));
        users[msg.sender].password = _newPassword; // Şifreyi düz metin olarak saklamak güvenli değildir, sadece gösterim amaçlıdır
    }

    function updateUser(string memory _newUsername) public {
        require(bytes(users[msg.sender].username).length > 0, "User does not exist");
        
        
        
        users[msg.sender].username = _newUsername; 
    }

}
