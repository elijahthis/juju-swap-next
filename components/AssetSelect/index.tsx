import Select from "react-select";

const AssetSelect = ({
	options,
	value,
	defaultValue,
	onChange,
}: {
	options: any;
	value?: any;
	defaultValue?: any;
	onChange: any;
}) => {
	const colourStyles = {
		control: (styles: any) => ({
			...styles,
			backgroundColor: "transparent",
			color: "#ffffff",
			border: 0,
			cursor: "pointer",
			minHeight: 0,
			boxShadow: "unset !important",
			"&:hover": {
				borderColor: "red",
			},
			".css-qbdosj-Input": {
				margin: 0,
				paddingBottom: 0,
				paddingTop: 0,
			},
		}),
		option: (styles: any, { data, isDisabled, isFocused, isSelected }: any) => {
			return {
				...styles,
				backgroundColor: isDisabled
					? undefined
					: isSelected
					? "black"
					: isFocused
					? "rgb(44, 47, 54)"
					: undefined,
				color: isDisabled
					? "#ffffff"
					: isSelected
					? "#ffffff"
					: "rgba(255,255,255,0.6)",
				fontWeight: isSelected ? 600 : 400,
				// cursor: isDisabled ? "not-allowed" : "default",

				":active": {
					...styles[":active"],
					backgroundColor: !isDisabled
						? isSelected
							? "red"
							: "green"
						: undefined,
				},
			};
		},
		// input: (styles) => ({ ...styles, ...dot() }),
		// placeholder: (styles) => ({ ...styles, ...dot("#ccc") }),
		singleValue: (styles: any, { data }: any) => ({
			...styles,
			color: "#8E8E93",
			fontWeight: 400,
		}),
		menuList: (styles: any, { data }: any) => ({
			...styles,
			backgroundColor: "#191b1f",
			minWidth: "150px",
		}),
		valueContainer: (styles: any, { data }: any) => ({
			...styles,
			padding: 0,
			paddingRight: "0.75rem",
		}),
		indicatorsContainer: (styles: any, { data }: any) => ({
			...styles,
			">div": {
				padding: 0,
			},
			">span": {
				backgroundColor: "transparent",
			},
		}),
	};

	console.log("options", options);
	console.log("value", value);

	return (
		<Select
			options={options}
			styles={colourStyles}
			value={value}
			// defaultValue={defaultValue}
			onChange={onChange}
		/>
	);
};

export default AssetSelect;
