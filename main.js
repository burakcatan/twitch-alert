const tmi = require('tmi.js');
const chalk = require('chalk');

const player = require('play-sound')(opts = {})

const { Client } = require('node-osc');
const oscClient = new Client('127.0.0.1', 21600);

const client = new tmi.Client({
	channels: [ 'koraybirand' ]
});

client.connect();

// Sounds
const sounds = {
	blink: 'sounds/blink.mp3',
	success: 'sounds/success.mp3'
}

// OSC Presets
const oscPresets = {
	ColorEffect: {
		activation: '/live/Control_Panel/cue/Color_Effect/activate',
		deactivation: '/live/Control_Panel/cue/Color_Effect/deactivate'
	}
}		


// Functions

const sendOscSignal = (oscObject, duration) => {
	oscClient.send(oscObject.activation, 0, () => {
		setTimeout(()=>{
			oscClient.send(oscObject.deactivation, 0);
		}, duration);
	});
};

const playSound = (path) => {
	player.play(path, (err) => {
		if (err) throw err;
	})
}

// Event listeners

client.on("subscription", function (channel, username, methods ) {
	console.log(chalk.bold(username), chalk.yellow('abone oldu.'));
	playSound(sounds.blink);
	sendOscSignal(oscPresets.ColorEffect, 5000);
});

client.on("resub", function (channel, username, months, message, userstate, methods) {
	console.log(chalk.bold(username), chalk.yellow('abone oldu.'));
	playSound(sounds.blink);
	sendOscSignal(oscPresets.ColorEffect, 5000);
});

client.on('subgift',function (channel, username, streakMonths, recipient, methods, userstate) {
    console.log(chalk.bold(username), chalk.green('has gifted subscription to'), chalk.bold(recipient));
    playSound(sounds.success);
	sendOscSignal(oscPresets.ColorEffect, 5000);
});

client.on('hosted', function(channel, username, viewers, autohost){
    console.log(chalk.magenta(`${username} has hosted the stream!`));
	playSound(sounds.success);
	sendOscSignal(oscPresets.ColorEffect, 5000);
});

client.on('raided', function(channel, username, viewers){
    console.log(chalk.magenta(`${username} has raided the broadcast with ${viewers}!`));
	playSound(sounds.success);
	sendOscSignal(oscPresets.ColorEffect, 5000);
});

// client.on('message', (channel, tags, message, self) => {
// 	console.log(message);
// 	playSound(sounds.success);
// });