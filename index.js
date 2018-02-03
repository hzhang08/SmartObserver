const Web3 = require('web3');
const Tx = require('ethereumjs-tx');

const contestAddr = "0xe99D9973e6f678970DD049803bdE20D9a984551b"; //1m
const observer = "0x4BC45e632d9aC2b70Ab3D5e7c7d3C92Ed069D658";
//0x738154f7912FD865D306Ad708CF956C7ef94fCE3
const walletAddr = "0xcDc296a1058515E198BeAf5D2e87eC2b620aac03";
const privateKey = new Buffer('privatekey', 'hex');
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
logAccounts();

function setObserver(){
    console.log(web3.eth);
}

function logAccounts(){
    // web3.eth.getAccounts((err, accounts) => {
    //     web3.eth.getBalance(accounts[0]).then((result) => {
    //         console.log(web3.utils.fromWei(result));
    //     });
    // });

    // const myContract = new web3.eth.Contract(ABIArray, contestAddr);
    // var p = myContract.methods.votes(0).call((error, result) => {
    //     console.log(result);
    // });
    
    // web3.eth.call({
    //     to: contestAddr,
    //     data: myContract.methods.owner.call().encodeABI()
    // }).then(result => 
    //     {console.log(result)});

    const contractAbi = web3.eth.contract(ABIArray);
    const contestContract = contractAbi.at(contestAddr);
    const contestObserver = contestContract.withdrawObserver.call();
    if(contestObserver != observer)
    {
        const setObserverData = contestContract.setObserver.getData(observer);
        // web3.eth.sendTransaction({
        //     to: contestAddr,
        //     from: walletAddr,
        //     data: setObserverData
        // });

        const gasPriceHex = web3.toHex(20000000000);
        const gasLimitHex = web3.toHex(1000000);
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
            data: setObserverData
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
    
    
    
}