import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

export default function StatCard({
  title,
  value,
  icon: Icon,
  change,
  changeLabel = 'from last month',
  className = ''
}) {
  const isPositive = change >= 0;

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
        </div>
        {Icon && (
          <div className="p-3 bg-primary-100 rounded-full">
            <Icon className="h-6 w-6 text-primary-600" />
          </div>
        )}
      </div>
      {change !== undefined && (
        <div className="mt-4 flex items-center">
          {isPositive ? (
            <ArrowUpIcon className="h-4 w-4 text-green-500" />
          ) : (
            <ArrowDownIcon className="h-4 w-4 text-red-500" />
          )}
          <span
            className={`ml-1 text-sm font-medium ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {Math.abs(change)}%
          </span>
          <span className="ml-2 text-sm text-gray-500">{changeLabel}</span>
        </div>
      )}
    </div>
  );
}
