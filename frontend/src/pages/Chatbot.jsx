import { useEffect, useRef, useState } from 'react';
import { api } from '../services/api';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hi! I\'m your SIA Supply Chain AI Assistant. I can help you with demand forecasting, route optimization, inventory planning, and more. What would you like to know?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.getChat({
        message: input,
        context: 'supply_chain_management',
      });

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: response?.data?.answer || 'I\'m having trouble understanding your request. Could you rephrase that?',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: 'Sorry, I encountered an issue processing your request. Please try again.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const suggestedQuestions = [
    'What\'s my current inventory level?',
    'How can I optimize my delivery routes?',
    'What\'s the demand forecast for next month?',
    'How do I reduce shipping costs?',
  ];

  const handleSuggestedQuestion = (question) => {
    setInput(question);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 h-full flex flex-col">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-display font-semibold text-text-primary mb-2">
          AI Assistant
        </h1>
        <p className="text-text-secondary">
          Get intelligent supply chain insights powered by machine learning
        </p>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-white rounded-2xl shadow-soft flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="font-display font-semibold text-text-primary mb-2">Start a Conversation</h3>
                <p className="text-text-secondary mb-6 max-w-sm">
                  Ask me anything about your supply chain. I can help with predictions, optimizations, and insights.
                </p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-primary text-white rounded-br-none'
                        : 'bg-bg-secondary text-text-primary rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.type === 'user'
                          ? 'text-white/70'
                          : 'text-text-secondary'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-bg-secondary text-text-primary px-4 py-3 rounded-lg rounded-bl-none">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Suggested Questions */}
        {messages.length === 1 && !loading && (
          <div className="px-6 py-4 border-t border-border bg-bg-secondary">
            <p className="text-xs font-medium text-text-secondary mb-3">Suggested questions:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="text-left text-sm p-3 bg-white rounded-lg hover:bg-soft-green transition-colors text-text-secondary hover:text-text-primary"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSend} className="border-t border-border p-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              placeholder="Ask me anything..."
              className="flex-1 px-4 py-3 bg-bg-secondary border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all disabled:opacity-50 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
