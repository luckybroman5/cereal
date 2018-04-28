'use strict';

import fs from 'fs';
import net from 'net';
import config from './config';

/**
 * Instance Variables
 */
let isConnected = false;
let client;
const src = fs.createReadStream('/dev/ttyS1');

console.log('ALIVE AND READY!!');
 
const tryToConnect = () => {
  console.log('Trying to connect on..', { port: config.collectionServer.port, host: config.collectionServer.ip })
  client = net.createConnection({ port: config.collectionServer.port, host: config.collectionServer.ip }, () => {
    isConnected = true;
    console.log('connected to server!');
  });
  client.on('data', (data) => {
    console.log(data.toString());
  });
  client.on('end', () => {
    console.log('disconnected from server');
    isConnected = false;
  });
  client.on('error', console.log);
};

src.on('data', (chunk) => {
  console.log(chunk.toString());
  client.write(chunk.toString().trim());
});

setInterval(() => {
  if (!isConnected) tryToConnect();
}, 1000);