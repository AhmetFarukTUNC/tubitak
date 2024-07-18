const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

// Build directory path
const buildPath = path.resolve(__dirname, 'build');

// Ensure build directory exists, if not create it
fs.ensureDirSync(buildPath);

// Path to the Solidity contract
const contractPath = path.resolve(__dirname, 'contracts', 'HititCoin.sol');

// Read the Solidity contract source code
const source = fs.readFileSync(contractPath, 'utf8');

// Solidity compiler input structure
const input = {
    language: 'Solidity',
    sources: {
        'HititCoin.sol': {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['abi', 'evm.bytecode']
            }
        }
    }
};

// Compile the contract
const output = JSON.parse(solc.compile(JSON.stringify(input)));

// Check for errors in the output
if (output.errors) {
    output.errors.forEach(err => {
        console.error(err.formattedMessage);
    });
    throw new Error("Compilation failed");
}

// Extract the ABI and bytecode
const contractName = 'HititCoin';
const compiledContract = output.contracts['HititCoin.sol'][contractName];

if (!compiledContract) {
    throw new Error(`Contract ${contractName} not found in the compiled output`);
}

const abi = compiledContract.abi;
const bytecode = compiledContract.evm.bytecode.object;

// Write the ABI and bytecode to separate files in the build directory
fs.outputJSONSync(
    path.resolve(buildPath, `${contractName}.abi.json`),
    abi
);

fs.outputJSONSync(
    path.resolve(buildPath, `${contractName}.bytecode.json`),
    bytecode
);

console.log('Contract compiled successfully');
