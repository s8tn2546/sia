import { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';

const buildSku = (value) => {
  const normalized = value
    .toUpperCase()
    .replace(/[^A-Z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

  return normalized.slice(0, 12) || `SKU-${Date.now().toString(36).toUpperCase()}`;
};

const Supply = () => {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [generatedRef, setGeneratedRef] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [routeOptions, setRouteOptions] = useState([]);
  const [routesLoading, setRoutesLoading] = useState(false);
  const [routeError, setRouteError] = useState('');
  const [formData, setFormData] = useState({
    supplier: '',
    product: '',
    sku: '',
    origin: '',
    destination: '',
    quantity: '',
    unitPrice: '',
    mode: 'ground',
    selectedRoute: '',
  });

  const loadInventory = async () => {
    setLoading(true);
    try {
      const response = await api.getInventory();
      setInventory(Array.isArray(response?.data) ? response.data : []);
    } catch (err) {
      setError('Failed to load supply data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const fetchRouteOptions = async () => {
    if (!formData.origin.trim() || !formData.destination.trim()) {
      setRouteError('Enter origin and destination to get route choices.');
      return;
    }

    setRoutesLoading(true);
    setRouteError('');

    try {
      const modeMap = {
        ground: 'driving',
        air: 'driving',
        sea: 'driving',
        rail: 'driving'
      };

      const response = await api.getRoutes({
        origin: formData.origin.trim(),
        destination: formData.destination.trim(),
        mode: modeMap[formData.mode] || 'driving'
      });

      const options = response?.data?.routes || [];
      setRouteOptions(options);

      if (options.length === 0) {
        setRouteError('No route options returned.');
      }

      if (options.length > 0) {
        const firstLabel = options[0].label || options[0].summary || 'Option 1';
        setFormData((prev) => ({ ...prev, selectedRoute: firstLabel }));
      }
    } catch (err) {
      setRouteError('Failed to fetch route options.');
      setRouteOptions([]);
    } finally {
      setRoutesLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const selectedRouteOption = routeOptions.find((route) => {
        const label = route.label || route.summary || '';
        return label.toLowerCase() === formData.selectedRoute.toLowerCase();
      }) || null;

      const payload = {
        sku: formData.sku.trim() || buildSku(formData.product),
        productName: formData.product.trim(),
        warehouse: formData.supplier.trim(),
        quantity: Number(formData.quantity || 0),
        unitCost: Number(formData.unitPrice || 0),
        origin: formData.origin.trim(),
        destination: formData.destination.trim(),
        mode: formData.mode,
        routeOption: selectedRouteOption
      };

      const response = await api.createSupply(payload);
      const saved = response?.data;

      if (saved) {
        setGeneratedRef({
          transactionId: saved.transactionId,
          trackingId: saved.trackingId
        });
      }

      setShowForm(false);
      setFormData({
        supplier: '',
        product: '',
        sku: '',
        origin: '',
        destination: '',
        quantity: '',
        unitPrice: '',
        mode: 'ground',
        selectedRoute: '',
      });
      setRouteOptions([]);
      setRouteError('');

      await loadInventory();
    } catch (err) {
      setError('Failed to persist supply input. Please validate the form and try again.');
    }
  };

  const supplyRows = useMemo(() => {
    return inventory.map((item) => ({
      id: item._id,
      supplier: item.warehouse,
      product: item.productName,
      quantity: Number(item.quantity || 0),
      unitPrice: Number(item.unitCost || 0),
      total: Number(item.quantity || 0) * Number(item.unitCost || 0),
      route: 'N/A',
      status: Number(item.quantity || 0) > Number(item.reorderLevel || 0) ? 'Active' : 'Pending',
    }));
  }, [inventory]);

  const statusColors = {
    Active: 'bg-soft-green text-dark-green',
    Pending: 'bg-amber-100 text-amber-800',
    Completed: 'bg-blue-100 text-blue-800',
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-semibold text-text-primary mb-2">
            Supply Management
          </h1>
          <p className="text-text-secondary">
            Manage suppliers and procurement
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-hover transition-all shadow-soft hover:shadow-medium flex items-center gap-2 w-fit"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Supply
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
              <h2 className="text-xl font-display font-semibold text-text-primary">
                Add New Supply
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 hover:bg-bg-secondary rounded-xl transition-colors"
              >
                <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Supplier Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  className="input"
                  placeholder="Enter supplier/warehouse"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Product
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.product}
                    onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                    className="input"
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    SKU (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="input"
                    placeholder="Auto-generated if empty"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Transportation Mode</label>
                  <select
                    value={formData.mode}
                    onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                    className="input"
                  >
                    <option value="ground">Ground</option>
                    <option value="air">Air</option>
                    <option value="sea">Sea</option>
                    <option value="rail">Rail</option>
                  </select>
                </div>
                <div></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Origin</label>
                  <input
                    type="text"
                    required
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    className="input"
                    placeholder="Origin city/warehouse"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Destination</label>
                  <input
                    type="text"
                    required
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="input"
                    placeholder="Destination city/warehouse"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="input"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Unit Price (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                    className="input"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-text-primary">Route Choice</label>
                  <button
                    type="button"
                    onClick={fetchRouteOptions}
                    className="text-sm font-medium text-primary hover:text-primary-hover"
                  >
                    {routesLoading ? 'Loading...' : 'Suggest Routes'}
                  </button>
                </div>
                <select
                  value={formData.selectedRoute}
                  onChange={(e) => setFormData({ ...formData, selectedRoute: e.target.value })}
                  className="input"
                  disabled={routeOptions.length === 0}
                >
                  {routeOptions.length === 0 ? (
                    <option value="">No routes loaded yet</option>
                  ) : (
                    routeOptions.map((route, index) => {
                      const label = route.label || route.summary || `Option ${index + 1}`;
                      const eta = route.durationMin ? `${route.durationMin} min` : 'ETA n/a';
                      const cost = route.estimatedCost ? `₹${route.estimatedCost}` : '';
                      return (
                        <option key={`${label}-${index}`} value={label}>
                          {`${label} (${eta}) ${cost}`.trim()}
                        </option>
                      );
                    })
                  )}
                </select>
                {routeError && <p className="mt-2 text-xs text-amber-700">{routeError}</p>}
              </div>

              {formData.quantity && formData.unitPrice && (
                <div className="bg-soft-green rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Total Cost</span>
                    <span className="text-xl font-display font-semibold text-dark-green">
                      ₹{(parseFloat(formData.quantity) * parseFloat(formData.unitPrice)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-hover transition-all shadow-soft hover:shadow-medium"
              >
                Save Supply
              </button>
            </form>
          </div>
        </div>
      )}

      {generatedRef && (
        <div className="bg-soft-green border border-primary/20 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-soft">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-display font-semibold text-dark-green mb-2">
                Supply Saved Successfully
              </h3>
              <div className="space-y-2 mb-3 text-sm text-text-secondary">
                <p>Transaction ID: <span className="font-mono text-dark-green">{generatedRef.transactionId}</span></p>
                <p>Tracking ID: <span className="font-mono text-dark-green">{generatedRef.trackingId}</span></p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setGeneratedRef(null)}
                  className="text-sm text-primary hover:text-primary-hover font-medium"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-bg-secondary border-b border-border">
              <tr>
                <th className="text-left text-sm font-medium text-text-secondary px-6 py-4">Supplier</th>
                <th className="text-left text-sm font-medium text-text-secondary px-6 py-4">Product</th>
                <th className="text-left text-sm font-medium text-text-secondary px-6 py-4">Quantity</th>
                <th className="text-left text-sm font-medium text-text-secondary px-6 py-4">Unit Price</th>
                <th className="text-left text-sm font-medium text-text-secondary px-6 py-4">Total</th>
                <th className="text-left text-sm font-medium text-text-secondary px-6 py-4">Route</th>
                <th className="text-left text-sm font-medium text-text-secondary px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-text-secondary">Loading supply data...</td>
                </tr>
              ) : supplyRows.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-text-secondary">No persisted supply records found.</td>
                </tr>
              ) : (
                supplyRows.map((supply, index) => (
                  <tr
                    key={supply.id}
                    className={`border-b border-border last:border-b-0 hover:bg-bg-secondary transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-bg-secondary/50'
                    }`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-text-primary">{supply.supplier}</td>
                    <td className="px-6 py-4 text-sm text-text-secondary">{supply.product}</td>
                    <td className="px-6 py-4 text-sm text-text-secondary">{supply.quantity.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-text-secondary">₹{supply.unitPrice.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-text-primary">₹{supply.total.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-text-secondary">{supply.route}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[supply.status] || 'bg-bg-secondary text-text-secondary'}`}>
                        {supply.status}
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

export default Supply;
