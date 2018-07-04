import React, { Component } from 'react';
import './App.css';
import web3 from './web3';
import lottery from'./lottery'

class App extends Component {

    constructor(props){
        super(props);
        this.state = {manager: "", players: [], balance: "", value: "", message: "", lastWinner: ''};
    }

    async componentDidMount(){
        const manager = await lottery.methods.manager().call();
        const players = await lottery.methods.getPlayers().call();
        const balance = await web3.eth.getBalance(lottery.options.address);
        this.setState({manager, players, balance});
        console.log(manager);
    }

    onSubmit = async (event) => {
        event.preventDefault();
        const accounts = await web3.eth.getAccounts();
        this.setState({message: "Waiting for transaction to complete..."});
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei(this.state.value, 'ether')
        });
        this.setState({message: "You have entered the lottery!"})
    };

    onClick = async () => {
        const accounts = await web3.eth.getAccounts();
        this.setState({message: "Waiting for transaction to complete..."});
        await lottery.methods.pickWinner().send({
            from: accounts[0]
        });
        const lastWinner = await lottery.methods.index().call();
        console.log("winner: "+lastWinner);
        this.setState({message: "Winner is Picked! Winner is the account address: "+this.state.players[lastWinner]});

    };

  render() {
      web3.eth.getAccounts().then(console.log);
    return (
      <div>
          <h2>Lottery Contract</h2>
          <p>this contract is run by {this.state.manager}.<br/>
          There are currently {this.state.players.length} people in the lottery,<br/>
          competing to win {web3.utils.fromWei(this.state.balance, 'ether')} Ether!.</p>
      <hr/>
          <form onSubmit={this.onSubmit}>
              <h4>Want to try your luck?</h4>
              <div>
                  <label>Amount of ether to enter: </label>

                  <input
                      value={this.state.value}
                      onChange={event => this.setState({value: event.target.value})}/>
              </div>
              <button>Enter!</button>
          </form>
          <hr/>
          <h3>Ready to pick a winner?</h3>
          <button onClick={this.onClick}>Pick Winner!</button>
          <h2>{this.state.message}</h2>
      </div>
    );
  }
}

export default App;
