// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
pragma experimental ABIEncoderV2;

// UserPanel kontratına erişim için arayüz
interface UserPanelInterface {
    function getUser(address userAddress) external view returns (string memory, string memory);
    function getAllUsers() external view returns (address[] memory);
    function registerUser(string calldata username, string calldata password) external;
    function updateUser(address userAddress, string memory newUsername, string memory newPassword) external;
    
}

contract UserPanelInfo {
    // UserPanel kontratına erişmek için adres
    address public userPanelAddress;

    // UserPanel arayüzünü kullanarak kullanıcı bilgilerine erişim sağlama
    UserPanelInterface private userPanel;

    // Yeni kontratın oluşturucusu, UserPanel kontratının adresini alır
    constructor(address _userPanelAddress) {
        userPanelAddress = _userPanelAddress;
        // UserPanel kontratına erişim sağlama
        userPanel = UserPanelInterface(_userPanelAddress);
    }

    // Kullanıcı adresleri için kullanıcı adı ve şifreleri döndüren işlev
    function getUserInfoForAllUsers() public view returns (address[] memory, string[] memory, string[] memory) {
        address[] memory allUsers = userPanel.getAllUsers();
        string[] memory usernames = new string[](allUsers.length);
        string[] memory passwords = new string[](allUsers.length);
        for (uint i = 0; i < allUsers.length; i++) {
            (string memory username, string memory password) = userPanel.getUser(allUsers[i]);
            usernames[i] = username;
            passwords[i] = password;
            
        }


        
        


        
        
        return (allUsers, usernames, passwords);
    }

    // Kullanıcı bilgilerini güncelleyen işlev
    function updateUser(address userAddress, string memory newUsername, string memory newPassword) public {
        userPanel.updateUser(userAddress, newUsername, newPassword);
    }



    

}
