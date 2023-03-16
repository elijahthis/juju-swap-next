import PageLayout from "@/layouts/PageLayout";
import { ReactNode } from "react";
import ComingSoon from "./ComingSoon";

const FAQ = () => {
	return (
		// <main>
		<ComingSoon />
		// {/* </main> */}
	);
};

export default FAQ;

FAQ.getLayout = function getLayout(page: ReactNode) {
	return <PageLayout>{page}</PageLayout>;
};
