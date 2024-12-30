import { Theme } from '@mui/material/styles';

export function pxToRem(value: number): string {
  return `${value / 16}rem`;
}

export function responsiveFontSizes({ sm, md, lg }: { sm: number; md: number; lg: number }) {
  return {
    '@media (min-width:600px)': {
      fontSize: pxToRem(sm),
    },
    '@media (min-width:900px)': {
      fontSize: pxToRem(md),
    },
    '@media (min-width:1200px)': {
      fontSize: pxToRem(lg),
    },
  };
}

export function alpha(color: string, opacity: number) {
  return color + Math.round(opacity * 255).toString(16).padStart(2, '0');
}

export function getContrastText(theme: Theme, background: string) {
  const contrastText =
    theme.palette.getContrastText(background);
  return contrastText;
}

export const gradients = {
  primary: 'linear-gradient(to right, #00AB55, #54D62C)',
  info: 'linear-gradient(to right, #00B8D9, #61F3F3)',
  success: 'linear-gradient(to right, #54D62C, #AAF27F)',
  warning: 'linear-gradient(to right, #FFC107, #FFE16A)',
  error: 'linear-gradient(to right, #FF4842, #FFA48D)',
};

export function createGradient(color1: string, color2: string) {
  return `linear-gradient(to right, ${color1}, ${color2})`;
}

export const textGradients = {
  primary: {
    backgroundImage: gradients.primary,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  info: {
    backgroundImage: gradients.info,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  success: {
    backgroundImage: gradients.success,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  warning: {
    backgroundImage: gradients.warning,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  error: {
    backgroundImage: gradients.error,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
};

export const cssStyles = {
  bgBlur: (props?: { color?: string; blur?: number; opacity?: number }) => {
    const color = props?.color || '#000000';
    const blur = props?.blur || 6;
    const opacity = props?.opacity || 0.8;

    return {
      backdropFilter: `blur(${blur}px)`,
      WebkitBackdropFilter: `blur(${blur}px)`, // Safari
      backgroundColor: alpha(color, opacity),
    };
  },
  bgGradient: (props?: {
    direction?: string;
    startColor?: string;
    endColor?: string;
    imgUrl?: string;
    color?: string;
  }) => {
    const direction = props?.direction || 'to right';
    const startColor = props?.startColor || `${alpha('#000000', 0)}`;
    const endColor = props?.endColor || `${alpha('#000000', 0.75)}`;
    const imgUrl = props?.imgUrl;
    const color = props?.color || '#000000';

    if (imgUrl) {
      return {
        background: `linear-gradient(${direction}, ${startColor}, ${endColor}), url(${imgUrl})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
      };
    }

    return {
      background: `linear-gradient(${direction}, ${startColor}, ${endColor})`,
    };
  },
  bgImage: (props?: { url?: string; direction?: string; color?: string }) => {
    const url = props?.url || '';
    const direction = props?.direction || '0deg';
    const color = props?.color || 'rgba(0,0,0,0.75)';

    return {
      background: `linear-gradient(${direction}, ${color}, ${color}), url(${url})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
    };
  },
};
