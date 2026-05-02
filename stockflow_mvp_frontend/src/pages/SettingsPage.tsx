import { useEffect, useState, type FormEvent } from 'react';
import api from '../lib/axios';
import type { ApiResponse, Settings } from '../types';
import Spinner from '../components/Spinner';
import ErrorAlert from '../components/ErrorAlert';

export default function SettingsPage() {
  const [settings, setSettings]   = useState<Settings | null>(null);
  const [threshold, setThreshold] = useState('');
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');

  useEffect(() => {
    api
      .get<ApiResponse<Settings>>('/settings')
      .then((res) => {
        setSettings(res.data.data);
        setThreshold(String(res.data.data.defaultLowStockThreshold));
      })
      .catch(() => setError('Failed to load settings'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const res = await api.put<ApiResponse<Settings>>('/settings', {
        defaultLowStockThreshold: Number(threshold),
      });
      setSettings(res.data.data);
      setSuccess('Settings saved successfully');
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="max-w-lg space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Settings</h2>

      {error && <ErrorAlert message={error} />}

      {success && (
        <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <div className="card p-6 space-y-6">
        {/* Org info (read-only) */}
        <div>
          <p className="label">Organization</p>
          <p className="text-gray-900 font-medium">{settings?.organizationName}</p>
        </div>

        <hr className="border-gray-200" />

        {/* Editable settings */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="threshold" className="label">
              Default Low Stock Threshold
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Products without their own threshold will use this value to
              determine low stock status.
            </p>
            <input
              id="threshold"
              type="number"
              min={0}
              className="input max-w-xs"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? <Spinner className="h-4 w-4 mr-2" /> : null}
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>
    </div>
  );
}
