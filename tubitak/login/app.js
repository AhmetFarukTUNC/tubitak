require('dotenv').config();
const {Web3} = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_URL));

// Akıllı kontratınızın ABI'sini buraya yapıştırın
const contractABI = [
  
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "username",
          "type": "string"
        }
      ],
      "name": "UserRegistered",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "getAllUsers",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "userAddress",
          "type": "address"
        }
      ],
      "name": "getUser",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "username",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "password",
          "type": "string"
        }
      ],
      "name": "registerUser",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "userAddress",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "newUsername",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "newPassword",
          "type": "string"
        }
      ],
      "name": "updateUser",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

// Kontrat adresinizi buraya yapıştırın
const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const contract = new web3.eth.Contract(contractABI, contractAddress);

console.log(contract.methods.getAllUsers().call())

// Cüzdan hesabını ayarla
const privateKey = process.env.PRIVATE_KEY;

if (!privateKey || privateKey.length !== 64) {
    throw new Error('Geçersiz özel anahtar. Lütfen .env dosyanızı kontrol edin.');
}

const account = web3.eth.accounts.privateKeyToAccount('0x' + privateKey);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

// Kullanıcı kaydetme fonksiyonu
async function registerUser(username, password) {
    try {
        const receipt = await contract.methods.registerUser(username, password)
            .send({ from: account.address, gas: 2000000 });
        console.log('Kullanıcı kaydedildi:', receipt);
    } catch (error) {
        console.error('Kullanıcı kaydedilemedi:', error);
    }
}

// Kullanıcı bilgilerini alma fonksiyonu
async function getUser(userAddress) {
    try {
        const user = await contract.methods.getUser(userAddress).call();
        console.log('Kullanıcı bilgileri:', user);
    } catch (error) {
        console.error('Kullanıcı bilgileri alınamadı:', error);
    }
}

// Tüm kullanıcıları alma fonksiyonu
async function getAllUsers() {
    try {
        const users = await contract.methods.getAllUsers().call();
        console.log('Tüm kullanıcılar:', users);
    } catch (error) {
        console.error('Tüm kullanıcılar alınamadı:', error);
    }
}

// Kullanıcı güncelleme fonksiyonu
async function updateUser(userAddress, newUsername, newPassword) {
    try {
        const receipt = await contract.methods.updateUser(userAddress, newUsername, newPassword)
            .send({ from: account.address, gas: 2000000 });
        console.log('Kullanıcı güncellendi:', receipt);
    } catch (error) {
        console.error('Kullanıcı güncellenemedi:', error);
    }
}

// Örnek çağrılar
(async () => {
    await registerUser('testuser', 'testpassword');
    const userAddress = '0x123...'; // Kaydedilmiş bir kullanıcı adresi
    await getUser(userAddress);
    await getAllUsers();
    await updateUser(userAddress, 'newusername', 'newpassword');
})();
