import React from 'react';
import { observer } from '../../utils/mobxMock';

/**
 * Higher-order component that wraps mining components with the mobxMock observer
 * This ensures consistent behavior across all mining components
 */
export const withMiningObserver = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  const WrappedComponent: React.FC<P> = (props) => {
    return <Component {...props} />;
  };

  // Set the display name for better debugging
  const displayName = Component.displayName || Component.name || 'MiningComponent';
  WrappedComponent.displayName = `withMiningObserver(${displayName})`;

  // Apply the observer
  return observer(WrappedComponent);
};

export default withMiningObserver;
