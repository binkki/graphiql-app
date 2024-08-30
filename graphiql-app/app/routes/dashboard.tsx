import { signOut } from "firebase/auth";
import { auth } from "~/firebase";

export default function Dashboard() {
  function userSingOut() {
    signOut(auth)
      .then(() => console.log("sign out"))
      .catch((error) => console.error("Error signing out:", error));
  }
  return (
    <>
      <div>Page for authorized users</div>
      <button type="button" onClick={userSingOut}>
        Sihg Out
      </button>
    </>
  );
}
