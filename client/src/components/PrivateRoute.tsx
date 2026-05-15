import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { User } from "../redux/user/userSlice";

const PrivateRoute = () => {
	const { currentUser } = useSelector(
		(state: { user: { currentUser: User | null } }) => state.user,
	);
	return currentUser ? <Outlet /> : <Navigate to="/signin" />;
};

export default PrivateRoute;
