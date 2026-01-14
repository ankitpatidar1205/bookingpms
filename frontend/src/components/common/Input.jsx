import { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  type = 'text',
  className = '',
  ...props
}, ref) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={`
          block w-full px-3 py-2 border rounded-lg shadow-sm
          placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          transition-colors duration-200
          ${error
            ? 'border-red-300 text-red-900 focus:ring-red-500'
            : 'border-gray-300 text-gray-900'
          }
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
