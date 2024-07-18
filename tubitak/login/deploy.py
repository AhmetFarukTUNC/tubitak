import os
import json
from flask import Flask, render_template, request, redirect, url_for
from web3 import Web3
from solcx import compile_standard
from dotenv import load_dotenv
from web3.middleware import geth_poa_middleware

load_dotenv()

app = Flask(__name__)

# Load Infura API key and MetaMask wallet address from environment variables
infura_url = os.getenv('INFURA_URL')
wallet_address = "0x05995d580cb43E94b2bed8c80b8eAFb165deB37c"
private_key = "0xb44632a0ffd02f4ff07bec1228b5cd26b7d635710c81f02a5d11a68d050dc396"

# Solidity contract compilation
with open("./contracts/Login.sol", "r", encoding="utf-8") as file:
    simple_storage_file = file.read()

compiled_sol = compile_standard(
    {
        "language": "Solidity",
        "sources": {"Login.sol": {"content": simple_storage_file}},
        "settings": {
            "outputSelection": {
                "*": {"*": ["abi", "metadata", "evm.bytecode", "evm.sourceMap"]}
            }
        },
    },
    solc_version="0.6.0",
)

# Save compiled contract information to JSON file
with open("compiled_code.json", "w") as file:
    json.dump(compiled_sol, file)

# Retrieve bytecode and ABI from compiled contract
bytecode = compiled_sol["contracts"]["Login.sol"]["Login"]["evm"]["bytecode"]["object"]
abi = compiled_sol["contracts"]["Login.sol"]["Login"]["abi"]

# Connect to Ethereum via Infura
w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))



# Contract deployment and interaction
contract = w3.eth.contract(abi=abi, bytecode=bytecode)



# Prepare transaction parameters
nonce = w3.eth.get_transaction_count(wallet_address)
gas_price = w3.to_wei('20', 'gwei')
gas_limit = 2000000
chain_id = 1337  # Sepolia testnet chain ID

# Deploy the contract
transaction = contract.constructor().build_transaction({
    'chainId': chain_id,
    'from': wallet_address,
    'nonce': nonce,
    'gas': gas_limit,
    'gasPrice': gas_price,
})

# Sign and send transaction with MetaMask (MetaMask handles signing internally)
signed_txn = w3.eth.account.sign_transaction(transaction, private_key=private_key)

tx_hash = w3.eth.send_raw_transaction(signed_txn.rawTransaction)
tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

# Instantiate deployed contract
deployed_contract = w3.eth.contract(
    address=tx_receipt.contractAddress,
    abi=abi,
)

print(tx_receipt.contractAddress)


# Register user
nonce += 1  # Increment nonce for the next transaction
register_transaction = deployed_contract.functions.register("mehmet", "12345").build_transaction({
    'chainId': chain_id,
    'from': wallet_address,
    'nonce': nonce,
    'gas': gas_limit,
    'gasPrice': gas_price,
})

signed_register_txn = w3.eth.account.sign_transaction(register_transaction, private_key=private_key)
send_register_tx = w3.eth.send_raw_transaction(signed_register_txn.rawTransaction)
tx_receipt_register = w3.eth.wait_for_transaction_receipt(send_register_tx)

# Interact with contract functions
login_result = deployed_contract.functions.login("mehmett", "12345").call()
print("Login result:", login_result)

user_info = deployed_contract.functions.getUser(wallet_address).call()
print("User info:", user_info)

password = deployed_contract.functions.getPassword(wallet_address).call()
print("Password:", password)

# Example of updating contract data
update_transaction = deployed_contract.functions.updatePassword("new_password").build_transaction({
    'chainId': chain_id,
    'from': wallet_address,
    'nonce': nonce + 1,
    'gas': gas_limit,
    'gasPrice': gas_price,
})

signed_update_txn = w3.eth.account.sign_transaction(update_transaction, private_key=private_key)
send_update_tx = w3.eth.send_raw_transaction(signed_update_txn.rawTransaction)
tx_receipt_update = w3.eth.wait_for_transaction_receipt(send_update_tx)

updated_password = deployed_contract.functions.getPassword(wallet_address).call()
print("Updated password:", updated_password)

# Remember to handle exceptions and errors appropriately in production code.

# Example of updating contract data
update_transaction = deployed_contract.functions.updateUser("new_user").build_transaction({
    'chainId': chain_id,
    'from': wallet_address,
    'nonce': nonce + 2,
    'gas': gas_limit,
    'gasPrice': gas_price,
})

signed_update_txn = w3.eth.account.sign_transaction(update_transaction, private_key=private_key)
send_update_tx = w3.eth.send_raw_transaction(signed_update_txn.rawTransaction)
tx_receipt_update = w3.eth.wait_for_transaction_receipt(send_update_tx)

updated_password = deployed_contract.functions.getUser(wallet_address).call()
print("Updated user:", updated_password)

@app.route('/')
def index():
    return render_template('./index.html')

@app.route('/register', methods=['POST'])
def register():
    username = request.form['username']
    password = request.form['password']

    nonce = w3.eth.get_transaction_count(wallet_address)
    gas_price = w3.to_wei('20', 'gwei')
    gas_limit = 4000000
    chain_id = 1337  # Sepolia testnet chain ID

    # Register user
    register_transaction = contract.functions.register(username, password).build_transaction({
        'chainId': chain_id,
        'from': wallet_address,
        'nonce': nonce,
        'gas': gas_limit,
        'gasPrice': gas_price,
        'to':tx_receipt.contractAddress
        
    })

    

    signed_register_txn = w3.eth.account.sign_transaction(register_transaction, private_key=private_key)
    send_register_tx = w3.eth.send_raw_transaction(signed_register_txn.rawTransaction)
    tx_receipt_register = w3.eth.wait_for_transaction_receipt(send_register_tx)

    return redirect(url_for('result', result='User Registered'))

@app.route('/login', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']

    nonce = w3.eth.get_transaction_count(wallet_address)
    gas_price = w3.to_wei('20', 'gwei')
    gas_limit = 4000000
    chain_id = 1337  # Sepolia testnet chain ID

    # Register user
    
    
    login_result = deployed_contract.functions.login(username, password).call()

    if login_result:
        result = "Login Successful"
    else:
        result = "Login Failed"

    return redirect(url_for('result', result=result))

@app.route('/result')
def result():
    result = request.args.get('index')
    return render_template('index.html', result=result)

if __name__ == '__main__':
    app.run(debug=True)