import { useState } from 'react';
import { mockSupplies } from '../data/mockData';

const Supply = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    supplier: '',
    product: '',
    quantity: '',
    unitPrice: '',
    route: 'Sea Freight',
  });
  const [generatedId, setGeneratedId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Generate transaction ID
    const transactionId = `TXN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    setGeneratedId(transactionId);
    setShowForm(false);
    setFormData({
      supplier: '',
      product: '',
      quantity: '',
      unitPrice: '',
      route: 'Sea Freight',
    });
  };

  const statusColors = {
    Active: 'bg-soft-green text-dark-green',
    Pending: 'bg-amber-100 text-amber-800',
    Completed: 'bg-blue-100 text-blue-800',
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
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

      {/* Add Supply Form Modal */}
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
                  placeholder="Enter supplier name"
                />
              </div>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="input"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Unit Price ($)
                  </label>
                  <input
                    type="number"
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
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Shipping Route
                </label>
                <select
                  value={formData.route}
                  onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                  className="input"
                >
                  <option value="Sea Freight">Sea Freight</option>
                  <option value="Air Freight">Air Freight</option>
                  <option value="Ground">Ground</option>
                  <option value="Rail">Rail</option>
                </select>
              </div>
              {formData.quantity && formData.unitPrice && (
                <div className="bg-soft-green rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Total Cost</span>
                    <span className="text-xl font-display font-semibold text-dark-green">
                      ${(parseFloat(formData.quantity) * parseFloat(formData.unitPrice)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-hover transition-all shadow-soft hover:shadow-medium"
              >
                Generate Transaction
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Generated Transaction ID Success */}
      {generatedId && (
        <div className="bg-soft-green border border-primary/20 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-soft">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-display font-semibold text-dark-green mb-2">
                Transaction Created Successfully!
              </h3>
              <p className="text-sm text-text-secondary mb-3">
                Your transaction has been recorded. Here's your reference ID:
              </p>
              <div className="flex items-center gap-3">
                <code className="bg-white px-4 py-2 rounded-lg font-mono text-sm text-dark-green">
                  {generatedId}
                </code>
                <button
                  onClick={() => setGeneratedId(null)}
                  className="text-sm text-primary hover:text-primary-hover font-medium"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Supplies Table */}
      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-bg-secondary border-b border-border">
              <tr>
                <th className="text-left text-sm font-medium text-text-secondary px-6 py-4">
                  Supplier
                </th>
                <th className="text-left text-sm font-medium text-text-secondary px-6 py-4">
                  Product
                </th>
                <th className="text-left text-sm font-medium text-text-secondary px-6 py-4">
                  Quantity
                </th>
                <th className="text-left text-sm font-medium text-text-secondary px-6 py-4">
                  Unit Price
                </th>
                <th className="text-left text-sm font-medium text-text-secondary px-6 py-4">
                  Total
                </th>
                <th className="text-left text-sm font-medium text-text-secondary px-6 py-4">
                  Route
                </th>
                <th className="text-left text-sm font-medium text-text-secondary px-6 py-4">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {mockSupplies.map((supply, index) => (
                <tr
                  key={supply.id}
                  className={`border-b border-border last:border-b-0 hover:bg-bg-secondary transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-bg-secondary/50'
                  }`}
                >
                  <td className="px-6 py-4 text-sm font-medium text-text-primary">
                    {supply.supplier}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {supply.product}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {supply.quantity.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    ${supply.unitPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-text-primary">
                    ${supply.total.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {supply.route}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[supply.status]}`}>
                      {supply.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Supply;
