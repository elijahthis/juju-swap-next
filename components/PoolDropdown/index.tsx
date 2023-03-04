import { BiChevronDown } from "react-icons/bi";
import styles from "./styles.module.scss";
import wngn from "../../assets/images/wngn.svg";
import { useState, useRef } from "react";
import { IoCopy, IoCheckmarkCircleSharp } from "react-icons/io5";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { HiOutlineExternalLink } from "react-icons/hi";
import useOutsideAlerter from "../../hooks/useOutsideAlerter";
import MUIModal from "../MUIModal";
import {
	PoolDropdownModal,
	AddLiquidityModal,
	RemoveLiquidityModal,
} from "./modals";

const PoolDropdown = ({ poolData }: { poolData: any }) => {
	const [openDrop, setOpenDrop] = useState(false);
	const [copiedText, setCopiedText] = useState("");
	const [copied, setCopied] = useState(false);
	const [modal1Open, setModal1Open] = useState(false);
	const [addModalOpen, setAddModalOpen] = useState(false);
	const [removeModalOpen, setRemoveModalOpen] = useState(false);

	const dropRef = useRef(null);

	useOutsideAlerter(dropRef, () => setOpenDrop(false));

	return (
		<>
			<div className={styles.PoolDropdown} ref={dropRef}>
				<div className={styles["main-assets-line"]}>
					<div>
						<div className={styles.icons}>
							<img src={poolData?.tokens[0]?.logo} alt="" />
							<img src={poolData?.tokens[1]?.logo} alt="" />
						</div>
						<p className={styles.assets}>
							{poolData?.tokens[0]?.symbol}/{poolData?.tokens[1]?.symbol}
						</p>
					</div>
					<div>
						<span></span>
						<p className={styles.price}>
							{
								poolData?.tokens?.filter(
									(item: any) => item?.symbol !== "WNGN"
								)[0]?.liquidity
							}
						</p>
					</div>
				</div>
				<div
					className={styles.chevron}
					onClick={(e) => {
						e.stopPropagation();
						setOpenDrop((prev) => !prev);
						setModal1Open(true);
					}}
				>
					<BiChevronDown color="white" />
				</div>
			</div>
			<MUIModal open={modal1Open} handleClose={() => setModal1Open(false)}>
				<PoolDropdownModal
					setAddModalOpen={setAddModalOpen}
					setRemoveModalOpen={setRemoveModalOpen}
					poolData={poolData}
				/>
			</MUIModal>
			<MUIModal open={addModalOpen} handleClose={() => setAddModalOpen(false)}>
				<AddLiquidityModal
					setAddModalOpen={setAddModalOpen}
					setModal1Open={setModal1Open}
					// setRemoveModalOpen={setRemoveModalOpen}
				/>
			</MUIModal>
			<MUIModal
				open={removeModalOpen}
				handleClose={() => setRemoveModalOpen(false)}
			>
				<RemoveLiquidityModal
					poolData={poolData}
					// setAddModalOpen={setAddModalOpen}
					// setRemoveModalOpen={setRemoveModalOpen}
				/>
			</MUIModal>
		</>
	);
};

export default PoolDropdown;
