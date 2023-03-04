import { useState } from "react";
import BlackTabs from "../../components/BlackTabs";
import Overview from "./Overview";
import Pool from "./Pool";
import Token from "./Token";
import { Footer } from "../../components/Footer";
import { useRouter } from "next/router";

const Stats = () => {
	const tabList = ["Overview", "Pool", "Token"];
	const router = useRouter();

	const [currentTab, setCurrentTab] = useState(0);

	const renderContent = () => {
		switch (currentTab) {
			case 0:
				return <Overview />;
				break;
			case 1:
				return <Pool />;
				break;
			case 2:
				return <Token />;
				break;

			default:
				return <Overview />;
				break;
		}
	};

	return (
		<main>
			<BlackTabs
				tabItems={tabList}
				currentTab={currentTab}
				setCurrentTab={setCurrentTab}
			/>
			{renderContent()}
			<Footer />
		</main>
	);
};

export default Stats;
