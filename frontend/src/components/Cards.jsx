// Metric Card Component
export const MetricCard = ({ title, value, change, changeType, icon }) => {
  const isPositive = changeType === 'positive';

  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-text-secondary mb-1">{title}</p>
          <h3 className="text-3xl font-display font-semibold text-text-primary">{value}</h3>
          {change && (
            <div className="flex items-center gap-1 mt-2">
              <span className={`text-sm font-medium ${isPositive ? 'text-primary' : 'text-red-500'}`}>
                {isPositive ? '+' : '-'}{change}%
              </span>
              <span className="text-xs text-text-secondary">vs last month</span>
            </div>
          )}
        </div>
        <div className="w-12 h-12 bg-soft-green rounded-xl flex items-center justify-center">
          {icon}
        </div>
      </div>
    </div>
  );
};

// Info Card Component
export const InfoCard = ({ title, description, icon, bgColor = 'bg-soft-green' }) => {
  return (
    <div className={`${bgColor} rounded-2xl p-6 transition-all duration-200 hover:shadow-medium`}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-soft">
          {icon}
        </div>
        <div>
          <h3 className="font-display font-semibold text-text-primary mb-1">{title}</h3>
          <p className="text-sm text-text-secondary">{description}</p>
        </div>
      </div>
    </div>
  );
};

// Alert Card Component
export const AlertCard = ({ alert }) => {
  const typeStyles = {
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      icon: (
        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: (
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    success: {
      bg: 'bg-soft-green',
      border: 'border-primary/20',
      icon: (
        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  };

  const style = typeStyles[alert.type];

  return (
    <div className={`${style.bg} border ${style.border} rounded-xl p-4 transition-all duration-200 hover:shadow-soft`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">{style.icon}</div>
        <div className="flex-1">
          <h4 className="font-medium text-text-primary text-sm">{alert.title}</h4>
          <p className="text-sm text-text-secondary mt-1">{alert.message}</p>
          <p className="text-xs text-text-secondary mt-2">{alert.time}</p>
        </div>
      </div>
    </div>
  );
};

// Shipment Card Component
export const ShipmentCard = ({ shipment }) => {
  const statusColors = {
    'In Transit': 'bg-primary/10 text-primary',
    'Delivered': 'bg-soft-green text-dark-green',
    'Pending': 'bg-amber-100 text-amber-800',
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-soft hover:shadow-medium transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <span className="font-medium text-text-primary">{shipment.id}</span>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[shipment.status]}`}>
          {shipment.status}
        </span>
      </div>
      <div className="flex items-center gap-2 text-sm text-text-secondary mb-3">
        <span>{shipment.origin}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
        <span>{shipment.destination}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-secondary">ETA: {shipment.eta}</span>
        <div className="flex-1 mx-4">
          <div className="h-2 bg-bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${shipment.progress}%` }}
            />
          </div>
        </div>
        <span className="text-xs font-medium text-primary">{shipment.progress}%</span>
      </div>
    </div>
  );
};

// Insight Card Component
export const InsightCard = ({ insight }) => {
  const impactColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-amber-100 text-amber-800',
    low: 'bg-blue-100 text-blue-800',
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-soft hover:shadow-medium transition-all duration-200">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-text-primary">{insight.title}</h4>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${impactColors[insight.impact]}`}>
          {insight.impact} impact
        </span>
      </div>
      <p className="text-sm text-text-secondary">{insight.description}</p>
    </div>
  );
};

// Stat Card Component (Simple)
export const StatCard = ({ label, value, subtext }) => {
  return (
    <div className="text-center p-6">
      <p className="text-3xl font-display font-semibold text-text-primary mb-1">{value}</p>
      <p className="text-sm text-text-secondary">{label}</p>
      {subtext && <p className="text-xs text-text-secondary mt-1">{subtext}</p>}
    </div>
  );
};
