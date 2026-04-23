import { MetricCard, AlertCard, ShipmentCard, InsightCard } from '../components/Cards';
import { DemandSupplyChart, ProgressRing } from '../components/Charts';
import {
  mockMetrics,
  mockDemandSupplyData,
  mockAlerts,
  mockShipments,
  mockInsights,
} from '../data/mockData';

const Dashboard = () => {
  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-display font-semibold text-text-primary mb-2">
          Dashboard
        </h1>
        <p className="text-text-secondary">
          Overview of your supply chain performance
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <MetricCard
          title="Total Shipments"
          value={mockMetrics.totalShipments.toLocaleString()}
          change={12.5}
          changeType="positive"
          icon={
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
          }
        />
        <MetricCard
          title="Active Inventory"
          value={mockMetrics.activeInventory.toLocaleString()}
          change={8.2}
          changeType="positive"
          icon={
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
        />
        <MetricCard
          title="Demand Accuracy"
          value={`${mockMetrics.demandAccuracy}%`}
          change={2.1}
          changeType="positive"
          icon={
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
        <MetricCard
          title="Cost Savings"
          value={`$${(mockMetrics.costSavings / 1000).toFixed(0)}K`}
          change={18.3}
          changeType="positive"
          icon={
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section - Takes 2 columns */}
        <div className="lg:col-span-2">
          <DemandSupplyChart data={mockDemandSupplyData} />
        </div>

        {/* On-Time Delivery Ring */}
        <div className="bg-white rounded-2xl p-6 shadow-soft">
          <h3 className="font-display font-semibold text-lg text-text-primary mb-6">
            On-Time Delivery
          </h3>
          <div className="flex flex-col items-center justify-center py-8">
            <ProgressRing
              progress={mockMetrics.onTimeDelivery}
              size={180}
              strokeWidth={14}
              color="#34A853"
            />
            <p className="text-center text-text-secondary mt-6">
              Average transit time: <span className="font-medium text-text-primary">{mockMetrics.avgTransitTime} days</span>
            </p>
          </div>
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between p-3 bg-soft-green rounded-xl">
              <span className="text-sm text-text-secondary">On-time</span>
              <span className="text-sm font-medium text-dark-green">96.8%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-bg-secondary rounded-xl">
              <span className="text-sm text-text-secondary">Delayed</span>
              <span className="text-sm font-medium text-text-primary">3.2%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts Section */}
        <div className="bg-white rounded-2xl p-6 shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-semibold text-lg text-text-primary">
              Recent Alerts
            </h3>
            <button className="text-sm font-medium text-primary hover:text-primary-hover">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {mockAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </div>

        {/* AI Insights Section */}
        <div className="bg-white rounded-2xl p-6 shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <h3 className="font-display font-semibold text-lg text-text-primary">
                AI Insights
              </h3>
            </div>
            <button className="text-sm font-medium text-primary hover:text-primary-hover">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {mockInsights.map((insight, index) => (
              <InsightCard key={index} insight={insight} />
            ))}
          </div>
        </div>
      </div>

      {/* Recent Shipments */}
      <div className="bg-white rounded-2xl p-6 shadow-soft">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-semibold text-lg text-text-primary">
            Recent Shipments
          </h3>
          <button className="text-sm font-medium text-primary hover:text-primary-hover">
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockShipments.map((shipment) => (
            <ShipmentCard key={shipment.id} shipment={shipment} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
