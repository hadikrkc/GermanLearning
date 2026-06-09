import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { contentApi, userApi } from '../api/auth';
import { useAuthStore } from '../store/auth.store';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, setAuth, accessToken } = useAuthStore();
  const [selectedSubLevels, setSelectedSubLevels] = useState([]);
  const [primaryId, setPrimaryId] = useState(null);
  const [step, setStep] = useState(1); // 1=welcome, 2=level-select, 3=done

  const { data: levels = [], isLoading } = useQuery({
    queryKey: ['levels'],
    queryFn: contentApi.getLevels,
  });

  const mutation = useMutation({
    mutationFn: () =>
      userApi.setLevels({ subLevelIds: selectedSubLevels, primarySubLevelId: primaryId }),
    onSuccess: (updatedUser) => {
      setAuth(updatedUser, accessToken);
      setStep(3);
    },
  });

  function toggleSubLevel(id) {
    setSelectedSubLevels((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
    if (primaryId === id) setPrimaryId(null);
  }

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 w-full max-w-md text-center">
          <div className="text-5xl mb-4">🇩🇪</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome, {user?.displayName ?? 'Learner'}!
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            Let&apos;s personalise your German learning journey in just a few steps.
          </p>
          <button
            onClick={() => setStep(2)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition"
          >
            Get Started →
          </button>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 w-full max-w-md text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">All set!</h1>
          <p className="text-gray-500 text-sm mb-8">
            Your levels have been saved. You&apos;re ready to start learning.
          </p>
          <button
            onClick={() => navigate('/', { replace: true })}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg text-sm transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">Select Your Level</h1>
          <span className="text-xs text-gray-400">Step 2 / 2</span>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Choose your German level. You can select more than one.
        </p>

        {isLoading ? (
          <div className="text-center py-8 text-gray-400">Loading...</div>
        ) : (
          <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
            {levels.map((level) => (
              <div key={level.id}>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  {level.displayName}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {level.subLevels.map((sl) => {
                    const selected = selectedSubLevels.includes(sl.id);
                    const isPrimary = primaryId === sl.id;
                    return (
                      <button
                        key={sl.id}
                        type="button"
                        onClick={() => toggleSubLevel(sl.id)}
                        className={`p-3 rounded-lg border text-left text-sm transition ${
                          selected
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium">{sl.code}</div>
                        <div className="text-xs text-gray-500 truncate">{sl.displayName}</div>
                        {selected && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPrimaryId(isPrimary ? null : sl.id);
                            }}
                            className={`mt-1 text-xs px-2 py-0.5 rounded-full ${
                              isPrimary
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                          >
                            {isPrimary ? '★ Primary' : 'Set as primary'}
                          </button>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => navigate('/', { replace: true })}
            className="flex-1 border border-gray-300 text-gray-600 font-medium py-2 rounded-lg text-sm hover:bg-gray-50 transition"
          >
            Skip
          </button>
          <button
            onClick={() => mutation.mutate()}
            disabled={selectedSubLevels.length === 0 || mutation.isPending}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2 rounded-lg text-sm transition"
          >
            {mutation.isPending ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
