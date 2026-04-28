import { useMemo, useState } from 'react';
import { api } from '../services/api';
import SearchInput from '../components/SearchInput';

const statusProgress = {
  created: 10,
  in_transit: 65,
  delivered: 100,
  delayed: 45,
};

const normalizeShipment = (shipment) => {
  const statusKey = String(shipment?.status || '').toLowerCase();
  const progress = statusProgress[statusKey] || 20;

  return {
    id: shipment.trackingId,
    origin: shipment.origin,
    destination: shipment.destination,
    status:
      statusKey === 'in_transit'
        ? 'In Transit'
        : statusKey === 'delivered'
          ? 'Delivered'
          : statusKey === 'delayed'
            ? 'Delayed'
            : 'Pending',
    eta: shipment.eta ? new Date(shipment.eta).toLocaleDateString() : 'TBD',
    progress,
    checkpoints: Array.isArray(shipment.checkpoints) ? shipment.checkpoints : [],
  };
};

const Tracking = () => {
  const [trackingId, setTrackingId] = useState('');
  const [searchedShipment, setSearchedShipment] = useState(null);
  const [recentShipments, setRecentShipments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    setError('');

    if (!trackingId.trim()) {
      setError('Please enter a tracking ID');
      return;
    }

    setLoading(true);
    try {
      const response = await api.getTracking(trackingId.trim());
      const normalized = normalizeShipment(response?.data || {});
      setSearchedShipment(normalized);
      setRecentShipments((prev) => {
        const deduped = prev.filter((item) => item.id !== normalized.id);
        return [normalized, ...deduped].slice(0, 5);
      });
    } catch (err) {
      setError('Shipment not found. Please check your tracking ID.');
      setSearchedShipment(null);
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-primary';
      case 'In Transit':
        return 'bg-primary';
      case 'Delayed':
        return 'bg-amber-500';
      default:
        return 'bg-bg-secondary';
    }
  };

  const statusSteps = useMemo(() => {
    const progress = searchedShipment?.progress || 0;
    return [
      { name: 'Order Placed', completed: progress >= 10 },
      { name: 'Processing', completed: progress >= 30 },
      { name: 'In Transit', completed: progress >= 50 },
      { name: 'Out for Delivery', completed: progress >= 80 },
      { name: 'Delivered', completed: progress >= 100 },
    ];
  }, [searchedShipment]);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-display font-semibold text-text-primary mb-2">
          Shipment Tracking
        </h1>
        <p className="text-text-secondary">
          Track your shipments in real-time
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-soft">
        <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
          <SearchInput
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            placeholder="Enter tracking ID or transaction ID"
            className="flex-1"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white px-8 py-4 rounded-xl font-medium hover:bg-primary-hover transition-all shadow-soft hover:shadow-medium whitespace-nowrap disabled:opacity-70"
          >
            {loading ? 'Searching...' : 'Track Shipment'}
          </button>
        </form>
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>

      {searchedShipment && (
        <div className="bg-white rounded-2xl p-6 shadow-soft">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-8 border-b border-border">
            <div>
              <h2 className="text-xl font-display font-semibold text-text-primary mb-1">
                {searchedShipment.id}
              </h2>
              <p className="text-text-secondary">
                {searchedShipment.origin} → {searchedShipment.destination}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-text-secondary">Estimated Delivery</p>
              <p className="text-lg font-display font-semibold text-primary">{searchedShipment.eta}</p>
            </div>
          </div>

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

          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-bg-secondary"></div>
            <div className="space-y-6">
              {statusSteps.map((step) => (
                <div key={step.name} className="relative flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${step.completed ? 'bg-primary' : 'bg-bg-secondary'}`}>
                    {step.completed ? (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-border"></div>
                    )}
                  </div>
                  <p className={`text-sm font-medium ${step.completed ? 'text-text-primary' : 'text-text-secondary'}`}>
                    {step.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 shadow-soft">
        <h3 className="font-display font-semibold text-lg text-text-primary mb-6">
          Recent Shipments
        </h3>
        {recentShipments.length === 0 ? (
          <p className="text-text-secondary">No recent tracking lookups yet.</p>
        ) : (
          <div className="space-y-3">
            {recentShipments.map((shipment) => (
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
                  <p className="text-sm text-text-secondary">{shipment.origin} → {shipment.destination}</p>
                </div>
                <div className="hidden sm:block w-32 h-2 bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${shipment.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tracking;
