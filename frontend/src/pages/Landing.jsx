import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src="/sia-logo.png" alt="SIA" className="w-8 h-8 object-contain" />
              <span className="font-display font-semibold text-lg text-text-primary">SIA</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
              >
                Get Started
              </Link>
              <Link
                to="/signup"
                className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-hover transition-all shadow-soft hover:shadow-medium"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-soft-green/50 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-soft-green px-4 py-2 rounded-full mb-8">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-dark-green">AI-Powered Optimization</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-display font-semibold text-text-primary mb-6 leading-tight">
              SIA.<br />
              <span className="text-primary">Smarter Decisions.</span>
            </h1>
            <p className="text-xl text-text-secondary mb-10 max-w-2xl mx-auto">
              Predict demand, optimize routes, and manage inventory with AI-powered insights.
              Reduce costs by up to 30% while improving delivery times.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/signup"
                className="w-full sm:w-auto bg-primary text-white px-8 py-4 rounded-xl font-medium hover:bg-primary-hover transition-all shadow-medium hover:shadow-large hover:-translate-y-0.5"
              >
                Get Started Now
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto bg-white text-primary px-8 py-4 rounded-xl font-medium border-2 border-primary hover:bg-soft-green transition-all"
              >
                Sign In
              </Link>
            </div>
            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-text-secondary">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Free to use</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Instant access</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-semibold text-text-primary mb-4">
              The Supply Chain Challenge
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Traditional supply chain management faces critical issues that cost businesses billions annually
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-medium transition-all">
              <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-display font-semibold text-text-primary mb-3">Delivery Delays</h3>
              <p className="text-text-secondary">
                68% of shipments face unexpected delays, causing customer dissatisfaction and revenue loss
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-medium transition-all">
              <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-display font-semibold text-text-primary mb-3">Inefficient Logistics</h3>
              <p className="text-text-secondary">
                Poor route planning and manual processes increase operational costs by up to 25%
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-medium transition-all">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-display font-semibold text-text-primary mb-3">Lack of Visibility</h3>
              <p className="text-text-secondary">
                Limited real-time tracking leads to reactive decisions instead of proactive management
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-semibold text-text-primary mb-4">
              The Smart Solution
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              AI-powered tools that transform how you manage your supply chain
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-soft-green rounded-2xl p-6">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 shadow-soft">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-display font-semibold text-text-primary mb-2">Demand Prediction</h3>
              <p className="text-sm text-text-secondary">
                ML models forecast demand with 94%+ accuracy
              </p>
            </div>
            <div className="bg-soft-green rounded-2xl p-6">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 shadow-soft">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="font-display font-semibold text-text-primary mb-2">Route Optimization</h3>
              <p className="text-sm text-text-secondary">
                Find the fastest, most cost-effective routes
              </p>
            </div>
            <div className="bg-soft-green rounded-2xl p-6">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 shadow-soft">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-display font-semibold text-text-primary mb-2">Smart Pricing</h3>
              <p className="text-sm text-text-secondary">
                Dynamic pricing based on real-time data
              </p>
            </div>
            <div className="bg-soft-green rounded-2xl p-6">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 shadow-soft">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="font-display font-semibold text-text-primary mb-2">Smart Alerts</h3>
              <p className="text-sm text-text-secondary">
                Proactive notifications for critical events
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-semibold text-text-primary mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              A complete suite of tools to manage your entire supply chain
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-soft">
              <div className="w-14 h-14 bg-soft-green rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-display font-semibold text-text-primary mb-3">Dashboard Analytics</h3>
              <p className="text-text-secondary mb-4">
                Real-time visibility into key metrics with beautiful charts and actionable insights
              </p>
              <ul className="space-y-2">
                {['Real-time metrics', 'Interactive charts', 'Custom reports'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-text-secondary">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-soft">
              <div className="w-14 h-14 bg-soft-green rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-display font-semibold text-text-primary mb-3">Inventory Management</h3>
              <p className="text-text-secondary mb-4">
                Track stock levels, set automatic reorder points, and prevent stockouts
              </p>
              <ul className="space-y-2">
                {['Stock tracking', 'Auto reorder', 'Low stock alerts'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-text-secondary">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-soft">
              <div className="w-14 h-14 bg-soft-green rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-xl font-display font-semibold text-text-primary mb-3">Shipment Tracking</h3>
              <p className="text-text-secondary mb-4">
                Track every shipment in real-time from origin to destination
              </p>
              <ul className="space-y-2">
                {['Real-time tracking', 'ETA predictions', 'Status updates'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-text-secondary">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-soft">
              <div className="w-14 h-14 bg-soft-green rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-display font-semibold text-text-primary mb-3">AI Insights</h3>
              <p className="text-text-secondary mb-4">
                Get intelligent recommendations to optimize your supply chain
              </p>
              <ul className="space-y-2">
                {['Predictive analytics', 'Smart recommendations', 'Trend analysis'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-text-secondary">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Product Preview Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-semibold text-text-primary mb-4">
              Beautiful, Intuitive Interface
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Designed for modern supply chain professionals
            </p>
          </div>
          <div className="bg-gradient-to-br from-bg-secondary to-soft-green/30 rounded-3xl p-8 lg:p-12">
            <div className="bg-white rounded-2xl shadow-large overflow-hidden">
              <div className="h-64 lg:h-96 bg-gradient-to-br from-primary/5 to-accent-green/10 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-20 h-20 text-primary/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <p className="text-text-secondary">Dashboard Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-display font-semibold text-white mb-6">
            Ready to Transform Your Supply Chain?
          </h2>
          <p className="text-lg text-white/90 mb-10 max-w-2xl mx-auto">
            Join thousands of companies using SIA to optimize their supply chain operations
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto bg-white text-primary px-8 py-4 rounded-xl font-medium hover:bg-bg-secondary transition-all shadow-large hover:-translate-y-0.5"
            >
              Get Started Today
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto bg-primary text-white px-8 py-4 rounded-xl font-medium border-2 border-white/30 hover:bg-primary-hover transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-bg-secondary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src="/sia-logo.png" alt="SIA" className="w-8 h-8 object-contain" />
              <span className="font-display font-semibold text-text-primary">SIA</span>
            </div>
            <p className="text-sm text-text-secondary">
              © 2026 SIA. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
