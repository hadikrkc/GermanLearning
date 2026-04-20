import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1';

function useHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/health`);
      return res.data;
    },
    refetchInterval: 5000,
  });
}

export default function App() {
  const { data, isLoading, isError } = useHealth();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-semibold text-brand-700 mb-2">
          Almanca Ogrenme
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Sprint 0 iskelet — API saglik kontrolu canli.
        </p>

        <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
          <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
            API durumu
          </div>
          {isLoading && <div className="text-gray-700">Kontrol ediliyor…</div>}
          {isError && (
            <div className="text-red-600 font-medium">
              API'ye ulasilamiyor. Docker ve backend calisiyor mu?
            </div>
          )}
          {data && (
            <div className="space-y-1">
              <div>
                <span className="text-gray-500">Durum: </span>
                <span
                  className={
                    data.status === 'ok'
                      ? 'text-green-600 font-medium'
                      : 'text-amber-600 font-medium'
                  }
                >
                  {data.status}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Veritabani: </span>
                <span
                  className={
                    data.checks?.database === 'up'
                      ? 'text-green-600 font-medium'
                      : 'text-red-600 font-medium'
                  }
                >
                  {data.checks?.database}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {data.timestamp}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 text-xs text-gray-500">
          Swagger:{' '}
          <a
            className="text-brand-600 hover:underline"
            href="http://localhost:3000/api/docs"
            target="_blank"
            rel="noreferrer"
          >
            /api/docs
          </a>
        </div>
      </div>
    </div>
  );
}
