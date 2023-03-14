import { BiChevronDown } from "react-icons/bi";
import styles from "./styles.module.scss";
import wngn from "../../assets/images/wngn.svg";
import { useState, useRef, useEffect } from "react";
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
import { useQuery } from "@apollo/client";
import { useAccount, useNetwork } from "wagmi";
import { GET_POOL_USER_DATA } from "@/graphql/queries";

const PoolDropdown = ({ poolData }: { poolData: any }) => {
	const [openDrop, setOpenDrop] = useState(false);
	const [copiedText, setCopiedText] = useState("");
	const [copied, setCopied] = useState(false);
	const [modal1Open, setModal1Open] = useState(false);
	const [addModalOpen, setAddModalOpen] = useState(false);

	const [poolUserObj, setPoolUserObj] = useState<any>({});

	const { address } = useAccount();
	const { chain } = useNetwork();

	const {
		loading: PoolUserLoading,
		data: PoolUserData,
		error: PoolUserError,
	} = useQuery(GET_POOL_USER_DATA, {
		variables: { chainId: chain?.id, pool: poolData?.address, user: address },
	});

	useEffect(() => {
		const fetchFunc = async () => {
			try {
				if (!PoolUserError && !PoolUserLoading) {
					console.log("PoolUserData", PoolUserData?.getPoolUserData);
					setPoolUserObj(PoolUserData?.getPoolUserData);
				} else console.log(PoolUserError);
			} catch (error) {
				console.log(error);
			}
		};

		fetchFunc();
	}, [PoolUserLoading]);

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
						<p className={styles.price}>{poolUserObj?.poolShare}</p>
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
					poolData={poolData}
					setModal1Open={setModal1Open}
				/>
			</MUIModal>
			<MUIModal open={addModalOpen} handleClose={() => setAddModalOpen(false)}>
				<AddLiquidityModal
					setAddModalOpen={setAddModalOpen}
					setModal1Open={setModal1Open}
					// setRemoveModalOpen={setRemoveModalOpen}
				/>
			</MUIModal>
		</>
	);
};

export default PoolDropdown;
