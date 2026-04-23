import { useState } from 'react';
import { mockShipments } from '../data/mockData';

const Tracking = () => {
  const [trackingId, setTrackingId] = useState('');
  const [searchedShipment, setSearchedShipment] = useState(null);
  const [error, setError] = useState('');

  const handleTrack = (e) => {
    e.preventDefault();
    setError('');

    if (!trackingId.trim()) {
      setError('Please enter a tracking ID');
      return;
    }

    // Search for shipment
    const found = mockShipments.find(
      (s) => s.id.toLowerCase() === trackingId.toLowerCase()
    );

    if (found) {
      setSearchedShipment(found);
    } else {
      setError('Shipment not found. Please check your tracking ID.');
      setSearchedShipment(null);
    }
  };

  const getProgressColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-primary';
      case 'In Transit':
        return 'bg-primary';
      case 'Pending':
        return 'bg-amber-500';
      default:
        return 'bg-bg-secondary';
    }
  };

  const getStatusSteps = (progress) => {
    const steps = [
      { name: 'Order Placed', completed: progress >= 10 },
      { name: 'Processing', completed: progress >= 30 },
      { name: 'In Transit', completed: progress >= 50 },
      { name: 'Out for Delivery', completed: progress >= 80 },
      { name: 'Delivered', completed: progress >= 100 },
    ];
    return steps;
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-display font-semibold text-text-primary mb-2">
          Shipment Tracking
        </h1>
        <p className="text-text-secondary">
          Track your shipments in real-time
        </p>
      </div>

      {/* Tracking Input */}
      <div className="bg-white rounded-2xl p-6 shadow-soft">
        <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <svg className="w-5 h-5 text-text-secondary absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="Enter tracking ID (e.g., SH-8921)"
              className="input pl-12 py-4 text-lg"
            />
          </div>
          <button
            type="submit"
            className="bg-primary text-white px-8 py-4 rounded-xl font-medium hover:bg-primary-hover transition-all shadow-soft hover:shadow-medium whitespace-nowrap"
          >
            Track Shipment
          </button>
        </form>
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>

      {/* Tracking Result */}
      {searchedShipment && (
        <div className="bg-white rounded-2xl p-6 shadow-soft">
          {/* Shipment Info Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-8 border-b border-border">
            <div>
              <h2 className="text-xl font-display font-semibold text-text-primary mb-1">
                {searchedShipment.id}
              </h2>
              <p className="text-text-secondary">
                {searchedShipment.origin} → {searchedShipment.destination}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-text-secondary">Estimated Delivery</p>
                <p className="text-lg font-display font-semibold text-primary">
                  {searchedShipment.eta}
                </p>
              </div>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                searchedShipment.status === 'Delivered' ? 'bg-soft-green' : 'bg-primary/10'
              }`}>
                {searchedShipment.status === 'Delivered' ? (
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-text-secondary">Progress</span>
              <span className="text-sm font-medium text-primary">{searchedShipment.progress}%</span>
            </div>
            <div className="h-3 bg-bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full ${getProgressColor(searchedShipment.status)} rounded-full transition-all duration-1000`}
                style={{ width: `${searchedShipment.progress}%` }}
              />
            </div>
          </div>

          {/* Status Steps */}
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-bg-secondary"></div>
            <div className="space-y-6">
              {getStatusSteps(searchedShipment.progress).map((step, index) => (
                <div key={step.name} className="relative flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                    step.completed ? 'bg-primary' : 'bg-bg-secondary'
                  }`}>
                    {step.completed ? (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-border"></div>
                    )}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${
                      step.completed ? 'text-text-primary' : 'text-text-secondary'
                    }`}>
                      {step.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipment Details */}
          <div className="mt-8 pt-8 border-t border-border">
            <h3 className="font-display font-semibold text-text-primary mb-4">
              Shipment Details
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-bg-secondary rounded-xl p-4">
                <p className="text-xs text-text-secondary mb-1">Origin</p>
                <p className="font-medium text-text-primary">{searchedShipment.origin}</p>
              </div>
              <div className="bg-bg-secondary rounded-xl p-4">
                <p className="text-xs text-text-secondary mb-1">Destination</p>
                <p className="font-medium text-text-primary">{searchedShipment.destination}</p>
              </div>
              <div className="bg-bg-secondary rounded-xl p-4">
                <p className="text-xs text-text-secondary mb-1">Status</p>
                <p className="font-medium text-primary">{searchedShipment.status}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Shipments */}
      <div className="bg-white rounded-2xl p-6 shadow-soft">
        <h3 className="font-display font-semibold text-lg text-text-primary mb-6">
          Recent Shipments
        </h3>
        <div className="space-y-3">
          {mockShipments.map((shipment) => (
            <div
              key={shipment.id}
              onClick={() => {
                setTrackingId(shipment.id);
                setSearchedShipment(shipment);
              }}
              className="flex items-center justify-between p-4 bg-bg-secondary rounded-xl hover:bg-soft-green transition-colors cursor-pointer"
            >
              <div>
                <p className="font-medium text-text-primary">{shipment.id}</p>
                <p className="text-sm text-text-secondary">
                  {shipment.origin} → {shipment.destination}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden sm:block w-32 h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${shipment.progress}%` }}
                  />
                </div>
                <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tracking;
