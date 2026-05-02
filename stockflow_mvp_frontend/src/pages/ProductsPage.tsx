import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/axios';
import type { ApiResponse, Product } from '../types';
import Spinner from '../components/Spinner';
import ErrorAlert from '../components/ErrorAlert';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch]     = useState('');
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchProducts = () => {
    setLoading(true);
    api
      .get<ApiResponse<Product[]>>('/products')
      .then((res) => setProducts(res.data.data))
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setError('Failed to delete product');
    } finally {
      setDeletingId(null);
    }
  };

  // Client-side filter by name or SKU
  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Products</h2>
        <Link to="/products/new" className="btn-primary">
          + Add Product
        </Link>
      </div>

      {error && <ErrorAlert message={error} />}

      {/* Search */}
      <input
        type="text"
        className="input max-w-sm"
        placeholder="Search by name or SKU..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner className="h-8 w-8" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">
            {search ? 'No products match your search' : 'No products yet — add your first one'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">SKU</th>
                  <th className="px-6 py-3 text-right">Qty</th>
                  <th className="px-6 py-3 text-right">Selling Price</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-3 text-gray-500 font-mono text-xs">
                      {product.sku}
                    </td>
                    <td className="px-6 py-3 text-right font-semibold">
                      {product.quantity}
                    </td>
                    <td className="px-6 py-3 text-right text-gray-600">
                      {product.sellingPrice != null
                        ? `$${product.sellingPrice.toFixed(2)}`
                        : '—'}
                    </td>
                    <td className="px-6 py-3 text-center">
                      {product.isLowStock ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          OK
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-right space-x-2">
                      <Link
                        to={`/products/${product.id}/edit`}
                        className="text-primary-600 hover:underline text-xs font-medium"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        disabled={deletingId === product.id}
                        className="text-red-600 hover:underline text-xs font-medium disabled:opacity-50"
                      >
                        {deletingId === product.id ? 'Deleting...' : 'Delete'}
                      </button>
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
