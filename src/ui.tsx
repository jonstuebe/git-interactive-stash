import React, { useEffect, useState } from "react";
import simpleGit, {
	DefaultLogFields,
	ListLogLine,
	LogResult,
} from "simple-git";
import { Box, Text } from "ink";
import Spinner from "ink-spinner";
import SelectInput from "ink-select-input";
import { formatRelative, parseISO } from "date-fns";

const git = simpleGit();

function App() {
	const [stashes, setStashes] = useState<
		readonly (DefaultLogFields & ListLogLine)[]
	>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		(async () => {
			const stashes = (await git.stashList()).all;
			console.log(stashes);
			setStashes(stashes);
			setIsLoading(false);
		})();
	}, []);

	if (isLoading) {
		return <Spinner type="dots" />;
	}

	return (
		<>
			<Text bold>Stashes:</Text>
			<SelectInput
				items={stashes.map((stash) => ({
					label: `${stash.message} (${formatRelative(
						parseISO(stash.date),
						new Date()
					)})`,
					value: stash.hash,
				}))}
				onSelect={async (item) => {
					// await git.stash({ show })
				}}
			/>
		</>
	);
}

export default App;
