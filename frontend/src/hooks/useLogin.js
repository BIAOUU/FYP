import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch('/api/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
      return false;  // Indicate login failed
    }

    // Add role to the newUser object
    const newUser = { ...json, name: json.name, role: json.role };  // Include the role

    // Save the user, including the role, to local storage
    localStorage.setItem('user', JSON.stringify(newUser));

    // Update the auth context with the user's role
    dispatch({ type: 'LOGIN', payload: newUser });

    setIsLoading(false);
    return true;  // Indicate login was successful
  };

  return { login, isLoading, error };
};
