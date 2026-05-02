import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../lib/axios';
import type { ApiResponse, Product, CreateProductPayload } from '../types';
import ErrorAlert from '../components/ErrorAlert';
import Spinner from '../components/Spinner';

const emptyForm: CreateProductPayload = {
  name: '',
  sku: '',
  description: '',
  quantity: 0,
  costPrice: undefined,
  sellingPrice: undefined,
  lowStockThreshold: undefined,
};

export default function ProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [form, setForm]       = useState<CreateProductPayload>(emptyForm);
  const [loading, setLoading] = useState(isEdit); // fetch existing product if editing
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');

  // Load existing product when editing
  useEffect(() => {
    if (!isEdit) return;
    api
      .get<ApiResponse<Product>>(`/products/${id}`)
      .then((res) => {
        const p = res.data.data;
        setForm({
          name: p.name,
          sku: p.sku,
          description: p.description ?? '',
          quantity: p.quantity,
          costPrice: p.costPrice ?? undefined,
          sellingPrice: p.sellingPrice ?? undefined,
          lowStockThreshold: p.lowStockThreshold ?? undefined,
        });
      })
      .catch(() => setError('Failed to load product'))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === 'number'
          ? value === ''
            ? undefined
            : Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      if (isEdit) {
        await api.put(`/products/${id}`, form);
      } else {
        await api.post('/products', form);
      }
      navigate('/products');
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to save product');
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
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/products')}
          className="text-gray-400 hover:text-gray-600 text-sm"
        >
          ← Back
        </button>
        <h2 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Edit Product' : 'Add Product'}
        </h2>
      </div>

      {error && <ErrorAlert message={error} />}

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label htmlFor="name" className="label">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="input"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Widget A"
            />
          </div>

          {/* SKU */}
          <div>
            <label htmlFor="sku" className="label">
              SKU <span className="text-red-500">*</span>
            </label>
            <input
              id="sku"
              name="sku"
              type="text"
              className="input"
              value={form.sku}
              onChange={handleChange}
              required
              placeholder="WGT-001"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="label">
              Description <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={2}
              className="input resize-none"
              value={form.description ?? ''}
              onChange={handleChange}
              placeholder="Brief product description"
            />
          </div>

          {/* Quantity */}
          <div>
            <label htmlFor="quantity" className="label">
              Quantity on Hand <span className="text-red-500">*</span>
            </label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              min={0}
              className="input"
              value={form.quantity}
              onChange={handleChange}
              required
            />
          </div>

          {/* Prices */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="costPrice" className="label">
                Cost Price <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                id="costPrice"
                name="costPrice"
                type="number"
                min={0}
                step="0.01"
                className="input"
                value={form.costPrice ?? ''}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>
            <div>
              <label htmlFor="sellingPrice" className="label">
                Selling Price <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                id="sellingPrice"
                name="sellingPrice"
                type="number"
                min={0}
                step="0.01"
                className="input"
                value={form.sellingPrice ?? ''}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Low stock threshold */}
          <div>
            <label htmlFor="lowStockThreshold" className="label">
              Low Stock Threshold{' '}
              <span className="text-gray-400 font-normal">
                (optional — uses org default if empty)
              </span>
            </label>
            <input
              id="lowStockThreshold"
              name="lowStockThreshold"
              type="number"
              min={0}
              className="input"
              value={form.lowStockThreshold ?? ''}
              onChange={handleChange}
              placeholder="e.g. 5"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? <Spinner className="h-4 w-4 mr-2" /> : null}
              {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Product'}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/products')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
