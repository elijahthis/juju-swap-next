import PageLayout from "@/layouts/PageLayout";
import { ReactNode } from "react";
import ComingSoon from "./ComingSoon";

const Docs = () => {
	return (
		// <main>
		<ComingSoon />
		// {/* </main> */}
	);
};

export default Docs;

Docs.getLayout = function getLayout(page: ReactNode) {
	return <PageLayout>{page}</PageLayout>;
};
