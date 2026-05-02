import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/axios';
import type { ApiResponse, DashboardData } from '../types';
import Spinner from '../components/Spinner';
import ErrorAlert from '../components/ErrorAlert';

function StatCard({
  label,
  value,
  color = 'text-gray-900',
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div className="card p-6">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData]     = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  useEffect(() => {
    api
      .get<ApiResponse<DashboardData>>('/dashboard')
      .then((res) => setData(res.data.data))
      .catch(() => setError('Failed to load dashboard data'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (error) return <ErrorAlert message={error} />;
  if (!data) return null;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Products" value={data.totalProducts} />
        <StatCard label="Total Units in Stock" value={data.totalQuantity} />
        <StatCard
          label="Low Stock Items"
          value={data.lowStockItems.length}
          color={data.lowStockItems.length > 0 ? 'text-red-600' : 'text-green-600'}
        />
      </div>

      {/* Low stock table */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Low Stock Items</h3>
          <Link to="/products" className="text-sm text-primary-600 hover:underline">
            View all products →
          </Link>
        </div>

        {data.lowStockItems.length === 0 ? (
          <div className="px-6 py-10 text-center text-gray-400 text-sm">
            🎉 No low stock items right now
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">SKU</th>
                  <th className="px-6 py-3 text-right">Qty on Hand</th>
                  <th className="px-6 py-3 text-right">Threshold</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.lowStockItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-3 text-gray-500 font-mono">
                      {item.sku}
                    </td>
                    <td className="px-6 py-3 text-right text-red-600 font-semibold">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-3 text-right text-gray-500">
                      {item.lowStockThreshold}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
