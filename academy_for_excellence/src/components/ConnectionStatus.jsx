import React from 'react';
import Icon from './AppIcon';

const ConnectionStatus = ({ 
  isConnected, 
  connectionStatus, 
  connectionDetails, 
  retryAttempt = 0, 
  onRetry, 
  className = '' 
}) => {
  const getStatusConfig = () => {
    switch (connectionStatus) {
      case 'connected':
        return {
          icon: 'CheckCircle',
          color: 'text-green-600',
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'Connected to Business Central',
          showRetry: false
        };
      case 'error':
        return {
          icon: 'XCircle',
          color: 'text-red-600',
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: connectionDetails?.message || 'Connection Failed',
          showRetry: true
        };
      case 'offline':
        return {
          icon: 'WifiOff',
          color: 'text-orange-600',
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          text: 'Network Offline',
          showRetry: false
        };
      case 'checking':
      default:
        return {
          icon: 'Clock',
          color: 'text-yellow-600',
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: retryAttempt > 0 ? `Retrying... (${retryAttempt}/3)` : 'Connecting...',
          showRetry: false
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-2 rounded-md text-sm ${config?.bg} ${config?.border} border ${className}`}>
      <Icon 
        name={config?.icon} 
        size={16} 
        className={`${config?.color} ${connectionStatus === 'checking' ? 'animate-spin' : ''}`} 
      />
      <div className="flex flex-col">
        <span className={`${config?.color} font-medium`}>{config?.text}</span>
        {connectionDetails?.details && (
          <span className={`${config?.color} text-xs opacity-75 mt-0.5`}>
            {connectionDetails?.details}
          </span>
        )}
      </div>
      {config?.showRetry && onRetry && (
        <button
          onClick={onRetry}
          className={`ml-2 px-2 py-1 text-xs rounded border ${config?.color} hover:bg-opacity-20 transition-colors`}
          title="Retry connection"
        >
          <Icon name="RefreshCw" size={12} />
        </button>
      )}
    </div>
  );
};

export default ConnectionStatus;