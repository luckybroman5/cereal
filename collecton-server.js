'use strict';

/**
 * Naitve Deps
 */
const net = require('net');
const fs = require('fs');


/**
 * ThirdPartyDeps
 */
const prompt = require('prompt');

/**
 * Config
 */
const config = require('./config');

/**
 * Globals
 */
let readyToReceive = false;
let useSameDeviceName = false;

let data;


/**
 * Helpers
 */

const resetData = () => {
  data = {
    irCaptures: [],
    commandName: '',
    deviceName: useSameDeviceName ? data.deviceName :'',
  };
};

const saveData = () => {
  // const existingData = JSON.parse(fs.readFileSync(config.collectionServer.outputFile).toString());
  // console.log(existingData);
  // existingData.push(data);
  fs.appendFileSync(config.collectionServer.outputFile, JSON.stringify(data) + '\n');
}

/**
 * TCP Server
 */

const server = net.createServer((c) => {
  if (!readyToReceive) {
    // console.log('WARNING! GOT CONNECTON AND NOT READY!!');
    c.end();
    return;
  }
  console.log('Got Connection!');
  console.log('Press enter when done collecting... ');
  prompt.start();
  
  prompt.get(['done?'], function (err, result) {
    c.end();
  });

  c.on('data', (buffer) => {
    if (readyToReceive) {
      // data.irCaptures.push(data);
      const a = buffer.toString();
      console.log(a);
      data.irCaptures.push(a);
    }
  });

  c.on('end', () => {
    readyToReceive = false;
    console.log('client disconnected');
    if (data.irCaptures.length) {
      const schema = { properties: {'save?': { default: 'y' }} }
      prompt.get(schema, function (err, result) {
        if (result['save?'] === 'y') {
          saveData();
        }
        c.end();
        main(data.deviceName); // hardcoding device reset
      });
    }
  });
});

server.listen(config.collectionServer.port, config.collectionServer.ip, () => {
  console.log('opened collection server on', server.address());
  main();
});

/**
 * Main Code
 */

const main = (deviceName) => {
  readyToReceive = false;
  prompt.start();
  resetData();
  console.log('Please enter the Device and Command for which we are about to capture');
  const prompts = [ 'commandName' ];
  if (!deviceName) prompts.push('deviceName');
  prompt.get(prompts, function (err, result) {
    data.commandName = result.commandName;
    data.deviceName = deviceName || result.deviceName;
    readyToReceive = true;

    console.log('Waiting for connection...');
  });
};
