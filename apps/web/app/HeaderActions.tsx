"use client";
import { Button } from "@heroui/react";
import { useAuth } from "../components/AuthProvider";

export default function HeaderActions() {
  const { token, logout } = useAuth();
  const swaggerUrl = typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_BASE_URL
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/swagger-ui`
    : 'http://localhost:8081/swagger-ui';

  return (
    <div className="flex gap-3 items-center">
      <a href={swaggerUrl} target="_blank" rel="noreferrer" className="text-sm">Swagger</a>
      {token ? (
        <Button size="sm" color="primary" variant="flat" onPress={logout}>Sair</Button>
      ) : (
        <a href="/auth" className="text-sm">Login</a>
      )}
    </div>
  );
}
