import { Link } from "react-router-dom";
import "./navbar.scss";
import { useContext } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";

const Navbar = () => {
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <h1>maydaysocial</h1>
        </Link>
        <div className="icon">
          <i class="fa-solid fa-house"></i>
        </div>
        <div className="icon" onClick={toggle}>
          {darkMode ? (
            <i class="fa-solid fa-sun"></i>
          ) : (
            <i class="fa-solid fa-moon"></i>
          )}
        </div>
        <div className="icon">
          <i class="fa-brands fa-apple"></i>
        </div>
        <div className="inputBox">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input placeholder="Search..." />
        </div>
      </div>
      <div className="right">
        <div className="icon">
          <i class="fa-solid fa-headphones"></i>
        </div>
        <div className="icon">
          <i class="fa-solid fa-envelope"></i>
        </div>
        <div className="icon">
          <i class="fa-solid fa-bell"></i>
        </div>
        {currentUser && (
          <div className="user">
            <img src={"/public/uploads/" + currentUser.profilePic} />
            <span>{currentUser.name}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
