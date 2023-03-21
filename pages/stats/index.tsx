import { ReactNode, useState } from "react";
import BlackTabs from "../../components/BlackTabs";
import Overview from "./Overview";
import Pool from "./Pool";
import Token from "./Token";
import { Footer } from "../../components/Footer";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import PageLayout from "@/layouts/PageLayout";

const Stats = () => {
	const tabList = ["Overview", "Pool", "Token"];
	const router = useRouter();

	const hash = router.asPath.includes("#") ? router.asPath.split("#")[1] : null;

	const [currentTab, setCurrentTab] = useState(0);

	const renderContent = () => {
		switch (hash) {
			case encodeURIComponent(tabList[0]):
				return <Overview />;
				break;
			case encodeURIComponent(tabList[1]):
				return <Pool />;
				break;
			case encodeURIComponent(tabList[2]):
				return <Token />;
				break;

			default:
				return <Overview />;
				break;
		}
	};

	return (
		<main>
			<BlackTabs tabItems={tabList} />
			{renderContent()}
			<Footer />
		</main>
	);
};

export default dynamic(() => Promise.resolve(Stats), { ssr: false });

Stats.getLayout = function getLayout(page: ReactNode) {
	return <PageLayout>{page}</PageLayout>;
};
