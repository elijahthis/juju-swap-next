import styles from "./styles.module.scss";
import { IoMdArrowDroprightCircle } from "react-icons/io";
import { useState } from "react";

const Accordion = ({
	accordionData,
}: {
	accordionData: { title: string; body: string }[];
}) => {
	const [openedInd, setOpenedInd] = useState<null | number>(null);

	return (
		<div className={styles.Accordion}>
			{accordionData.map((item, ind) => (
				<div
					className={`${styles.Accordion__item}  ${
						openedInd === ind && styles["Accordion__item--open"]
					}`}
					key={ind}
				>
					<div
						className={styles.Accordion__item__title}
						onClick={() => setOpenedInd(openedInd === ind ? null : ind)}
					>
						{item.title}{" "}
						<IoMdArrowDroprightCircle
							color="#0c0b0e"
							className={styles["accord-icon"]}
						/>
					</div>
					<div
						className={`${styles.Accordion__item__body} ${
							openedInd === ind && styles["Accordion__item__body--open"]
						}`}
					>
						{item.body}
					</div>
				</div>
			))}
		</div>
	);
};

export default Accordion;
