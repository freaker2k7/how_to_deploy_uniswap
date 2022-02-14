//** Please note this is a draft and this code is under heavy development. Not to be used in production **
'use strict';
const fs = require('fs');
const HDWalletProvider = require('truffle-hdwallet-provider');

var data,
    data_object,
    uniswapV2Bytecode,
    uniswapV2Abi,
    uniswapMulticallBytecode,
    uniswapMulticallAbi,
    uniswapMigratorBytecode,
    uniswapMigratorAbi,
    uniswapRouterBytecode,
    uniswapRouterAbi,
    uniswapEnsRegistryBytecode,
    uniswapEnsRegistryAbi,
    uniswapUnisocksBytecode,
    uniswapUnisocksAbi,
    uniswapWETHBytecode,
    uniswapWETHAbi,
    gasRelayHubAddressAbi,
    gasRelayHubAddressBytecode,
    Web3,
    provider,
    accounts,
    _feeToSetter,
    web3;

function get_data(_message) {
    return new Promise(function(resolve, reject) {
        fs.readFile('../installation_data.json', (err, data) => {
            if (err) throw err;
            resolve(data);
        });
    });
}

function write_data(_message) {
    fs.writeFileSync('../installation_data.json', _message);
}

var privateKeys = [];
var URL = "";

