'use strict';

var pickupTransport = require('nodemailer-pickup-transport');
var smtpTransport = require('nodemailer-smtp-transport');
module.exports = {
	db: 'mongodb://localhost/tarinapeli-m-dev',
	app: {
		title: 'tarinapeli_m - Development Environment'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || 'APP_ID',
		clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
		callbackURL: '/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
		clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
		callbackURL: '/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || 'APP_ID',
		clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
		callbackURL: '/auth/google/callback'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || 'APP_ID',
		clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
		callbackURL: '/auth/linkedin/callback'
	},
	github: {
		clientID: process.env.GITHUB_ID || 'APP_ID',
		clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
		callbackURL: '/auth/github/callback'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'Tarinapeli Ylläpito <teemukin65@gmail.com>',
		options: smtpTransport({
			host: 'smtp.gmail.com',// is the hostname or IP address to connect to (defaults to 'localhost')
			secure: true, // defines if the connection should use SSL (if true) or not (if false)
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'teemukin65@gmail.com'|| 'MAILER_EMAIL_ID',
				pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'

			},
			//ignoreTLS: turns off STARTTLS support if true
			//name: optional hostname of the client, used for identifying to the server
			// connectionTimeout:  how many milliseconds to wait for the connection to establish
			// greetingTimeout: how many milliseconds to wait for the greeting after connection is established
			//socketTimeout: how many milliseconds of inactivity to allow
			debug: true  // if true, the connection emits all traffic between client and server as 'log' events
			//authMethod: // defines preferred authentication method, eg. 'PLAIN'
		})
	}
};
