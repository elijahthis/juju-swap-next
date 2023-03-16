import Header from "@/components/Header";
import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface PageLayoutProps {
	children: ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
	return <>{children}</>;
};

export default PageLayout;
