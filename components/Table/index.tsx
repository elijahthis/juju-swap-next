import styles from "./styles.module.scss";
import { ImArrowRight2, ImArrowLeft2 } from "react-icons/im";
import { useState } from "react";
import { CgArrowUpR, CgArrowDownR } from "react-icons/cg";
import SpinnerComponent from "../SpinnerComponent";

interface TableProps {
	headers: { label: string; key: string; type: string }[];
	data: {}[];
	loading?: boolean;
	completed?: boolean;
}

const Table = ({
	headers,
	data,
	loading = false,
	completed = false,
}: TableProps) => {
	let limit = 10;
	const [currentPage, setCurrentPage] = useState(1);

	return (
		<div className={styles.Table}>
			{loading ? (
				<>
					<div className={styles.loadWrap}>
						<SpinnerComponent size={50} />
					</div>
				</>
			) : (
				<>
					<table>
						<colgroup>
							{headers.map((item, ind) => (
								<col key={ind}></col>
							))}
						</colgroup>

						<thead>
							<tr>
								{headers.map((item, ind) => (
									<th key={ind}>{item.label}</th>
								))}
							</tr>
						</thead>
						<tbody>
							{data
								.slice((currentPage - 1) * limit, currentPage * limit)
								.map((record: any, ind: number) => (
									<tr key={`tr-${ind}`}>
										{headers.map((item, i: number) => (
											<td key={`td-${i}`}>
												{item.type === "imgText" ? (
													<div className={styles[`dataItem--${item.type}`]}>
														{record[item.key]?.map(
															(subItem: any, ind: number) => {
																if (ind < record[item.key].length - 1)
																	return <img src={subItem} alt="" key={ind} />;
																else {
																	return subItem;
																}
															}
														)}
													</div>
												) : item.type === "chart" ? (
													<div
														className={`${styles[`dataItem--${item.type}`]} ${
															styles[
																`dataItem--chart--${
																	record[item.key][0] >= 0 ? "green" : "red"
																}`
															]
														}`}
													>
														{record[item.key][0] >= 0 ? (
															<CgArrowUpR />
														) : (
															<CgArrowDownR />
														)}
														{record[item.key][0]}%
														{record[item.key].length > 1 && (
															<img src={record[item.key][1]} alt="" />
														)}
													</div>
												) : item.type === "wallet" ? (
													<span style={{ color: "#26D0CE" }}>
														{record[item.key]}
													</span>
												) : (
													record[item.key]
												)}
											</td>
										))}
									</tr>
								))}
						</tbody>
					</table>
					<div className={styles.Table__pagination}>
						<ImArrowLeft2
							size={24}
							onClick={() => {
								if (currentPage > 1) setCurrentPage(currentPage - 1);
							}}
						/>
						<span>
							Page {currentPage} of {Math.ceil(data.length / limit)}
						</span>
						<ImArrowRight2
							size={24}
							onClick={() => {
								if (currentPage < Math.ceil(data.length / limit))
									setCurrentPage(currentPage + 1);
							}}
						/>
					</div>
				</>
			)}
		</div>
	);
};

export default Table;
