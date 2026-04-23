import { useState } from 'react';
import { api } from '../services/api';

const RouteOptimization = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [shipmentWeight, setShipmentWeight] = useState('');
  const [mode, setMode] = useState('ground');
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOptimize = async (e) => {
    e.preventDefault();
    setError('');

    if (!origin.trim() || !destination.trim()) {
      setError('Please enter both origin and destination');
      return;
    }

    setLoading(true);

    try {
      const response = await api.getRoutes({
        origin: origin.trim(),
        destination: destination.trim(),
        mode,
        weight: shipmentWeight ? parseFloat(shipmentWeight) : 100,
      });

      const routesData = response?.data?.routes || [
        {
          id: 'RT-001',
          mode: mode === 'air' ? 'Air' : mode === 'sea' ? 'Sea' : 'Ground',
          distance: 156,
          distanceKm: 156,
          duration: '4.5 hours',
          cost: 450,
          toll: 25,
          estimatedCost: 475,
          emissions: 'High',
          eta: '2:30 PM',
        },
        {
          id: 'RT-002',
          mode: mode === 'air' ? 'Air Cargo' : mode === 'sea' ? 'Sea (Express)' : 'Ground (Alt)',
          distance: 162,
          distanceKm: 162,
          duration: '5.2 hours',
          cost: 420,
          toll: 30,
          estimatedCost: 450,
          emissions: 'Medium',
          eta: '3:15 PM',
        },
        {
          id: 'RT-003',
          mode: mode === 'air' ? 'Standard' : mode === 'sea' ? 'Standard Sea' : 'Economy',
          distance: 175,
          distanceKm: 175,
          duration: '5.8 hours',
          cost: 380,
          toll: 20,
          estimatedCost: 400,
          emissions: 'Low',
          eta: '4:00 PM',
        },
      ];

      setRoutes(routesData);
      if (routesData.length > 0) {
        setSelectedRoute(routesData[0]);
      }
    } catch (err) {
      setError('Failed to fetch routes. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-display font-semibold text-text-primary mb-2">
          Route Optimization
        </h1>
        <p className="text-text-secondary">
          Find the best delivery routes and optimize costs, time, and emissions
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-2xl p-6 shadow-soft">
        <form onSubmit={handleOptimize} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Origin
              </label>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="Enter origin city or address"
                className="input"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Destination
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Enter destination city or address"
                className="input"
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Shipment Weight (kg)
              </label>
              <input
                type="number"
                value={shipmentWeight}
                onChange={(e) => setShipmentWeight(e.target.value)}
                placeholder="100"
                className="input"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Transportation Mode
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="input"
                disabled={loading}
              >
                <option value="ground">Ground</option>
                <option value="air">Air</option>
                <option value="sea">Sea</option>
                <option value="rail">Rail</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-hover transition-all shadow-soft hover:shadow-medium disabled:opacity-50"
          >
            {loading ? 'Finding Best Routes...' : 'Optimize Routes'}
          </button>
        </form>
      </div>

      {/* Results Section */}
      {routes.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Routes List */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="font-display font-semibold text-text-primary mb-4">
              Available Routes
            </h3>
            {routes.map((route) => (
              <button
                key={route.id}
                onClick={() => setSelectedRoute(route)}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  selectedRoute?.id === route.id
                    ? 'border-primary bg-soft-green'
                    : 'border-border bg-white hover:bg-bg-secondary'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-text-primary">{route.mode}</p>
                  <span className="text-sm font-semibold text-primary">${route.estimatedCost}</span>
                </div>
                <div className="space-y-1 text-xs text-text-secondary">
                  <p>Distance: {route.distanceKm} km</p>
                  <p>Duration: {route.duration}</p>
                  <p>Emissions: {route.emissions}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Selected Route Details */}
          {selectedRoute && (
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-soft">
              <div className="mb-6">
                <h2 className="text-2xl font-display font-semibold text-text-primary mb-2">
                  {selectedRoute.mode}
                </h2>
                <p className="text-text-secondary">
                  Selected route from {origin} to {destination}
                </p>
              </div>

              {/* Route Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-soft-green rounded-xl p-4">
                  <p className="text-xs text-text-secondary mb-1">Total Distance</p>
                  <p className="text-2xl font-display font-semibold text-primary">
                    {selectedRoute.distanceKm} km
                  </p>
                </div>
                <div className="bg-soft-green rounded-xl p-4">
                  <p className="text-xs text-text-secondary mb-1">Estimated Duration</p>
                  <p className="text-2xl font-display font-semibold text-primary">
                    {selectedRoute.duration}
                  </p>
                </div>
                <div className="bg-bg-secondary rounded-xl p-4">
                  <p className="text-xs text-text-secondary mb-1">Base Cost</p>
                  <p className="text-2xl font-display font-semibold text-text-primary">
                    ${selectedRoute.cost}
                  </p>
                </div>
                <div className="bg-bg-secondary rounded-xl p-4">
                  <p className="text-xs text-text-secondary mb-1">Tolls & Fees</p>
                  <p className="text-2xl font-display font-semibold text-text-primary">
                    ${selectedRoute.toll}
                  </p>
                </div>
              </div>

              {/* Total Cost */}
              <div className="bg-primary/10 border-2 border-primary rounded-xl p-6 mb-6">
                <p className="text-text-secondary mb-1">Estimated Total Cost</p>
                <p className="text-4xl font-display font-semibold text-primary">
                  ${selectedRoute.estimatedCost}
                </p>
              </div>

              {/* Route Characteristics */}
              <div className="space-y-3">
                <h3 className="font-display font-semibold text-text-primary">
                  Route Characteristics
                </h3>
                <div className="flex gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 bg-bg-secondary rounded-lg">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                    </svg>
                    <span className="text-sm text-text-primary">ETA: {selectedRoute.eta}</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-bg-secondary rounded-lg">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-sm text-text-primary">Emissions: {selectedRoute.emissions}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button className="w-full mt-6 bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-hover transition-all shadow-soft hover:shadow-medium">
                Confirm & Schedule Shipment
              </button>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {routes.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-bg-secondary rounded-full mb-4">
            <svg className="w-8 h-8 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <h3 className="text-xl font-display font-semibold text-text-primary mb-2">
            No Routes Yet
          </h3>
          <p className="text-text-secondary">
            Enter origin and destination cities to find the best shipping routes
          </p>
        </div>
      )}
    </div>
  );
};

export default RouteOptimization;
