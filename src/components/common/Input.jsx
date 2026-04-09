export const Input = ({
  label,
  error,
  type = 'text',
  className = '',
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`w-full px-3 py-2 border rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
          error ? 'border-red-500' : 'border-slate-300'
        }`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};
