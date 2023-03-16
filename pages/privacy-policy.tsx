import PageLayout from "@/layouts/PageLayout";
import { ReactNode } from "react";
import ComingSoon from "./ComingSoon";

const PrivacyPolicy = () => {
	return (
		// <main>
		<ComingSoon />
		// {/* </main> */}
	);
};

export default PrivacyPolicy;

PrivacyPolicy.getLayout = function getLayout(page: ReactNode) {
	return <PageLayout>{page}</PageLayout>;
};
