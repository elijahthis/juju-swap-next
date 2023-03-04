import { Slider } from "@mui/material";

const MUISlider = ({
	value,
	onChange,
}: {
	value: number;
	onChange: (e: any) => void;
}) => {
	return (
		<Slider
			defaultValue={50}
			value={value}
			aria-label="Default"
			valueLabelDisplay="auto"
			sx={{ color: "#26D0CE" }}
			size="small"
			onChange={onChange}
		/>
	);
};

export default MUISlider;
