#!/usr/bin/env node
import React from "react";
import { render } from "ink";
// import meow from "meow";
import App from "./ui";

// const cli = meow(`
// 	Usage
// 	  $ git-interactive-stash

// 	Options
// 		--name  Your name

// 	Examples
// 	  $ git-interactive-stash --name=Jane
// 	  Hello, Jane
// `, {
// 	flags: {
// 		name: {
// 			type: 'string'
// 		}
// 	}
// });

(async () => {
	const { waitUntilExit } = render(<App />);

	await waitUntilExit();
})();
