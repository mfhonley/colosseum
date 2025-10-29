// Modern UI Components Library

import { Icon } from './Icons';

// Button Component
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon: IconComponent,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    success: 'bg-cyan-600 text-white hover:bg-cyan-700 focus:ring-cyan-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading && <Icon.Spinner className="w-4 h-4 mr-2" />}
      {!loading && IconComponent && <IconComponent className="w-5 h-5 mr-2" />}
      {children}
    </button>
  );
};

// Card Component
export const Card = ({ children, className = '', hover = false }) => {
  return (
    <div className={`
      bg-white rounded-xl border border-gray-200 overflow-hidden
      ${hover ? 'hover:shadow-lg transition-shadow duration-200' : 'shadow-sm'}
      ${className}
    `}>
      {children}
    </div>
  );
};

// Stat Card Component
export const StatCard = ({
  label,
  value,
  subValue,
  icon: IconComponent,
  color = 'blue',
  trend
}) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    cyan: 'bg-cyan-50 text-cyan-600 border-cyan-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    gray: 'bg-gray-50 text-gray-600 border-gray-200',
  };

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-600">{label}</span>
          {IconComponent && (
            <div className={`p-2 rounded-lg ${colors[color]}`}>
              <IconComponent className="w-5 h-5" />
            </div>
          )}
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
        {subValue && <div className="text-sm text-gray-500">{subValue}</div>}
        {trend && (
          <div className={`text-xs font-medium mt-2 ${trend > 0 ? 'text-cyan-600' : 'text-red-600'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </div>
        )}
      </div>
    </Card>
  );
};

// Badge Component
export const Badge = ({ children, variant = 'default', size = 'md' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-cyan-100 text-cyan-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
};

// Tab Component
export const Tabs = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200
              flex items-center space-x-2
              ${activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            {tab.icon && <tab.icon className="w-5 h-5" />}
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

// Table Component
export const Table = ({ columns, data, onRowClick }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, idx) => (
              <th
                key={idx}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {data.map((row, rowIdx) => (
            <tr
              key={rowIdx}
              onClick={() => onRowClick && onRowClick(row)}
              className={`${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''} transition-colors`}
            >
              {columns.map((column, colIdx) => (
                <td key={colIdx} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Empty State Component
export const EmptyState = ({ icon: IconComponent, title, description, action }) => {
  return (
    <div className="text-center py-12">
      {IconComponent && (
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <IconComponent className="w-8 h-8 text-gray-400" />
        </div>
      )}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">{description}</p>
      {action && action}
    </div>
  );
};

// Loading Spinner
export const LoadingSpinner = ({ size = 'md', text }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const spinnerSize = size === 'sm' ? 32 : size === 'md' ? 48 : 64;
  const strokeWidth = size === 'sm' ? 3 : 4;
  const radius = (spinnerSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="inline-flex flex-col items-center justify-center gap-4">
      <div className={`${sizeClasses[size]} relative`} style={{ minWidth: spinnerSize, minHeight: spinnerSize }}>
        <svg
          className="absolute top-0 left-0"
          width={spinnerSize}
          height={spinnerSize}
          viewBox={`0 0 ${spinnerSize} ${spinnerSize}`}
        >
          {/* Background circle */}
          <circle
            cx={spinnerSize / 2}
            cy={spinnerSize / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
          />
          {/* Spinning arc */}
          <circle
            cx={spinnerSize / 2}
            cy={spinnerSize / 2}
            r={radius}
            fill="none"
            stroke="#2563eb"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${circumference * 0.25} ${circumference * 0.75}`}
            style={{
              transformOrigin: 'center',
              animation: 'spinner-rotate 1s linear infinite'
            }}
          />
        </svg>
      </div>
      {text && <p className="text-sm text-gray-600 text-center">{text}</p>}
      <style>{`
        @keyframes spinner-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// Alert Component
export const Alert = ({ variant = 'info', title, children, onClose }) => {
  const variants = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-cyan-50 border-cyan-200 text-cyan-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  };

  const iconMap = {
    info: Icon.Chart,
    success: Icon.Check,
    warning: Icon.Alert,
    error: Icon.Alert,
  };

  const IconComponent = iconMap[variant];

  return (
    <div className={`rounded-lg border p-4 ${variants[variant]}`}>
      <div className="flex items-start">
        <IconComponent className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          {title && <h3 className="font-medium mb-1">{title}</h3>}
          <div className="text-sm">{children}</div>
        </div>
        {onClose && (
          <button onClick={onClose} className="ml-3 flex-shrink-0">
            <span className="sr-only">Close</span>
            ×
          </button>
        )}
      </div>
    </div>
  );
};

// Progress Bar
export const Progress = ({ value, max = 100, color = 'blue', showLabel = false }) => {
  const percentage = Math.min((value / max) * 100, 100);

  const colors = {
    blue: 'bg-blue-600',
    cyan: 'bg-cyan-600',
    red: 'bg-red-600',
    yellow: 'bg-yellow-600',
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        {showLabel && (
          <span className="text-sm text-gray-700">{percentage.toFixed(1)}%</span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full ${colors[color]} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
