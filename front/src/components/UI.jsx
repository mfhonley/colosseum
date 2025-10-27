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
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
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
    green: 'bg-green-50 text-green-600 border-green-200',
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
          <div className={`text-xs font-medium mt-2 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
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
    success: 'bg-green-100 text-green-800',
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
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`${sizes[size]} border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin`}></div>
      {text && <p className="mt-4 text-gray-600">{text}</p>}
    </div>
  );
};

// Alert Component
export const Alert = ({ variant = 'info', title, children, onClose }) => {
  const variants = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
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
    green: 'bg-green-600',
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
