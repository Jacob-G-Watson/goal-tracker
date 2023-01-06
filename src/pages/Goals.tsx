//library and framework imports
import React from "react";

// type imports
import type { ReactElement } from "react";

/**
 *
 * @param {User} user required to grab the correct goal list
 * @returns
 */
export default function Goals({ userId }: { userId: string }): ReactElement {
	function GoalCard(goal: IGoal) {
		const percentageComplete =
			(goal.daysOfGoal.filter((day) => day === true).length / goal.daysOfGoal.length) * 100;
		return (
			<div className="goalCard">
				<h1>{goal.title}</h1>

				<div>
					<div className="pie animate" style={{ "--percentage": percentageComplete } as React.CSSProperties}>
						{" "}
						{`${percentageComplete}%`}
					</div>
				</div>
			</div>
		);
	}
	function sortGoals(sample: IGoal, otherSample: IGoal): number {
		if (sample.id < otherSample.id) {
			return -1;
		}
		if (sample.id > otherSample.id) {
			return 1;
		}
		return 0;
	}

	interface IGoal {
		//todo could add a goal order property
		id: number;
		title: string;
		startDate: Date;
		endDate: Date;
		daysOfGoal: boolean[]; //length of daysOfGoal is equal to the difference between the start and end date
	}
	const listOfGoals: IGoal[] = [
		{
			id: 1,
			title: "The first goal",
			startDate: new Date("2023-01-04"),
			endDate: new Date("2023-01-09"),
			daysOfGoal: [true, false, true, false, false],
		},
		{
			id: 2,
			title: "Goal Number 2",
			startDate: new Date("2023-01-04"),
			endDate: new Date("2023-01-09"),
			daysOfGoal: [true, true, true, true, false],
		},
		{
			id: 3,
			title: "Goal Number 3",
			startDate: new Date("2023-01-04"),
			endDate: new Date("2023-01-09"),
			daysOfGoal: [true, true, true, true, true],
		},
		{
			id: 4,
			title: "This is a really long goal name",
			startDate: new Date("2023-01-04"),
			endDate: new Date("2023-01-09"),
			daysOfGoal: [false, false, false, false, false, true, false, false, false, false],
		},
	];

	return (
		<div className="goals">
			<div className="listOfGoals">
				{listOfGoals.sort(sortGoals).map((goal: IGoal) => (
					<GoalCard key={goal.id} {...goal} />
				))}
			</div>
			<div className="addNewGoal">Add a new goal</div>
		</div>
	);
}
