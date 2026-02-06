import { getPatterns } from '../../lib/api';
import PatternTable from '../../components/PatternTable';
import PatternForm from '../../components/PatternForm';

export const dynamic = 'force-dynamic';

export default async function PatternsPage() {
  const patterns = await getPatterns().catch(() => []);
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Padrões Ativos</h1>
      <p className="text-sm text-gray-600">Lista vinda do backend Kodi API.</p>
      <PatternForm onAdded={async () => { /* no-op, server-render will reflect on reload */ }} />
      <PatternTable initial={patterns} />
    </section>
  );
}
