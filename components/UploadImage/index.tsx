import styles from "./styles.module.scss";
import { FiUploadCloud } from "react-icons/fi";
import { useState } from "react";

interface UploadImageProps {
	onFileSelect: (file: File) => void;
}

const UploadImage = ({ onFileSelect }: UploadImageProps) => {
	const [dragging, setDragging] = useState(false);
	const [file, setFile] = useState<any>(null);
	const [previewUrl, setPreviewUrl] = useState<string>("");

	const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setDragging(true);
	};

	const handleDragIn = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
			setDragging(true);
		}
	};

	const handleDragOut = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setDragging(false);
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();

		const file = e.dataTransfer.files?.[0];
		if (file && file.type.startsWith("image/")) {
			const reader = new FileReader();
			reader.onload = () => {
				setPreviewUrl(reader.result as string);
			};
			reader.readAsDataURL(file);

			onFileSelect(e.dataTransfer.files[0]);
			setFile(e.dataTransfer.files[0]);
			// e.dataTransfer.clearData();
		}
		setDragging(false);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setDragging(false);

		const file = e.target.files?.[0];
		if (file && file.type.startsWith("image/")) {
			const reader = new FileReader();
			reader.onload = () => {
				setPreviewUrl(reader.result as string);
			};
			reader.readAsDataURL(file);

			onFileSelect(file);
			setFile(file);
			// e.dataTransfer.clearData();
		}
	};

	console.log("file", file);

	return (
		<div
			className={styles.UploadImage}
			onDragEnter={handleDragIn}
			onDragLeave={handleDragOut}
			onDragOver={handleDrag}
			onDrop={handleDrop}
		>
			<p>Upload your image</p>
			<p className={styles.UploadImage__fileType}>
				PNG, JPG and GIF files are allowed
			</p>
			{file && <p className={styles.UploadImage__fileName}>{file?.name}</p>}
			<div
				className={`${styles.UploadImage__preview} ${
					dragging ? styles["UploadImage__preview--dragging"] : ""
				}`}
				onDragEnter={handleDragIn}
				onDragLeave={handleDragOut}
				onDragOver={handleDrag}
				onDrop={handleDrop}
			>
				<input
					type="file"
					name=""
					id=""
					accept="image/*"
					onChange={handleChange}
				/>
				<p>Drag and drop or browse to choose a file </p>
				<FiUploadCloud size={32} color="#000000" />
				{previewUrl && <img src={previewUrl} alt="" />}
			</div>
		</div>
	);
};

export default UploadImage;
