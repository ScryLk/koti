export default function Page() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Visão Geral</h1>
      <p className="text-sm text-gray-600">Score, métricas e atividade do agente. (MVP)</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded p-4">Score de conformidade</div>
        <div className="border rounded p-4">Top violações</div>
        <div className="border rounded p-4">Arquivos com mais problemas</div>
      </div>
    </section>
  );
}
