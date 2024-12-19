"use client";
import { useEffect, useState } from "react";

export default function FormMessage({ message }: { message?: string }) {
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setSuccess(message?.toLowerCase().includes("added") || false);
  }, [message]);

  if (!message) return null;

  return success
    ? (
      <ins
        aria-describedby="content"
        aria-live="polite"
        className="sr-only"
        role="status"
      >
        {message}
      </ins>
    )
    : (
      <small
        aria-describedby="content"
        aria-live="polite"
        className="sr-only"
        role="status"
      >
        {message}
      </small>
    );
}
