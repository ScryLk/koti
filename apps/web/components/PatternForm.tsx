"use client";
import { useState } from "react";
import { Input, Button, Select, SelectItem, Textarea, addToast } from "@heroui/react";
import { API_BASE_URL } from "../lib/api";
import { useAuth } from "./AuthProvider";

export default function PatternForm({ onAdded }: { onAdded?: () => void }) {
  const { token } = useAuth();
  const [id, setId] = useState("");
  const [language, setLanguage] = useState("java");
  const [type, setType] = useState("naming-convention");
  const [scope, setScope] = useState("class");
  const [rule, setRule] = useState("");
  const [pattern, setPattern] = useState("");
  const [severity, setSeverity] = useState("warning");
  const [loading, setLoading] = useState(false);

  async function submit() {
    const t = token ?? (typeof window !== 'undefined' ? localStorage.getItem("kodi_token") : null);
    if (!t) {
      addToast({
        title: "Login necessário",
        description: "Faça login para adicionar padrões.",
        severity: "warning",
      });
      return;
    }
    if (!id || !rule || !pattern) {
      addToast({
        title: "Campos obrigatórios",
        description: "Preencha ID, Regra e Pattern.",
        severity: "warning",
      });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/patterns`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${t}`,
        },
        body: JSON.stringify({ id, language, type, scope, rule, pattern, severity }),
      });
      if (!res.ok) throw new Error("Falha ao adicionar padrão");
      addToast({
        title: "Padrão adicionado",
        description: id,
        severity: "success",
        timeout: 3000,
      });
      if (onAdded) onAdded();
      else if (typeof window !== 'undefined') window.location.reload();
      setId("");
      setRule("");
      setPattern("");
    } catch (e) {
      addToast({
        title: "Erro ao adicionar",
        description: (e as Error).message,
        severity: "danger",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-3 border rounded p-4">
      <Input label="ID" value={id} onValueChange={setId} placeholder="service-class-naming" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Select label="Linguagem" selectedKeys={[language]} onSelectionChange={(k) => setLanguage(Array.from(k)[0] as string)}>
          {['java','typescript','javascript','python'].map((lang) => (
            <SelectItem key={lang} value={lang}>{lang}</SelectItem>
          ))}
        </Select>
        <Select label="Tipo" selectedKeys={[type]} onSelectionChange={(k) => setType(Array.from(k)[0] as string)}>
          {['naming-convention','structural-pattern','code-style'].map((t) => (
            <SelectItem key={t} value={t}>{t}</SelectItem>
          ))}
        </Select>
        <Select label="Escopo" selectedKeys={[scope]} onSelectionChange={(k) => setScope(Array.from(k)[0] as string)}>
          {['class','interface','file','method','variable'].map((s) => (
            <SelectItem key={s} value={s}>{s}</SelectItem>
          ))}
        </Select>
      </div>
      <Textarea label="Regra" value={rule} onValueChange={setRule} placeholder="Classes de serviço devem terminar com 'Service'" />
      <Input label="Pattern (regex)" value={pattern} onValueChange={setPattern} placeholder="^[A-Z][a-zA-Z]*Service$" />
      <Select label="Severidade" selectedKeys={[severity]} onSelectionChange={(k) => setSeverity(Array.from(k)[0] as string)}>
        {['error','warning','info'].map((s) => (
          <SelectItem key={s} value={s}>{s}</SelectItem>
        ))}
      </Select>
      <div className="flex justify-end">
        <Button color="primary" isLoading={loading} onPress={submit}>Adicionar Padrão</Button>
      </div>
    </div>
  );
}
