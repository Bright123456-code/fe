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
        <label className="block text-xs font-semibold text-swu-black uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`w-full px-4 py-2.5 bg-swu-gray border rounded-xl text-sm text-swu-black placeholder-swu-muted transition-all duration-150 focus:outline-none focus:bg-white focus:border-swu-black focus:ring-2 focus:ring-swu-gold ${
          error ? 'border-red-400 bg-red-50' : 'border-swu-gray-mid'
        }`}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
};
