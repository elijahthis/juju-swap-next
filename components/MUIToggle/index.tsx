import { Switch } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

interface MUIToggleProps {
	value: boolean;
	setValue: Dispatch<SetStateAction<boolean>>;
}

const MUIToggle = ({ value, setValue }: MUIToggleProps) => {
	return (
		<Switch checked={value} onChange={(e) => setValue(e.target.checked)} />
	);
};

export default MUIToggle;
