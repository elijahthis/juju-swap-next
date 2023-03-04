import { cloneElement, useState } from "react";
import {
	GuideIcon1,
	GuideIcon2,
	GuideIcon3,
	GuideIcon4,
} from "../../components/svgs";
import styles from "./styles.module.scss";

export const HowItWork = () => {
	const stepsList = [
		{
			title: "Choose blockchain",
			body: "Select a preferred blockchain from a list of blockchains.",
			icon: <GuideIcon1 />,
		},
		{
			title: "Select an Asset",
			body: "Select a preferred blockchain from a list of blockchains.",
			icon: <GuideIcon2 />,
		},
		{
			title: "Enter bank details",
			body: "Select a preferred blockchain from a list of blockchains.",
			icon: <GuideIcon3 />,
		},
		{
			title: "Transfer asset",
			body: "Select a preferred blockchain from a list of blockchains.",
			icon: <GuideIcon4 />,
		},
	];

	return (
		<section className={`${styles.HomePageSection} ${styles.HowItWork}`}>
			<div>
				<h1>How it works</h1>
				<p>A quick guide to how juju swap works</p>
				<div className={styles.stepsList}>
					{stepsList.map((item, ind) => (
						<div className={styles.stepsList__card} key={ind}>
							{item.icon}
							<p className={styles.stepsList__card__title}>{item.title}</p>
							<div className={styles.stepsList__card__line}></div>
							<p className={styles.stepsList__card__body}>{item.body}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};
