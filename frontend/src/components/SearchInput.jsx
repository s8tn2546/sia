import React from 'react';

const SearchInput = ({ value, onChange, placeholder, className = '', inputClassName = '' }) => {
  return (
    <div className={`flex items-center bg-white border border-border rounded-lg px-4 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all ${className}`}>
      <svg 
        className="w-5 h-5 text-text-secondary mr-3 flex-shrink-0" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`flex-1 py-3 bg-transparent outline-none border-none focus:ring-0 w-full min-w-0 ${inputClassName}`}
      />
    </div>
  );
};

export default SearchInput;