var foo1 = async ()  => {
    return new Promise(async (resolve, reject) => {
        console.log("Deploying Uniswap V2 now, please wait ...");
        let uniswapV2;
        uniswapV2 = await web3.eth.sendTransaction({
            from: accounts[2],
            data: uniswapV2Bytecode
        }); // Charlie accounts[2] is the owner
        console.log('>> uniswapV2:', uniswapV2.contractAddress);
        let uniswapV2Instance = new web3.eth.Contract(uniswapV2Abi, uniswapV2.contractAddress);
        await uniswapV2Instance.deploy({
                data: uniswapV2Bytecode,
                arguments: [_feeToSetter]
            })
            .send({
                from: accounts[2],
                gas: 4700000,
                gasPrice: '1000'
            }, function(error, transactionHash1) {
                console.log(transactionHash1);
            })
            .on('error', function(error) {
                console.log(error);
                reject();
            })
            .on('transactionHash1', function(transactionHash1) {
                console.log("1 Transaction hash: " + transactionHash1);
            })
            .on('receipt', function(receipt) {
                console.log("1 Contract address: " + receipt.contractAddress) // contains the new contract address
                data_object.contract_address.uniswap_v2 = receipt.contractAddress;
                let data_to_write = JSON.stringify(data_object, null, 2);
                write_data(data_to_write);
                resolve();
            })
            .then(function(newContractInstance1) {
                console.log(newContractInstance1.options.address) // instance with the new contract address
                var feeTo = newContractInstance1.methods.feeTo().call()
                feeTo.then(function(resultFeeTo) {
                    console.log("feeTo is currently set to: " + resultFeeTo);
                    
                    var feeToSetter = newContractInstance1.methods.feeToSetter().call()
                    feeToSetter.then(function(resultFeeToSetter) {
                        console.log("feeToSetter is currently set to: " + resultFeeToSetter);
                    })
                })
            })
    });
};
var foo2 = async ()  => {
    return new Promise(async (resolve, reject) => {
        // Uniswap V2 WETH
        // V2 WETH Deployment
        console.log("Deploying WETH now, please wait ...");
        let uniswapWETH;
        uniswapWETH = await web3.eth.sendTransaction({
            from: accounts[2],
            data: uniswapWETHBytecode
        }); // Charlie accounts[2] is the owner
        console.log('>> uniswapWETH:', uniswapWETH.contractAddress);
        let uniswapWETHInstance = new web3.eth.Contract(uniswapWETHAbi, uniswapWETH.contractAddress);
        await uniswapWETHInstance.deploy({
                data: uniswapWETHBytecode
            })
            .send({
                from: accounts[2],
                gas: 4700000,
                gasPrice: '1000'
            }, function(error, transactionHash2) {
                console.log(transactionHash2);
            })
            .on('error', function(error) {
                console.log(error);
                reject();
            })
            .on('transactionHash2', function(transactionHash2) {
                console.log("2 Transaction hash: " + transactionHash2);
            })
            .on('receipt', function(receipt1) {
                console.log("2 Contract address: " + receipt1.contractAddress) // contains the new contract address
                data_object.contract_address.weth = receipt1.contractAddress;
                let data_to_write = JSON.stringify(data_object, null, 2);
                write_data(data_to_write);
                resolve();
            })
            .then(function(newContractInstance2) {
                console.log(newContractInstance2.options.address) // instance with the new contract address
                var name = newContractInstance2.methods.name().call()
                name.then(function(resultName) {
                    console.log("Name set to: " + resultName);
                    
                    var symbol = newContractInstance2.methods.symbol().call()
                    symbol.then(function(resultSymbol) {
                        console.log("Symbol set to: " + resultSymbol);
                        
                        var totalSupply = newContractInstance2.methods.totalSupply().call()
                        totalSupply.then(function(resultTotalSupply) {
                            console.log("Total Supply set to: " + resultTotalSupply);
                        })
                    })
                })
            })
    });
};
var foo3 = async ()  => {
    return new Promise(async (resolve, reject) => {
        // Uniswap V2 ROUTER2
        // V2 ROUTER2 Deployment
        console.log("Deploying ROUTER2 now, please wait ...");
        // let uniswapROUTER2;
        // uniswapROUTER2 = await web3.eth.sendTransaction({
        //     from: accounts[2],
        //     data: uniswapRouterBytecode
        // }); // Charlie accounts[2] is the owner
        // console.log('>> uniswapROUTER2:', uniswapROUTER2.contractAddress, [data_object.contract_address.uniswap_v2, data_object.contract_address.weth]);
        console.log('>> uniswapROUTER2:', [data_object.contract_address.uniswap_v2, data_object.contract_address.weth]);
        let uniswapROUTER2Instance = new web3.eth.Contract(uniswapRouterAbi); //, uniswapROUTER2.contractAddress);
        await uniswapROUTER2Instance.deploy({
            data: uniswapRouterBytecode,
            arguments: [data_object.contract_address.uniswap_v2, data_object.contract_address.weth]
        })
        .send({
            from: accounts[2],
            gas: 14700000,
            gasPrice: '1000'
        }, function(error, transactionHash3) {
            console.log(transactionHash3);
        })
        .on('error', function(error) {
            console.log(error);
            reject();
        })
        .on('transactionHash3', function(transactionHash3) {
            console.log("3 Transaction hash: " + transactionHash3);
        })
        .on('receipt', function(receipt2) {
            console.log("3 Contract address: " + receipt2.contractAddress) // contains the new contract address
            data_object.contract_address.router = receipt2.contractAddress;
            let data_to_write = JSON.stringify(data_object, null, 2);
            write_data(data_to_write);
            resolve();
        })
        .then(function(newContractInstance3) {
            console.log(newContractInstance3.options.address) // instance with the new contract address
            var factoryVar = newContractInstance3.methods.factory().call()
            factoryVar.then(function(resultFactory) {
                console.log("Router2's factory set to: " + resultFactory);
                
                var wethVar = newContractInstance3.methods.WETH().call()
                wethVar.then(function(resultWeth) {
                    console.log("Router2's WETH set to: " + resultWeth);
                })
            })
        })
    });
};
var foo4 = async ()  => {
    return new Promise(async (resolve, reject) => {
        // Uniswap V2 Migrator
        // V2 Migrator Deployment
        console.log("Deploying Migrator now, please wait ...");
        let uniswapMigrator;
        uniswapMigrator = await web3.eth.sendTransaction({
            from: accounts[2],
            data: uniswapMigratorBytecode
        }); // Charlie accounts[2] is the owner
        console.log('>> uniswapMigrator:', uniswapMigrator.contractAddress, data_object.contract_address);
        let uniswapMigratorInstance = new web3.eth.Contract(uniswapMigratorAbi, uniswapMigrator.contractAddress);
        await uniswapMigratorInstance.deploy({
                data: uniswapMigratorBytecode,
                arguments: [data_object.contract_address.uniswap_factory, data_object.contract_address.router]
            })
            .send({
                from: accounts[2],
                gas: 4700000,
                gasPrice: '1000'
            }, function(error, transactionHash4) {
                console.log(transactionHash4);
            })
            .on('error', function(error) {
                console.log(error);
                reject();
            })
            .on('transactionHash4', function(transactionHash4) {
                console.log("4 Transaction hash: " + transactionHash4);
            })
            .on('receipt', function(receipt3) {
                console.log("4 Contract address: " + receipt3.contractAddress) // contains the new contract address
                data_object.contract_address.migrator = receipt3.contractAddress;
                let data_to_write = JSON.stringify(data_object, null, 2);
                write_data(data_to_write);
                resolve();
            })
            .then(function(newContractInstance4) {
                console.log(newContractInstance4.options.address) // instance with the new contract address
            })
    });
};
var foo5 = async ()  => {
    return new Promise(async (resolve, reject) => {
        // Uniswap V2 Multicall
        // V2 Multicall Deployment
        console.log("Deploying Multicall now, please wait ...");
        let uniswapMulticall;
        uniswapMulticall = await web3.eth.sendTransaction({
            from: accounts[2],
            data: uniswapMulticallBytecode
        }); // Charlie accounts[2] is the owner
        console.log('>> uniswapMulticall:', uniswapMulticall.contractAddress);
        let uniswapMulticallInstance = new web3.eth.Contract(uniswapMulticallAbi, uniswapMulticall.contractAddress);
        await uniswapMulticallInstance.deploy({
                data: uniswapMulticallBytecode
            })
            .send({
                from: accounts[2],
                gas: 47000000,
                gasPrice: '1000'
            }, function(error, transactionHash5) {
                console.log(transactionHash5);
            })
            .on('error', function(error) {
                console.log('!!', error);
                reject();
            })
            .on('transactionHash5', function(transactionHash5) {
                console.log("5 Transaction hash: " + transactionHash5);
            })
            .on('receipt', function(receipt4) {
                console.log("5 Contract address: " + receipt4.contractAddress) // contains the new contract address
                data_object.contract_address.multicall = receipt4.contractAddress;
                let data_to_write = JSON.stringify(data_object, null, 2);
                write_data(data_to_write);
                resolve();
            })
            .then(function(newContractInstance5) {
                console.log('>>', newContractInstance5.options.address) // instance with the new contract address
            })
    });
};
var foo6 = async ()  => {
    return new Promise(async (resolve, reject) => {
        // V2 ENS registry Deployment
        console.log("Deploying ENS registry now, please wait ...");
        let ensRegistry;
        ensRegistry = await web3.eth.sendTransaction({
            from: accounts[2],
            data: uniswapEnsRegistryBytecode
        }); // Charlie accounts[2] is the owner
        console.log('>> ensRegistry:', ensRegistry.contractAddress);
        let uniswapEnsRegistryInstance = new web3.eth.Contract(uniswapEnsRegistryAbi, ensRegistry.contractAddress);
        await uniswapEnsRegistryInstance.deploy({
                data: uniswapEnsRegistryBytecode,
                arguments: [accounts[2]]
            })
            .send({
                from: accounts[2],
                gas: 4700000,
                gasPrice: '1000'
            }, function(error, transactionHash6) {
                console.log(transactionHash6);
            })
            .on('error', function(error) {
                console.log(error);
                reject();
            })
            .on('transactionHash6', function(transactionHash6) {
                console.log("6 Transaction hash: " + transactionHash6);
            })
            .on('receipt', function(receipt6) {
                console.log("6 Contract address: " + receipt6.contractAddress) // contains the new contract address
                data_object.contract_address.ens_registry = receipt6.contractAddress;
                let data_to_write = JSON.stringify(data_object, null, 2);
                write_data(data_to_write);
                resolve();
            })
            .then(function(newContractInstance6) {
                console.log(newContractInstance6.options.address) // instance with the new contract address
            })
    });
};
var foo7 = async ()  => {
    return new Promise(async (resolve, reject) => {
         // V2 Gas relay hub address
        console.log("Deploying Gas relay hub address contract now, please wait ...");
        let gasRelayHubAddress;
        gasRelayHubAddress = await web3.eth.sendTransaction({
            from: accounts[2],
            data: gasRelayHubAddressBytecode
        }); // Charlie accounts[2] is the owner
        console.log('>> gasRelayHubAddress:', gasRelayHubAddress.contractAddress);
        let gasRelayHubAddressInstance = new web3.eth.Contract(gasRelayHubAddressAbi, gasRelayHubAddress.contractAddress);
        await gasRelayHubAddressInstance.deploy({
                data: gasRelayHubAddressBytecode
            })
            .send({
                from: accounts[2],
                gas: 4700000,
                gasPrice: '1000'
            }, function(error, transactionHash7) {
                console.log(transactionHash7);
            })
            .on('error', function(error) {
                console.log(error);
                reject();
            })
            .on('transactionHash7', function(transactionHash7) {
                console.log("7 Transaction hash: " + transactionHash7);
            })
            .on('receipt', function(receipt7) {
                console.log("7 Contract address: " + receipt7.contractAddress) // contains the new contract address
                data_object.contract_address.gas_relay_hub_address = receipt7.contractAddress;
                let data_to_write = JSON.stringify(data_object, null, 2);
                write_data(data_to_write);
                resolve();
            })
            .then(function(newContractInstance7) {
                console.log(newContractInstance7.options.address) // instance with the new contract address
            });
    });
};

