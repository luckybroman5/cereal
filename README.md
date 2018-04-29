## Nodejs IR Code Capture aka.. NIRCC

### What is this?

This is a project that allows you to connect an arduino to an IR receiver / transmitter, record Infa-Red signals from remotes, and then transmit them.

### Architecture

It uses two nodejs servers communicating over plain-old TCP. The arduino speaks to some IoT device running noodejs we'll call "**The Serial Pipe**".

The arduino is connected to either an Infa-Red *Receiver* **or** *Transmitter*. 

The arduino's role is simple, read / write the data to or from the IR device, and communicate over a serial connection to the **Serial Pipe**.

The *Serial Pipe* will then transmit the data to a **Host Server** over raw tcp.

A **Host Server** can then do whatever it wants with the data, and interact with the user.

In the case of Capturing **IR Signals**, it will put the data as JSON in an output file.

### What You'll Need:

##### I'm sure that there can be many types of devices used, however, this is what I used:

###### Hardware

|Device|Purpose|Link|
|------|-------|----|
| Onion Omega 2 | Serial Pipe | https://onion.io/omega2/ |
| A Full Size Computer, or Server | Host Server | N / A |
| ELEGOO IR Receiver | IR Receiver | [https://www.sunfounder.com/learn/](https://www.sunfounder.com/learn/From-Knowing-To-Utilizing-Kit-V1-0-for-Arduino/lesson-21-infrared-receiver-starter-basic-kit-v1-0-for-arduino.html)|
| Onion Omega Arduino Board | arduino | https://onion.io/store/arduino-dock-r2/ |

###### Software
1. Nodejs 6+ on host server 
2. Nodejs on Serial Pipe
3. Arduino IDE

### Usage

##### Collecting IR Data

1. Compile or upload the arduino code to the arduino device
2. Update the IP's and ports in `confg.js` for both the devices.
3. Build, Deploy, and run the code on the IoT device:
```
npm build && npm upload
```
   - Make sure you add the correct ssh user and host in the package.json
   - You can generate an ssh key and specify the `-i` option to make the process quicker, otherwise, delete the `-i` flag
4. Run the Host Server, and follow the command prompts.
```
node collecton-server.js
```
   - When it asks, hold up the remote to the IR receiver, and press the button
   - When done capturing the signal, press enter
5. Go and look at the data you captured in your `output` file.

#### TODO's
1. Use GPIO's on IoT device rather than an Arduino
2. Improve Command Prompts
3. Implement IR Trasmitter Bit.
4. Make the IR Receiver send the Devce Type back (ie. Samsung, LG, Sony, etc..)
5. Build a rest API to trigger actions on the remote