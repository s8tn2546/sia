import { useEffect, useMemo, useState } from 'react';
import { MetricCard, AlertCard, ShipmentCard, InsightCard } from '../components/Cards';
import { DemandSupplyChart, ProgressRing } from '../components/Charts';
import { api } from '../services/api';

const parseInsights = (recommendations) => {
  if (!recommendations || typeof recommendations !== 'string') {
    return [];
  }

  const lines = recommendations
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 4);

  return lines.map((line, index) => ({
    title: `Insight ${index + 1}`,
    description: line.replace(/^[-*\d.)\s]+/, ''),
    impact: index === 0 ? 'high' : index === 1 ? 'medium' : 'low',
  }));
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [inventory, setInventory] = useState([]);
  const [forecast, setForecast] = useState([]);
  const [insights, setInsights] = useState([]);
  const [recentShipments] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError('');
      try {
        const [inventoryRes, demandRes] = await Promise.all([
          api.getInventory(),
          api.getDemand(),
        ]);

        const inventoryData = inventoryRes?.data || [];
        const forecastData = demandRes?.data?.forecast || [];
        const totalInventory = Array.isArray(inventoryData)
          ? inventoryData.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
          : 0;
        const lowStockCount = Array.isArray(inventoryData)
          ? inventoryData.filter((item) => Number(item.quantity || 0) <= Number(item.reorderLevel || 0)).length
          : 0;
        const demandAverage = Array.isArray(forecastData) && forecastData.length
          ? forecastData.reduce((sum, row) => sum + Number(row.yhat || 0), 0) / forecastData.length
          : 0;
        const normalizedItems = Array.isArray(inventoryData)
          ? inventoryData.map((item) => ({
              productName: item.productName,
              sku: item.sku,
              warehouse: item.warehouse,
              quantity: Number(item.quantity || 0),
              reorderLevel: Number(item.reorderLevel || 0),
            }))
          : [];
        const criticalItems = normalizedItems.filter(
          (item) => item.quantity <= Math.max(5, Math.floor(item.reorderLevel * 0.5))
        );
        const lowStockItems = normalizedItems.filter(
          (item) => item.quantity <= item.reorderLevel && !criticalItems.includes(item)
        );

        const insightsRes = await api.getInsights({
          source: 'dashboard',
          inventory: {
            total: normalizedItems.length,
            inStock: normalizedItems.filter((item) => item.quantity > item.reorderLevel).length,
            lowStock: lowStockItems.length,
            critical: criticalItems.length,
            items: normalizedItems.slice(0, 5),
          },
          demand_trend: demandAverage > 0 ? 'steady' : 'unknown',
          delay_risk: lowStockCount > 0 ? 'high' : 'low',
        });

        const parsedInsights = parseInsights(insightsRes?.data?.recommendations);

        setInventory(Array.isArray(inventoryData) ? inventoryData : []);
        setForecast(Array.isArray(forecastData) ? forecastData : []);
        setInsights(parsedInsights);
      } catch (err) {
        setError('Unable to load dashboard data right now. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const metrics = useMemo(() => {
    const totalInventory = inventory.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    const lowStockItems = inventory.filter(
      (item) => Number(item.quantity || 0) <= Number(item.reorderLevel || 0)
    );
    const avgForecast = forecast.length
      ? forecast.reduce((sum, row) => sum + Number(row.yhat || 0), 0) / forecast.length
      : 0;

    return {
      totalShipments: recentShipments.length,
      activeInventory: totalInventory,
      demandAccuracy: avgForecast ? 90.0 : 0,
      costSavings: Math.max(0, Math.round(totalInventory * 2.5)),
      onTimeDelivery: recentShipments.length ? 96.0 : 0,
      avgTransitTime: recentShipments.length ? 3.2 : 0,
      lowStockCount: lowStockItems.length,
    };
  }, [inventory, forecast, recentShipments]);

  const demandSupplyData = useMemo(() => {
    const safeDivisor = Math.max(forecast.length, 1);
    const averageSupply = inventory.reduce((sum, item) => sum + Number(item.quantity || 0), 0) / safeDivisor;

    return forecast.map((row) => ({
      month: new Date(row.ds).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      demand: Number(row.yhat || 0),
      supply: Math.max(0, Math.round(averageSupply)),
    }));
  }, [forecast, inventory]);

  const alerts = useMemo(() => {
    const lowStockItems = inventory.filter(
      (item) => Number(item.quantity || 0) <= Number(item.reorderLevel || 0)
    );

    const dynamicAlerts = lowStockItems.slice(0, 3).map((item) => ({
      id: item._id,
      type: 'warning',
      title: 'Low Stock Alert',
      message: `${item.productName} (${item.sku}) is below reorder level`,
      time: 'Now',
    }));

    if (dynamicAlerts.length === 0) {
      return [
        {
          id: 'healthy-stock',
          type: 'success',
          title: 'Inventory Healthy',
          message: 'No low-stock items detected right now.',
          time: 'Now',
        },
      ];
    }

    return dynamicAlerts;
  }, [inventory]);

  if (loading) {
    return (
      <div className="p-4 lg:p-6">
        <div className="bg-white rounded-2xl p-6 shadow-soft">
          <p className="text-text-secondary">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-display font-semibold text-text-primary mb-2">
          Dashboard
        </h1>
        <p className="text-text-secondary">
          Overview of your supply chain performance
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <MetricCard
          title="Total Shipments"
          value={metrics.totalShipments.toLocaleString()}
          icon={
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
          }
        />
        <MetricCard
          title="Active Inventory"
          value={metrics.activeInventory.toLocaleString()}
          icon={
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
        />
        <MetricCard
          title="Demand Accuracy"
          value={`${metrics.demandAccuracy.toFixed(1)}%`}
          icon={
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
        <MetricCard
          title="Low Stock Items"
          value={metrics.lowStockCount.toLocaleString()}
          icon={
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DemandSupplyChart data={demandSupplyData} />
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-soft">
          <h3 className="font-display font-semibold text-lg text-text-primary mb-6">
            On-Time Delivery
          </h3>
          <div className="flex flex-col items-center justify-center py-8">
            <ProgressRing
              progress={metrics.onTimeDelivery}
              size={180}
              strokeWidth={14}
              color="#34A853"
            />
            <p className="text-center text-text-secondary mt-6">
              Average transit time: <span className="font-medium text-text-primary">{metrics.avgTransitTime} days</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-semibold text-lg text-text-primary">
              Recent Alerts
            </h3>
          </div>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </div>

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
          </div>
          <div className="space-y-3">
            {(insights.length ? insights : [{ title: 'No Insights Yet', description: 'Insights will appear once your service data is processed.', impact: 'low' }]).map((insight, index) => (
              <InsightCard key={index} insight={insight} />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-soft">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-semibold text-lg text-text-primary">
            Recent Shipments
          </h3>
        </div>
        {recentShipments.length === 0 ? (
          <p className="text-text-secondary">No recent shipments are available yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentShipments.map((shipment) => (
              <ShipmentCard key={shipment.id} shipment={shipment} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
