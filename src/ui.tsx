import React, { useEffect, useState } from "react";
import simpleGit, { DefaultLogFields, ListLogLine } from "simple-git";
import { Text, TextProps, useApp, useInput } from "ink";
import SelectInput from "ink-select-input";
import { formatRelative, parseISO } from "date-fns";

const git = simpleGit();

function ConfirmInput({
	message,
	messageProps,
	defaultConfirmed = true,
	onSubmit,
}: {
	message: string;
	messageProps?: TextProps;
	defaultConfirmed: boolean;
	onSubmit: (confirmed: boolean) => void;
}) {
	const [confirmed, setConfirmed] = useState(defaultConfirmed);
	useInput((input, key) => {
		if (input === "y") {
			setConfirmed(true);
		} else if (input === "n") {
			setConfirmed(false);
		}

		if (key.return) {
			onSubmit(confirmed);
		}
	});

	return (
		<Text {...messageProps}>
			{message} ({defaultConfirmed === true ? "Y/n" : "y/N"})
		</Text>
	);
}

function App() {
	const { exit } = useApp();
	const [stashes, setStashes] = useState<
		readonly (DefaultLogFields & ListLogLine)[]
	>([]);
	const [selectedStashIndex, setSelectedStashIndex] = useState<
		string | undefined
	>();

	useEffect(() => {
		(async () => {
			const stashes = (await git.stashList()).all;
			setStashes(stashes);
		})();
	}, []);

	if (selectedStashIndex) {
		return (
			<>
				<ConfirmInput
					message="Remove the stash after applying it?"
					messageProps={{
						color: "cyan",
					}}
					defaultConfirmed
					onSubmit={async (confirmed) => {
						if (confirmed) {
							await git.stash([
								confirmed ? "pop" : "apply",
								"--index",
								selectedStashIndex.toString(),
							]);
						}

						exit();
					}}
				/>
			</>
		);
	}

	// choose stash ui
	return (
		<>
			<Text bold>Choose Stash</Text>
			<SelectInput
				items={stashes.map((stash, idx) => ({
					label: `${stash.message} (${formatRelative(
						parseISO(stash.date),
						new Date()
					)})`,
					value: idx,
				}))}
				onSelect={(item) => {
					setSelectedStashIndex(item.value.toString());
				}}
			/>
		</>
	);
}

export default App;
