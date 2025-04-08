"use client";
import { createContext, useContext, useState, useEffect } from "react";

interface User {
  userID: number;
  userName: string;
  email: string;
  fullname: string;
  phone: string;
  address: string;
  createdDate: string;
  avatar: string;
  gender: number;
  dateOfBirth: string;
}

interface AuthContextProps {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  refreshUser: (customToken?: string) => Promise<void>; // Đã sửa
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    const storedUser = sessionStorage.getItem("user");
    if (storedToken) {
      setToken(storedToken);
      if (storedUser) setUser(JSON.parse(storedUser));
      refreshUser(); // Gọi mà không truyền tham số
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    sessionStorage.setItem("token", newToken);
    sessionStorage.setItem("user", JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
  };

  const refreshUser = async (customToken?: string) => {
    const tokenToUse = customToken || token; // Sử dụng customToken nếu có, nếu không dùng token từ state
    if (!tokenToUse) {
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/User/GetUserInfo", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenToUse}`,
        },
      }).then((res) => res.json()).then((res) => {
        console.log(res.data)
        if (res.status === 1) {
          console.log(res.data)
          setUser(res.data)
          sessionStorage.setItem("user", JSON.stringify(res.data));
        }
        else
        {
          console.log("lỗi cập nhật thông tin")
        }
      });
    } catch (error) {
      console.error("Error refreshing user:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}