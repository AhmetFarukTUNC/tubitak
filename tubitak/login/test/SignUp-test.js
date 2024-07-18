const Web3 = require('web3');
const assert = require('assert');
const ganache = require('ganache-cli'); // Ganache test RPC kullanıyoruz
const { interface, bytecode } = require('./compile'); // compile.js dosyasından interface ve bytecode'u alıyoruz

const web3 = new Web3(ganache.provider()); // Ganache sağlayıcısını kullanarak web3 nesnesini oluşturuyoruz

let accounts;
let newContract;

beforeEach(async () => {
  // Test öncesinde hesapları alıyoruz
  accounts = await web3.eth.getAccounts();

  // NewContract kontratını deploy ediyoruz
  newContract = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: [accounts[0]] }) // arguments olarak accounts[0] (ilk hesap) kullanıyoruz
    .send({ from: accounts[0], gas: '1000000' }); // accounts[0] tarafından deploy ediyoruz
});

describe('NewContract', () => {
  it('deploys a contract', () => {
    assert.ok(newContract.options.address); // Kontratın adresinin tanımlı olduğunu doğruluyoruz
  });

  it('returns users from UserPanel', async () => {
    // NewContract üzerinden getUsersFromUserPanel fonksiyonunu çağırıyoruz
    const users = await newContract.methods.getUsersFromUserPanel().call();

    // Kullanıcıların geri döndüğünü doğruluyoruz
    assert.ok(users);
    assert.strictEqual(users.length, 0); // Başlangıçta kullanıcı olmadığı için uzunluğun 0 olduğunu kontrol ediyoruz
  });
});
