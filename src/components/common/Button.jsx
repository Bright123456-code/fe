export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed tracking-wide';

  const variants = {
    primary: 'bg-swu-black text-swu-gold hover:bg-neutral-800 focus:ring-2 focus:ring-swu-gold focus:ring-offset-1',
    gold: 'bg-swu-gold text-swu-black hover:bg-swu-gold-dark focus:ring-2 focus:ring-swu-gold focus:ring-offset-1 font-semibold',
    secondary: 'bg-swu-gray text-swu-black hover:bg-swu-gray-mid focus:ring-2 focus:ring-swu-gray-mid border border-swu-gray-mid',
    success: 'bg-emerald-500 text-white hover:bg-emerald-600 focus:ring-2 focus:ring-emerald-400',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-2 focus:ring-red-400',
    ghost: 'bg-transparent text-swu-muted hover:bg-swu-gray hover:text-swu-black focus:ring-2 focus:ring-swu-gray-mid',
    outline: 'bg-transparent border border-swu-black text-swu-black hover:bg-swu-black hover:text-swu-gold focus:ring-2 focus:ring-swu-black',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
};
