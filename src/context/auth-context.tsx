
'use client';

import React, { createContext, useState, useEffect } from 'react';

type Role = 'admin' | 'student' | null;

interface AuthContextType {
  role: Role;
  setRole: (role: Role) => void;
}

export const AuthContext = createContext<AuthContextType>({
  role: null,
  setRole: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState<Role>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedRole = localStorage.getItem('userRole') as Role;
      if (storedRole) {
        setRole(storedRole);
      }
    } catch (error) {
      console.error("Could not access localStorage", error);
    } finally {
        setIsLoading(false);
    }
  }, []);

  const handleSetRole = (newRole: Role) => {
    setRole(newRole);
    if (newRole) {
      try {
        localStorage.setItem('userRole', newRole);
      } catch (error) {
        console.error("Could not access localStorage", error);
      }
    } else {
      try {
        localStorage.removeItem('userRole');
      } catch (error) {
         console.error("Could not access localStorage", error);
      }
    }
  };

  if (isLoading) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <p>Initializing...</p>
        </div>
    )
  }

  return (
    <AuthContext.Provider value={{ role, setRole: handleSetRole }}>
      {children}
    </AuthContext.Provider>
  );
};
