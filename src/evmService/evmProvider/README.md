# Updating the EVM version

After changing _src/evm.js_, follow the instructions below to recompile it.

# EVM in iframe

When either `src/evm-iframe.js` is updated or the `evm.js` is replaced, please install the package
```
    ethereumjs-abi@0.6.5,
    ethereumjs-account@2.0.4,
    ethereumjs-blockchain@2.1.0,
    ethereumjs-tx@1.3.4,
    ethereumjs-util@5.1.5,
    ethereumjs-vm@2.3.3,
```
then enter the directory `/src`, re-browserify with with:  
```sh
browserify evm-iframe.js -o evm-iframe-bundle.js
```

Then copy the file `evm-iframe-bundle.js`  to `./dist`.

