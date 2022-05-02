import { useContext } from "react";
import { AuthContext } from "../../middleware/auth";
import AdminView from "./admin";
import UserView from "./userHome";
import NavBar from "../../components/navbar";

const Home = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <>
      <NavBar user={user} logout={logout}>
        {user.isAdmin ? <AdminView user={user} /> : <UserView user={user} />}
      </NavBar>
    </>
  );
};

export default Home;
