"use client";
import PocketBase from "pocketbase";
import { useState, useEffect } from "react";
import { PB_URL } from "@/lib/pb";

const usePocketbase = () => {
  const pb = new PocketBase(PB_URL);
  if (typeof window !== "undefined") {
    // BUG why do we need this conditional with use client?
    pb.authStore.loadFromCookie(document?.cookie || "");
  }

  const [user, setUser] = useState(pb.authStore.model);

  useEffect(() => {
    const removeListener = pb.authStore.onChange((_token, model) => {
      setUser(model);
      document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
    });
    return () => {
      removeListener();
    };
  }, []);

  const signIn = async () => {
    try {
      const authData = await pb
        .collection("users")
        .authWithOAuth2({ provider: "github" });
      setUser(pb.authStore.model);
      if (typeof window !== "undefined") {
        document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
      }
      return authData;
    } catch (error) {
      console.error("Failed to sign in:", error);
      throw error;
    }
  };

  const signOut = () => {
    pb.authStore.clear();
    setUser(null);
    if (typeof window !== "undefined") {
      document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
    }
  };

  return { user, signIn, signOut };
};

export default usePocketbase;
