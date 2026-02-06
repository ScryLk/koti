"use client";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, addToast } from "@heroui/react";
import { useState } from "react";
import { API_BASE_URL } from "../lib/api";
import { useAuth } from "./AuthProvider";

interface Pattern {
  id: string;
  language: string;
  type: string;
  scope: string;
  rule: string;
  pattern: string;
  severity: string;
  disabled?: boolean;
}

export default function PatternTable({ initial }: { initial: Pattern[] }) {
  const [patterns, setPatterns] = useState<Pattern[]>(initial);
  const [loading, setLoading] = useState<string | null>(null);
  const { token } = useAuth();

  async function disable(id: string) {
    const t = token ?? (typeof window !== 'undefined' ? localStorage.getItem("kodi_token") : null);
    if (!t) {
      addToast({
        title: "Login necessário",
        description: "Faça login para desativar padrões.",
        severity: "warning",
      });
      return;
    }
    try {
      setLoading(id);
      const res = await fetch(`${API_BASE_URL}/api/patterns/${id}/disable`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${t}` },
      });
      if (!res.ok) throw new Error("Falha ao desativar");
      setPatterns((prev) => prev.map((p) => (p.id === id ? { ...p, disabled: true } : p)));
      addToast({
        title: "Padrão desativado",
        description: id,
        severity: "success",
        timeout: 3000,
      });
    } catch (e) {
      addToast({
        title: "Erro ao desativar",
        description: (e as Error).message,
        severity: "danger",
      });
    } finally {
      setLoading(null);
    }
  }

  return (
    <Table aria-label="Tabela de padrões">
      <TableHeader>
        <TableColumn>ID</TableColumn>
        <TableColumn>Linguagem</TableColumn>
        <TableColumn>Tipo</TableColumn>
        <TableColumn>Escopo</TableColumn>
        <TableColumn>Regra</TableColumn>
        <TableColumn>Ações</TableColumn>
      </TableHeader>
      <TableBody emptyContent="Nenhum padrão cadastrado.">
        {patterns.map((p) => (
          <TableRow key={p.id}>
            <TableCell>{p.id}</TableCell>
            <TableCell>{p.language}</TableCell>
            <TableCell>{p.type}</TableCell>
            <TableCell>{p.scope}</TableCell>
            <TableCell>{p.rule}</TableCell>
            <TableCell>
              {p.disabled ? (
                <span className="text-red-600 text-xs">DESATIVADO</span>
              ) : (
                <Button size="sm" color="warning" isLoading={loading === p.id} onPress={() => disable(p.id)}>
                  Desativar
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
