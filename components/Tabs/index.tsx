import { useState } from "react";
import styles from "./styles.module.scss";

const Tabs = ({ tabItems }: { tabItems: string[] }) => {
	const [currentTab, setCurrentTab] = useState(0);

	return (
		<div className={styles.Tabs}>
			{tabItems.map((tabItem, ind) => (
				<div
					className={`${styles.tabItem} ${
						currentTab === ind ? styles["tabItem--current"] : ""
					}`}
					onClick={() => setCurrentTab(ind)}
					key={ind}
				>
					<div className={styles.tabItemText}>{tabItem}</div>
					<div className={styles.tabItemLine}></div>
				</div>
			))}
		</div>
	);
};

export default Tabs;
