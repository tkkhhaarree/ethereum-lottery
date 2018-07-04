const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const provider = ganache.provider();
const web3 = new Web3(provider);

const {interface, bytecode} = require('../compile');

let accounts;
let lottery;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode})
        .send({from: accounts[0], gas: "1000000"});

    lottery.setProvider(provider);
});

describe("Lottery", () => {
    it("Deploys a contract", () => {
        assert.ok(lottery.options.address);
    });

    it("allows multiple account to enter", async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei("0.02", "ether")
        });

        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei("0.02", "ether")
        });

        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei("0.02", "ether")
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);
        assert.equal(3, players.length);
    });

    it("requires mimimum 0.1 eth to enter", async () => {
        try {
            await lottery.methods.enter().send({
                from: accounts[0],
                value: 200 // in wei.
            });
            assert(false);
        } catch (e) {
            assert(e);
        }
    });
});
