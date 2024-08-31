import { signOut } from "firebase/auth";
import { useTranslation } from "react-i18next";
import { auth } from "~/firebase";

const UserSingOut = () => {
  const { t } = useTranslation();
  function userSingOut() {
    signOut(auth)
      .then(() => console.log("sign out"))
      .catch((error) => console.error("Error signing out:", error));
  }
  return (
    <div>
      <button
        className="text-2xl mt-4 border-solid rounded-3xl bg-gray-500 p-4 bg-gradient-to-tl from-gray-300 via-gray-500 to-black text-center align-self-center hover:bg-gradient-to-tr hover:from-black hover:via-gray-500 hover:to-gray-300"
        type="button"
        onClick={userSingOut}
      >
        {t("signout")}
      </button>
    </div>
  );
};

export default UserSingOut;
