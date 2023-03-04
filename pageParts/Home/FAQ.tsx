import styles from "./styles.module.scss";
import Accordion from "../../components/Accordion";
import { useQuery } from "@apollo/client";
import { GET_FAQS } from "../../graphql/queries";
import { useEffect, useState } from "react";

export const FAQ = () => {
	const { loading, error, data } = useQuery(GET_FAQS);

	const [accordionData, setAccordionData] = useState([]);

	const mockData = [
		{
			title: "What is the meaning of crytocurrencies?",
			body: "A cryptocurrency is an encrypted data string that denotes a unit of currency. It is monitored and organized by a peer-to-peer network called a blockchain, which also serves as a secure ledger of transactions, e.g., buying, selling, and transferring.",
		},
		{
			title: "What is the meaning of crytocurrencies?",
			body: "A cryptocurrency is an encrypted data string that denotes a unit of currency. It is monitored and organized by a peer-to-peer network called a blockchain, which also serves as a secure ledger of transactions, e.g., buying, selling, and transferring.",
		},
		{
			title: "What is the meaning of crytocurrencies?",
			body: "A cryptocurrency is an encrypted data string that denotes a unit of currency. It is monitored and organized by a peer-to-peer network called a blockchain, which also serves as a secure ledger of transactions, e.g., buying, selling, and transferring.",
		},
		{
			title: "What is the meaning of crytocurrencies?",
			body: "A cryptocurrency is an encrypted data string that denotes a unit of currency. It is monitored and organized by a peer-to-peer network called a blockchain, which also serves as a secure ledger of transactions, e.g., buying, selling, and transferring.",
		},
	];

	console.log(data);

	useEffect(() => {
		if (!loading && !error)
			setAccordionData(
				data?.getFAQ?.map((item: any) => ({
					title: item?.question,
					body: item?.answer,
				}))
			);
	}, [data]);

	return (
		<section className={`${styles.HomePageSection} ${styles.FAQ}`}>
			<div>
				<h1>FAQ</h1>
				<p>List of frequently asked questions</p>
				<div>
					<div></div>
					<Accordion accordionData={accordionData} />
				</div>
			</div>
		</section>
	);
};
