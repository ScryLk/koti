"use client";
import { Input, Button, Card, CardHeader, CardBody, addToast } from "@heroui/react";
import { useState } from "react";
import { API_BASE_URL } from "../../lib/api";

export default function AuthPage() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("kodi123");
  const [loading, setLoading] = useState(false);
  // mensagens via toast

  async function login() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok || !data?.token) throw new Error(data?.message || "Falha no login");
      localStorage.setItem("kodi_token", data.token);
      addToast({
        title: "Login realizado",
        description: "Autenticação concluída com sucesso.",
        severity: "success",
        timeout: 3500,
      });
    } catch (e) {
      addToast({
        title: "Erro no login",
        description: (e as Error).message,
        severity: "danger",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader className="font-semibold">Login</CardHeader>
        <CardBody className="grid gap-3">
          <Input label="Usuário" value={username} onValueChange={setUsername} />
          <Input label="Senha" type="password" value={password} onValueChange={setPassword} />
          <Button color="primary" isLoading={loading} onPress={login}>Entrar</Button>
        </CardBody>
      </Card>
    </div>
  );
}
