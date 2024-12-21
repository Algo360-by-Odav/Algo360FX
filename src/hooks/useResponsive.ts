import { useTheme, useMediaQuery, Breakpoint } from '@mui/material';
import { useEffect, useState } from 'react';

type QueryType = 'up' | 'down' | 'between' | 'only';
type Orientation = 'portrait' | 'landscape';

export function useResponsive(
  query: QueryType,
  start: Breakpoint,
  end?: Breakpoint
) {
  const theme = useTheme();

  const mediaUp = useMediaQuery(theme.breakpoints.up(start));
  const mediaDown = useMediaQuery(theme.breakpoints.down(start));
  const mediaBetween = end
    ? useMediaQuery(theme.breakpoints.between(start, end))
    : null;
  const mediaOnly = useMediaQuery(theme.breakpoints.only(start));

  const isPortrait = useMediaQuery('(orientation: portrait)');
  const isLandscape = useMediaQuery('(orientation: landscape)');
  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(min-width:601px) and (max-width:960px)');
  const isDesktop = useMediaQuery('(min-width:961px)');
  const isTouch = useMediaQuery('(hover: none) and (pointer: coarse)');
  const isPrefersReducedMotion = useMediaQuery(
    '(prefers-reduced-motion: reduce)'
  );

  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>(
    'desktop'
  );
  const [orientation, setOrientation] = useState<Orientation>('portrait');

  useEffect(() => {
    if (isMobile) setDeviceType('mobile');
    else if (isTablet) setDeviceType('tablet');
    else setDeviceType('desktop');
  }, [isMobile, isTablet]);

  useEffect(() => {
    setOrientation(isPortrait ? 'portrait' : 'landscape');
  }, [isPortrait]);

  const getAnimationDuration = () => {
    if (isPrefersReducedMotion) return 0;
    switch (deviceType) {
      case 'mobile':
        return 200;
      case 'tablet':
        return 250;
      default:
        return 300;
    }
  };

  const getSpacing = (value: number) => {
    const baseSpacing = theme.spacing(value);
    switch (deviceType) {
      case 'mobile':
        return `calc(${baseSpacing} * 0.8)`;
      case 'tablet':
        return `calc(${baseSpacing} * 0.9)`;
      default:
        return baseSpacing;
    }
  };

  const getFontSize = (size: number) => {
    switch (deviceType) {
      case 'mobile':
        return `${size * 0.85}rem`;
      case 'tablet':
        return `${size * 0.9}rem`;
      default:
        return `${size}rem`;
    }
  };

  if (query === 'up') {
    return {
      value: mediaUp,
      deviceType,
      orientation,
      isTouch,
      isPrefersReducedMotion,
      getAnimationDuration,
      getSpacing,
      getFontSize,
    };
  }

  if (query === 'down') {
    return {
      value: mediaDown,
      deviceType,
      orientation,
      isTouch,
      isPrefersReducedMotion,
      getAnimationDuration,
      getSpacing,
      getFontSize,
    };
  }

  if (query === 'between') {
    return {
      value: mediaBetween,
      deviceType,
      orientation,
      isTouch,
      isPrefersReducedMotion,
      getAnimationDuration,
      getSpacing,
      getFontSize,
    };
  }

  return {
    value: mediaOnly,
    deviceType,
    orientation,
    isTouch,
    isPrefersReducedMotion,
    getAnimationDuration,
    getSpacing,
    getFontSize,
  };
}
