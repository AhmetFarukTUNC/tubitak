const HDWalletProvider = require('@truffle/hdwallet-provider');
const {Web3} = require('web3');
const fs = require('fs');
const path = require('path');

app = Flask(__name__)

// MetaMask mnemonik cümleniz
const mnemonic = 'hill sing city sweet comic history confirm decline risk capable oxygen unit';
// Infura URL'nizi buraya ekleyin
const infuraUrl = 'https://eth-sepolia.g.alchemy.com/v2/gaSqGc4gDONKTkGJcXdHe3BJnwgdov9c'; // Örneğin, ropsten için

// Contract build path
const buildPath = path.resolve(__dirname, 'build');

// ABI ve bytecode dosyalarını yükleyin
let abi, bytecode;
try {
    abi = JSON.parse(fs.readFileSync(path.resolve(buildPath, 'UserRegistry.abi.json'), 'utf8'));
    bytecode = JSON.parse(fs.readFileSync(path.resolve(buildPath, 'UserRegistry.bytecode.json'), 'utf8'));
} catch (error) {
    console.error('Error reading ABI or bytecode files:', error);
    process.exit(1); // Exit the process with an error code
}

// HDWalletProvider ve Web3'ü başlatın
const provider = new HDWalletProvider(mnemonic, infuraUrl);
const web3 = new Web3(provider);

// Kontratı dağıtma fonksiyonu
const deploy = async () => {
    try {
        const accounts = await web3.eth.getAccounts();
        console.log('Deploying from account:', accounts[0]);

        const result = await new web3.eth.Contract(abi)
            .deploy({ data: '0x' + bytecode })
            .send({ from: accounts[0], gas: '1500000', gasPrice: '30000000000' });

        console.log('Contract deployed to:', result.options.address);
    } catch (error) {
        console.error('An error occurred during deployment:', error);
    } finally {
        provider.engine.stop(); // Sağlayıcıyı kapatın
    }
};

deploy().catch(error => {
    console.error('Unhandled promise rejection:', error);
});
