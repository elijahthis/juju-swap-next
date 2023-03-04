import styles from "./styles.module.scss";
import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { useRouter } from "next/router";

interface SideSliderProps {
	sideList: string[];
	currentTab: number;
	setCurrentTab: Dispatch<SetStateAction<number>>;
}

const SideSlider = ({
	sideList,
	currentTab,
	setCurrentTab,
}: SideSliderProps) => {
	const router = useRouter();

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setCurrentTab(newValue);
	};

	function a11yProps(index: number) {
		return {
			id: `vertical-tab-${index}`,
			"aria-controls": `vertical-tabpanel-${index}`,
		};
	}

	return (
		<aside className={styles.SideSlider}>
			<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
				<Tabs
					orientation="vertical"
					value={currentTab}
					onChange={handleChange}
					variant="scrollable"
					aria-label="basic tabs example"
					sx={{
						borderRight: 1,
						borderColor: "divider",
						".MuiTabs-flexContainer": {
							gap: "5px",
						},
						".MuiButtonBase-root": {
							fontWeight: "400",
							fontSize: "24px",
							lineHeight: "30px",
							textTransform: "capitalize",
							alignItems: "flex-start",
							paddingLeft: "0",
						},
						".MuiButtonBase-root.Mui-selected": {
							color: "#26D0CE",
						},
						".MuiTabs-indicator": {
							backgroundColor: "#26D0CE",
							width: "6px",
							height: "24px !important",
							transform: "translateY(60%)",
						},
					}}
				>
					{sideList.map((item, ind) => (
						<Tab
							label={item}
							sx={{ color: "white" }}
							{...a11yProps(ind)}
							key={ind}
						/>
					))}
				</Tabs>
			</Box>
			<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
				<Tabs
					value={currentTab}
					onChange={handleChange}
					variant="scrollable"
					aria-label="basic tabs example"
					sx={{
						borderRight: 1,
						borderColor: "divider",
						minHeight: "unset",
						".MuiTabs-flexContainer": {
							gap: "1rem",
							alignItems: "center",
							justifyContent: "center",
						},
						".MuiButtonBase-root": {
							fontWeight: "400",
							fontSize: "14px",
							lineHeight: "18px",
							textTransform: "capitalize",
							alignItems: "center",
							padding: "1px",
							paddingBottom: "3px",
							minHeight: "unset",
							minWidth: "unset",
						},
						".MuiButtonBase-root.Mui-selected": {
							color: "#26D0CE",
						},
						".MuiTabs-indicator": {
							backgroundColor: "#26D0CE",
							width: "6px",
						},
					}}
				>
					{sideList.map((item, ind) => (
						<Tab
							label={item}
							sx={{ color: "white" }}
							{...a11yProps(ind)}
							key={ind}
						/>
					))}
				</Tabs>
			</Box>
		</aside>
	);
};

export default SideSlider;
