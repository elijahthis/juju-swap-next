import { Switch } from "@mui/material";
import { ChangeEvent, Dispatch, SetStateAction } from "react";

interface MUIToggleProps {
	value: boolean;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const MUIToggle = ({ value, onChange }: MUIToggleProps) => {
	return <Switch checked={value} onChange={onChange} />;
};

export default MUIToggle;
