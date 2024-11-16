/**
 * Check if user is authenticated
 */

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
/**
 *
 * @param {*} param0
 * @returns children component
 */
export function CheckAuth({ isAuthenticated, children }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("auth/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
    // navigate("/auth/login");
  }
  return children;
}

CheckAuth.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};
