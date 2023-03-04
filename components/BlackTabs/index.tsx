import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/router";
import { RiSearch2Fill } from "react-icons/ri";
import styles from "./styles.module.scss";

interface BlackTabsProps {
	tabItems: string[];
	currentTab: number;
	setCurrentTab: Dispatch<SetStateAction<number>>;
}

const BlackTabs = ({ tabItems, currentTab, setCurrentTab }: BlackTabsProps) => {
	// const router = useRouter();

	return (
		<div className={styles.BlackTabs}>
			<div>
				<div className={styles.BlackTabs__tabs}>
					{tabItems.map((tabItem, ind) => (
						<div
							className={`${styles.tabItem} ${
								currentTab === ind ? styles["tabItem--current"] : ""
							}`}
							onClick={() => setCurrentTab(ind)}
							key={ind}
						>
							{tabItem}
						</div>
					))}
				</div>
				<div className={styles.BlackTabs__search}>
					<RiSearch2Fill color="#8E8E93" size={24} />
					<input
						type="search"
						name=""
						id=""
						placeholder="Search pools or tokens"
					/>
				</div>
				<RiSearch2Fill
					color="#8E8E93"
					size={24}
					className={styles["mob-search"]}
				/>
			</div>
		</div>
	);
};

export default BlackTabs;
