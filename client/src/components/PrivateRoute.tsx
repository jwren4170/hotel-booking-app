import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "../lib/authClient";

const PrivateRoute = () => {
	const { data: session, isPending } = useSession();
	if (isPending) return null;
	return session?.user ? <Outlet /> : <Navigate to="/signin" />;
};

export default PrivateRoute;
