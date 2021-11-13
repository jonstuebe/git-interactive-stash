import React, { FC, useEffect } from "react";
import { Text } from "ink";
import simpleGit from "simple-git";

const git = simpleGit();

const App: FC<{ name?: string }> = ({ name = "Stranger" }) => {
	useEffect(() => {
		console.log(git.stashList());
	}, []);

	return (
		<Text>
			Hello, <Text color="green">{name}</Text>
		</Text>
	);
};

module.exports = App;
export default App;
