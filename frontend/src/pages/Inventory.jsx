import { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import SearchInput from '../components/SearchInput';

const getStatus = (item) => {
  const quantity = Number(item.quantity || 0);
  const reorderLevel = Number(item.reorderLevel || 0);

  if (quantity <= Math.max(5, Math.floor(reorderLevel * 0.5))) {
    return 'Critical';
  }

  if (quantity <= reorderLevel) {
    return 'Low Stock';
  }

  return 'In Stock';
};

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [formData, setFormData] = useState({
    productName: '',
    sku: '',
    warehouse: '',
    quantity: '',
    reorderLevel: '20',
    unitCost: '',
  });

  const loadInventory = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.getInventory();
      setInventory(Array.isArray(response?.data) ? response.data : []);
    } catch (err) {
      setError('Failed to load inventory data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const categories = useMemo(() => {
    const values = inventory.map((item) => item.warehouse).filter(Boolean);
    return ['All', ...new Set(values)];
  }, [inventory]);

  const enrichedInventory = useMemo(() => {
    return inventory.map((item) => ({
      ...item,
      status: getStatus(item),
      stock: Number(item.quantity || 0),
      minStock: Number(item.reorderLevel || 0),
      name: item.productName,
      price: Number(item.unitCost || 0),
      category: item.warehouse || 'General',
    }));
  }, [inventory]);

  const filteredInventory = useMemo(() => {
    return enrichedInventory.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [enrichedInventory, searchTerm, filterCategory]);

  const stockStats = useMemo(() => {
    return {
      total: enrichedInventory.length,
      inStock: enrichedInventory.filter((i) => i.status === 'In Stock').length,
      lowStock: enrichedInventory.filter((i) => i.status === 'Low Stock').length,
      critical: enrichedInventory.filter((i) => i.status === 'Critical').length,
    };
  }, [enrichedInventory]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Stock':
        return 'bg-soft-green text-dark-green';
      case 'Low Stock':
        return 'bg-amber-100 text-amber-800';
      case 'Critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-bg-secondary text-text-secondary';
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const payload = {
        productName: formData.productName.trim(),
        sku: formData.sku.trim().toUpperCase(),
        warehouse: formData.warehouse.trim(),
        quantity: Number(formData.quantity || 0),
        reorderLevel: Number(formData.reorderLevel || 20),
        unitCost: Number(formData.unitCost || 0),
      };

      const response = await api.createInventory(payload);
      const item = response?.data;
      if (item) {
        setInventory((prev) => [item, ...prev]);
      }

      setFormData({
        productName: '',
        sku: '',
        warehouse: '',
        quantity: '',
        reorderLevel: '20',
        unitCost: '',
      });
      setShowForm(false);
    } catch (err) {
      setError('Failed to add product. Check SKU uniqueness and try again.');
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-semibold text-text-primary mb-2">
            Inventory
          </h1>
          <p className="text-text-secondary">
            Track and manage your stock levels
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-hover transition-all shadow-soft hover:shadow-medium flex items-center gap-2 w-fit"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-2xl shadow-large max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-semibold text-text-primary">Add New Product</h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 hover:bg-bg-secondary rounded-xl transition-colors"
              >
                <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Product Name</label>
                <input
                  type="text"
                  required
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  className="input"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">SKU</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Warehouse</label>
                  <input
                    type="text"
                    required
                    value={formData.warehouse}
                    onChange={(e) => setFormData({ ...formData, warehouse: e.target.value })}
                    className="input"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Quantity</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Reorder</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.reorderLevel}
                    onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Unit Cost</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={formData.unitCost}
                    onChange={(e) => setFormData({ ...formData, unitCost: e.target.value })}
                    className="input"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-hover transition-all shadow-soft hover:shadow-medium"
              >
                Save Product
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-soft">
          <p className="text-sm text-text-secondary mb-1">Total Products</p>
          <p className="text-2xl font-display font-semibold text-text-primary">{stockStats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-soft">
          <p className="text-sm text-text-secondary mb-1">In Stock</p>
          <p className="text-2xl font-display font-semibold text-primary">{stockStats.inStock}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-soft">
          <p className="text-sm text-text-secondary mb-1">Low Stock</p>
          <p className="text-2xl font-display font-semibold text-amber-600">{stockStats.lowStock}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-soft">
          <p className="text-sm text-text-secondary mb-1">Critical</p>
          <p className="text-2xl font-display font-semibold text-red-600">{stockStats.critical}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <SearchInput
          placeholder="Search products or SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="input sm:w-48"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-bg-secondary border-b border-border">
              <tr>
                <th className="text-left text-sm font-medium text-text-secondary px-6 py-4">Product</th>
                <th className="text-left text-sm font-medium text-text-secondary px-6 py-4">SKU</th>
                <th className="text-left text-sm font-medium text-text-secondary px-6 py-4">Warehouse</th>
                <th className="text-left text-sm font-medium text-text-secondary px-6 py-4">Stock</th>
                <th className="text-left text-sm font-medium text-text-secondary px-6 py-4">Min Stock</th>
                <th className="text-left text-sm font-medium text-text-secondary px-6 py-4">Unit Cost</th>
                <th className="text-left text-sm font-medium text-text-secondary px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-text-secondary">Loading inventory...</td>
                </tr>
              ) : filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-text-secondary">No inventory items found.</td>
                </tr>
              ) : (
                filteredInventory.map((item, index) => (
                  <tr
                    key={item._id}
                    className={`border-b border-border last:border-b-0 hover:bg-bg-secondary transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-bg-secondary/50'
                    }`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-text-primary">{item.name}</td>
                    <td className="px-6 py-4">
                      <code className="text-sm text-text-secondary bg-bg-secondary px-2 py-1 rounded">{item.sku}</code>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">{item.category}</td>
                    <td className="px-6 py-4 text-sm font-medium text-text-primary">{item.stock}</td>
                    <td className="px-6 py-4 text-sm text-text-secondary">{item.minStock}</td>
                    <td className="px-6 py-4 text-sm font-medium text-text-primary">₹{item.price.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
