"use client";
import PocketBase from "pocketbase";
import { useState, useEffect } from "react";
import { getUser, PB_URL, signIn, signOut } from "@/lib/pb";

const useAuth = () => {
  const [user, setUser] = useState(getUser());

  useEffect(() => {
    // Handler for auth changes
    const handleAuthChange = () => {
      setUser(getUser());
    };

    const pb = new PocketBase(PB_URL);
    // Subscribe to authentication state changes
    pb.authStore.onChange(handleAuthChange);
  }, []);

  return { user, signIn, signOut };
};

export default useAuth;
