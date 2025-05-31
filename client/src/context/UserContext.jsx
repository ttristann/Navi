import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Create the context
const UserContext = createContext(null);

// 2. Create a provider component
export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Load from sessionStorage on initial load
    const storedUser = sessionStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Save to sessionStorage whenever user changes
  useEffect(() => {
    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('user');
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

// 3. Create a custom hook for easy access
export function useUser() {
  return useContext(UserContext);
}
