import { useNavigate } from "@remix-run/react";
import { onAuthStateChanged } from "firebase/auth";
import { ReactNode, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { auth } from "../../firebase";
import { useTranslation } from "react-i18next";

interface AuthCheckProps {
  children: ReactNode;
}

const AuthCheck: React.FC<AuthCheckProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(true);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return <div>{t("loading")}</div>;
  }

  return <>{isAuthenticated ? children : null}</>;
};

AuthCheck.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthCheck;
