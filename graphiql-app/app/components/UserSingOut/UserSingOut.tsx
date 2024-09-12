import { Link } from "@remix-run/react";
import { signOut } from "firebase/auth";
import { auth } from "~/firebase";
import PropTypes from "prop-types";

interface UserSingOutProps {
  src: string;
  alt: string;
  title: string;
}

const UserSingOut: React.FC<UserSingOutProps> = ({ src, alt, title }) => {
  function userSingOut() {
    signOut(auth)
      .then(() => console.log("sign out"))
      .catch((error) => console.error("Error signing out:", error));
  }
  return (
    <>
      <Link to="/" onClick={userSingOut}>
        <img
          src={src}
          alt={alt}
          className="w-[20px] h-[20px] fill-current hover:opacity-70"
          title={title}
        />
      </Link>
    </>
  );
};

UserSingOut.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default UserSingOut;
