"use client";
import { ToastProvider } from "@heroui/react";
import type { ReactNode } from "react";
import { AuthProvider } from "../components/AuthProvider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider placement="top-right" toastProps={{ timeout: 4000, shouldShowTimeoutProgress: true }}>
      <AuthProvider>{children}</AuthProvider>
    </ToastProvider>
  );
}
