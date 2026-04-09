export const Card = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`bg-white rounded-2xl shadow-card border border-swu-gray-mid p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
