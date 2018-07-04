const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require('Web3');
const {interface, bytecode} = require('./compile');

const provider = new HDWalletProvider(
    "buyer wisdom daughter swift release glow caught twice melody pole profit anchor",
    "https://rinkeby.infura.io/D8nLD5KUdNsOxz12XSBX"
);
const web3 = new Web3(provider);
console.log("provider info: " + provider);
const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log("account used: " + accounts[0])
    result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode})
        .send({from: accounts[0], gas: "2000000"});
    console.log(interface);
    console.log("deployed to address: " + result.options.address);
};
deploy();