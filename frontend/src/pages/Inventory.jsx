import { useState } from 'react';
import { mockInventory } from '../data/mockData';

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const categories = ['All', ...new Set(mockInventory.map((item) => item.category))];

  const filteredInventory = mockInventory.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

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

  const stockStats = {
    total: mockInventory.length,
    inStock: mockInventory.filter((i) => i.status === 'In Stock').length,
    lowStock: mockInventory.filter((i) => i.status === 'Low Stock').length,
    critical: mockInventory.filter((i) => i.status === 'Critical').length,
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-semibold text-text-primary mb-2">
            Inventory
          </h1>
          <p className="text-text-secondary">
            Track and manage your stock levels
          </p>
        </div>
        <button className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-hover transition-all shadow-soft hover:shadow-medium flex items-center gap-2 w-fit">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
      </div>

      {/* Stats Cards */}
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <svg className="w-5 h-5 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search products or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
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

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-bg-secondary border-b border-border">
              <tr>
                <th className="text-left text-sm font-medium text-text-secondary px-6 py-4">
                  Product
                </th>
                <th className="text-left text-sm font-medium text-text-secondary px-6 py-4">
                  SKU
                </th>
                <th className="text-left text-sm font-medium text-text-secondary px-6 py-4">
                  Category
                </th>
                <th className="text-left text-sm font-medium text-text-secondary px-6 py-4">
                  Stock
                </th>
                <th className="text-left text-sm font-medium text-text-secondary px-6 py-4">
                  Min Stock
                </th>
                <th className="text-left text-sm font-medium text-text-secondary px-6 py-4">
                  Price
                </th>
                <th className="text-left text-sm font-medium text-text-secondary px-6 py-4">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item, index) => (
                <tr
                  key={item.id}
                  className={`border-b border-border last:border-b-0 hover:bg-bg-secondary transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-bg-secondary/50'
                  }`}
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-text-primary">{item.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-sm text-text-secondary bg-bg-secondary px-2 py-1 rounded">
                      {item.sku}
                    </code>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {item.category}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-text-primary">{item.stock}</span>
                      {item.stock <= item.minStock && (
                        <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {item.minStock}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-text-primary">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Low Stock Alert Banner */}
      {stockStats.critical > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h4 className="font-medium text-red-800">Critical Stock Alert</h4>
              <p className="text-sm text-red-700 mt-1">
                {stockStats.critical} product(s) are at critically low levels and need immediate restocking.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
