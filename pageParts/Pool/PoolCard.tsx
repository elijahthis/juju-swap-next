import styles from "./styles.module.scss";
import { useState, useEffect } from "react";
import BlackCard from "../../components/BlackCard";
import Button from "../../components/Button";
import { RiSearch2Fill } from "react-icons/ri";
import PoolDropdown from "../../components/PoolDropdown";
import { useQuery } from "@apollo/client";
import { GET_POOLS } from "../../graphql/queries";
import { useNetwork, useAccount } from "wagmi";
import SpinnerComponent from "../../components/SpinnerComponent";
import EmptyState from "../../components/EmptyState";
import MUIModal from "../../components/MUIModal";
import { AddLiquidityModal } from "../../components/PoolDropdown/modals";

export const PoolCard = () => {
	const [pools, setPools] = useState([]);
	const [addModalOpen, setAddModalOpen] = useState(false);

	const { address } = useAccount();
	const { chain } = useNetwork();

	const {
		loading: PoolsLoading,
		data: PoolsData,
		error: PoolsError,
	} = useQuery(GET_POOLS, { variables: { chainId: chain?.id } });

	useEffect(() => {
		const fetchFunc = async () => {
			try {
				if (!PoolsError && !PoolsLoading) {
					console.log("PoolsData", PoolsData?.getPools);
					setPools(PoolsData?.getPools);
				} else console.log(PoolsError);
			} catch (error) {
				console.log(error);
			}
		};

		fetchFunc();
	}, [PoolsLoading]);

	return (
		<section className={styles.PoolCard}>
			<div>
				<BlackCard>
					<div className={styles.PoolCard__inner}>
						<div className={styles.smallCard}>
							<div className={styles.smallCard__head}>
								<p>Pools</p>
								<div className={styles.btnWrap}>
									<RiSearch2Fill color="#8E8E93" size={20} />
									<Button
										variant="primary"
										onClick={() => setAddModalOpen(true)}
										disabled={pools.length === 0}
									>
										Add liquidity
									</Button>
								</div>
							</div>
							<div className={styles.smallCard__body}>
								{PoolsLoading ? (
									<div className={styles.loadWrap}>
										<SpinnerComponent size={50} />
									</div>
								) : pools.length === 0 ? (
									<div className={styles.loadWrap}>
										<EmptyState
											title={
												address ? "Bummer. No Pools" : "Connect Your wallet"
											}
											body={
												address
													? "No registered pools at the moment."
													: "Please connect your wallet to use pools."
											}
										/>
									</div>
								) : (
									pools.map((item, ind) => (
										<PoolDropdown key={ind} poolData={item} />
									))
								)}
							</div>
						</div>
					</div>
				</BlackCard>
			</div>
			<MUIModal open={addModalOpen} handleClose={() => setAddModalOpen(false)}>
				<AddLiquidityModal
					setAddModalOpen={setAddModalOpen}
					// setRemoveModalOpen={setRemoveModalOpen}
				/>
			</MUIModal>
		</section>
	);
};
