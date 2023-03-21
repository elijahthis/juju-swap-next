import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { RiSearch2Fill } from "react-icons/ri";
import styles from "./styles.module.scss";

interface BlackTabsProps {
	tabItems: string[];
}

const BlackTabs = ({ tabItems }: BlackTabsProps) => {
	const router = useRouter();
	const [isNavigating, setIsNavigating] = useState(false);

	useEffect(() => {
		const handleRouteChangeStart = () => {
			setIsNavigating(true);
		};

		const handleRouteChangeComplete = () => {
			setIsNavigating(false);
		};

		router.events.on("routeChangeStart", handleRouteChangeStart);
		router.events.on("routeChangeComplete", handleRouteChangeComplete);

		return () => {
			router.events.off("routeChangeStart", handleRouteChangeStart);
			router.events.off("routeChangeComplete", handleRouteChangeComplete);
		};
	}, [router]);

	let hash = router.asPath.includes("#") ? router.asPath.split("#")[1] : null;

	useEffect(() => {
		if (hash === null && !isNavigating) {
			hash = tabItems[0];
			router.push({ hash: encodeURIComponent(hash) });
		}
	}, [isNavigating, hash]);

	return (
		<div className={styles.BlackTabs}>
			<div>
				<div className={styles.BlackTabs__tabs}>
					{tabItems.map((tabItem, ind) => (
						<div
							className={`${styles.tabItem} ${
								hash === encodeURIComponent(tabItem)
									? styles["tabItem--current"]
									: ""
							}`}
							onClick={() => router.push({ hash: encodeURIComponent(tabItem) })}
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

export default dynamic(() => Promise.resolve(BlackTabs), { ssr: false });
