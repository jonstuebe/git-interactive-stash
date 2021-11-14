import React, { useEffect, useState } from "react";
import simpleGit, { DefaultLogFields, ListLogLine } from "simple-git";
import { Box, Text, TextProps, useApp, useInput } from "ink";
import SelectInput from "ink-select-input";
import { formatRelative, parseISO } from "date-fns";
import Spinner from "ink-spinner";

const git = simpleGit(process.cwd());

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
	const [isLoading, setIsLoading] = useState(true);
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
			setIsLoading(false);
		})();
	}, []);

	if (isLoading) {
		return (
			<Box flexDirection="row">
				<Spinner type="dots" />
				<Text>loading stashes</Text>
			</Box>
		);
	}

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

	if (stashes.length === 0) {
		return <Text bold>No Stashes Found</Text>;
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
