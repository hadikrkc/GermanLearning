import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { authApi } from '../api/auth';

export default function HomePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  async function handleLogout() {
    try {
      await authApi.logout();
    } finally {
      logout();
      navigate('/login', { replace: true });
    }
  }

  const roleLabel = { USER: 'Student', TEACHER: 'Teacher', ADMIN: 'Admin' }[user?.role] ?? '';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🇩🇪</span>
          <span className="font-semibold text-gray-900">German Learning Support</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            {user?.displayName ?? user?.email}
            <span className="ml-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
              {roleLabel}
            </span>
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-red-600 transition"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Hello, {user?.displayName ?? 'Learner'} 👋
        </h1>
        <p className="text-gray-500 mb-8">Let&apos;s continue learning German.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: '📚', title: 'Vocabulary Practice', desc: 'Study words with flashcards and quizzes', soon: true },
            { icon: '✏️', title: 'Grammar Exercises', desc: 'Articles, fill-in-the-blank, sentence building', soon: true },
            { icon: '🎧', title: 'Listening Practice', desc: 'Listen to German dialogues', soon: true },
          ].map((card) => (
            <div
              key={card.title}
              className="bg-white border border-gray-200 rounded-xl p-5 relative"
            >
              <div className="text-3xl mb-3">{card.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-1">{card.title}</h3>
              <p className="text-sm text-gray-500">{card.desc}</p>
              {card.soon && (
                <span className="absolute top-3 right-3 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                  Coming Soon
                </span>
              )}
            </div>
          ))}
        </div>

        {user?.role === 'ADMIN' && (
          <div className="mt-8 bg-indigo-50 border border-indigo-200 rounded-xl p-5">
            <h2 className="font-semibold text-indigo-900 mb-1">Admin Panel</h2>
            <p className="text-sm text-indigo-700">
              User and content management will be completed in Sprint 2.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
