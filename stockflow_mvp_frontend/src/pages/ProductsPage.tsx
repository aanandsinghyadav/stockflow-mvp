import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/axios';
import type { ApiResponse, Product } from '../types';
import Spinner from '../components/Spinner';
import ErrorAlert from '../components/ErrorAlert';

// ── Inline adjust stock widget ────────────────────────────────────────────────
function AdjustStockRow({
  product,
  onDone,
  onCancel,
}: {
  product: Product;
  onDone: (updated: Product) => void;
  onCancel: () => void;
}) {
  const [adjustment, setAdjustment] = useState('');
  const [note, setNote]             = useState('');
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState('');

  const newQty = product.quantity + (parseInt(adjustment) || 0);

  const handleSubmit = async () => {
    const adj = parseInt(adjustment);
    if (isNaN(adj) || adj === 0) {
      setError('Enter a non-zero number (e.g. +5 or -3)');
      return;
    }
    if (newQty < 0) {
      setError(`Result would be negative (${newQty})`);
      return;
    }
    setSaving(true);
    setError('');
    try {
      const res = await api.patch<ApiResponse<Product>>(
        `/products/${product.id}/adjust-stock`,
        { adjustment: adj, note: note || undefined },
      );
      onDone(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Adjustment failed');
      setSaving(false);
    }
  };

  return (
    <tr className="bg-blue-50 border-t border-blue-100">
      <td colSpan={6} className="px-6 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-medium text-gray-600">
            Adjust stock for <span className="font-bold text-gray-900">{product.name}</span>
            <span className="ml-1 text-gray-400">(current: {product.quantity})</span>
          </span>

          {/* Adjustment input */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setAdjustment((v) => String((parseInt(v) || 0) - 1))}
              className="w-7 h-7 rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 font-bold text-sm flex items-center justify-center"
            >−</button>
            <input
              type="number"
              className="w-20 text-center border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
              value={adjustment}
              onChange={(e) => setAdjustment(e.target.value)}
              autoFocus
            />
            <button
              type="button"
              onClick={() => setAdjustment((v) => String((parseInt(v) || 0) + 1))}
              className="w-7 h-7 rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 font-bold text-sm flex items-center justify-center"
            >+</button>
          </div>

          {/* New qty preview */}
          {adjustment !== '' && (
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              newQty < 0
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700'
            }`}>
              → {newQty} units
            </span>
          )}

          {/* Note */}
          <input
            type="text"
            className="border border-gray-300 rounded-md px-2.5 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40 sm:w-52"
            placeholder="Note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSubmit}
              disabled={saving || !adjustment}
              className="btn-primary py-1.5 px-3 text-xs disabled:opacity-50"
            >
              {saving ? <Spinner className="h-3 w-3" /> : null}
              {saving ? 'Saving…' : 'Apply'}
            </button>
            <button
              onClick={onCancel}
              className="btn-secondary py-1.5 px-3 text-xs"
            >
              Cancel
            </button>
          </div>

          {error && (
            <span className="text-xs text-red-600">{error}</span>
          )}
        </div>
      </td>
    </tr>
  );
}

// ── Main products page ────────────────────────────────────────────────────────
export default function ProductsPage() {
  const [products, setProducts]     = useState<Product[]>([]);
  const [search, setSearch]         = useState('');
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [adjustingId, setAdjustingId] = useState<number | null>(null);

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

  const handleAdjustDone = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setAdjustingId(null);
  };

  // Client-side filter by name or SKU
  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-gray-900">Products</h2>
        <Link to="/products/new" className="btn-primary self-start sm:self-auto">
          + Add Product
        </Link>
      </div>

      {error && <ErrorAlert message={error} />}

      {/* Search */}
      <div className="relative max-w-sm">
        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm">🔍</span>
        <input
          type="text"
          className="input pl-9"
          placeholder="Search by name or SKU…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner className="h-8 w-8" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <p className="text-3xl">📦</p>
            <p className="text-gray-500 font-medium">
              {search ? 'No products match your search' : 'No products yet'}
            </p>
            {!search && (
              <Link to="/products/new" className="text-sm text-blue-600 hover:underline">
                Add your first product →
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">SKU</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Qty</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Selling Price</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((product) => (
                  <>
                    <tr
                      key={product.id}
                      className={`hover:bg-gray-50 transition-colors ${
                        adjustingId === product.id ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      {/* Name */}
                      <td className="px-6 py-3.5">
                        <div className="font-medium text-gray-900">{product.name}</div>
                        {product.description && (
                          <div className="text-xs text-gray-400 truncate max-w-[180px]">
                            {product.description}
                          </div>
                        )}
                      </td>

                      {/* SKU */}
                      <td className="px-6 py-3.5">
                        <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          {product.sku}
                        </span>
                      </td>

                      {/* Qty */}
                      <td className="px-6 py-3.5 text-right">
                        <span className={`font-semibold ${product.isLowStock ? 'text-red-600' : 'text-gray-900'}`}>
                          {product.quantity}
                        </span>
                      </td>

                      {/* Selling price */}
                      <td className="px-6 py-3.5 text-right text-gray-600">
                        {product.sellingPrice != null
                          ? `$${product.sellingPrice.toFixed(2)}`
                          : <span className="text-gray-300">—</span>}
                      </td>

                      {/* Status badge */}
                      <td className="px-6 py-3.5 text-center">
                        {product.isLowStock ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            In Stock
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() =>
                              setAdjustingId((prev) =>
                                prev === product.id ? null : product.id,
                              )
                            }
                            className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            {adjustingId === product.id ? 'Cancel' : 'Adjust'}
                          </button>
                          <Link
                            to={`/products/${product.id}/edit`}
                            className="text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id, product.name)}
                            disabled={deletingId === product.id}
                            className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors disabled:opacity-40"
                          >
                            {deletingId === product.id ? 'Deleting…' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Inline adjust stock row */}
                    {adjustingId === product.id && (
                      <AdjustStockRow
                        key={`adjust-${product.id}`}
                        product={product}
                        onDone={handleAdjustDone}
                        onCancel={() => setAdjustingId(null)}
                      />
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Row count */}
      {!loading && filtered.length > 0 && (
        <p className="text-xs text-gray-400 text-right">
          {filtered.length} product{filtered.length !== 1 ? 's' : ''}
          {search && ` matching "${search}"`}
        </p>
      )}
    </div>
  );
}
