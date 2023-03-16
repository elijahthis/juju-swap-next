import PageLayout from "@/layouts/PageLayout";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import Button from "../components/Button";
import styles from "./styles.module.scss";

const ComingSoon = () => {
	const router = useRouter();

	return (
		<main className={styles.ComingSoon}>
			<h1>Coming Soon</h1>
			<p>We're brewing something special, just for you.</p>
			<div className={styles.ComingSoon__buttons}>
				<Button variant="primary" onClick={() => router.push("/")}>
					Back home
				</Button>
				<Button variant="primary" onClick={() => router.push("/exchange")}>
					Swap
				</Button>
			</div>
		</main>
	);
};

export default ComingSoon;

ComingSoon.getLayout = function getLayout(page: ReactNode) {
	return <PageLayout>{page}</PageLayout>;
};
