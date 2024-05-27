"use client";

import { useState, createContext, useEffect } from "react";
import { ChildrenProps } from "./layout";
import { UserI } from "@/interfaces_and_types/UserI";

type AuthContextType = {
  user: UserI | null;
  setUser: React.Dispatch<React.SetStateAction<UserI | null>>;
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
};

const AuthContextDefault: AuthContextType = {
  user: null,
  setUser: () => {},
  token: null,
  setToken: () => {},
};

export const AuthContext = createContext<AuthContextType>(AuthContextDefault);

export default function AuthProvider({ children }: ChildrenProps) {
  const [user, setUser] = useState<UserI | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (localStorage.getItem("token") && localStorage.getItem("user")) {
      const user = localStorage.getItem("user") as string;
      setUser(JSON.parse(user));
      setToken(localStorage.getItem("token"));
    }
    console.log("AuthProvider");
  }, []);

  return (
    <>
      <AuthContext.Provider value={{ user, setUser, token, setToken }}>
        {children}
      </AuthContext.Provider>
    </>
  );
}