(async () => {
    // Read in the configuration information
    data = await get_data();
    data_object = JSON.parse(data);
    // Add keys
    console.log("Adding Alice, Bob and Charlie keys ...");
    privateKeys.push(data_object.private_key.alice, data_object.private_key.bob, data_object.private_key.charlie);
    // RPC
    URL = data_object.provider.rpc_endpoint;

    // Web3 - keys and accounts
    Web3 = require("web3");
    provider = new HDWalletProvider(privateKeys, URL, 0, 3);
    web3 = new Web3(provider);
    await web3.eth.net.isListening();
    console.log('Web3 is connected.');
    accounts = await web3.eth.getAccounts();
    console.log(`accounts: ${JSON.stringify(accounts)}`);
    // -- Uniswap V2
    uniswapV2Bytecode = data_object.bytecode.uniswap_v2;
    uniswapV2Abi = data_object.abi.uniswap_v2;
    uniswapMulticallBytecode = data_object.bytecode.multicall;
    uniswapMulticallAbi = data_object.abi.multicall;
    uniswapMigratorBytecode = data_object.bytecode.migrator;
    uniswapMigratorAbi = data_object.abi.migrator;
    uniswapRouterBytecode = data_object.bytecode.router;
    uniswapRouterAbi = data_object.abi.router;
    uniswapEnsRegistryBytecode = data_object.bytecode.ens_registry;
    uniswapEnsRegistryAbi = data_object.abi.ens_registry;
    uniswapUnisocksBytecode = data_object.bytecode.unisocks;
    uniswapUnisocksAbi = data_object.abi.unisocks;
    uniswapWETHBytecode = data_object.bytecode.weth;
    uniswapWETHAbi = data_object.abi.weth;
    gasRelayHubAddressAbi = data_object.abi.gas_relay_hub_address;
    gasRelayHubAddressBytecode = data_object.bytecode.gas_relay_hub_address;

    // Fee to setter account controls this factory forever. Please choose your feeToSetter account carefully
    // Must be secure and preserved; this is paramount
    _feeToSetter = accounts[2];
    // Uniswap V2
    // V2 Factory Deployment
    
    await foo1();
    await foo2();
    await foo3();
    await foo4();
    await foo5();
    await foo6();
    await foo7();

    let data_to_write = JSON.stringify(data_object, null, 2);
    await write_data(data_to_write);
    await provider.engine.stop();
})();
