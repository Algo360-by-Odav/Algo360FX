import { Box, Skeleton } from '@mui/material';

interface ChartSkeletonProps {
  height?: number | string;
}

export const ChartSkeleton: React.FC<ChartSkeletonProps> = ({ height = 400 }) => {
  return (
    <Box sx={{ width: '100%', height }}>
      {/* Chart header skeleton */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Skeleton variant="text" width={200} height={32} />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Skeleton variant="rectangular" width={40} height={40} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width={40} height={40} sx={{ borderRadius: 1 }} />
        </Box>
      </Box>

      {/* Chart area skeleton with animated gradient */}
      <Skeleton 
        variant="rectangular" 
        width="100%" 
        height="calc(100% - 56px)"
        sx={{ 
          borderRadius: 1,
          animation: 'pulse 1.5s ease-in-out 0.5s infinite',
          '@keyframes pulse': {
            '0%': {
              opacity: 1,
            },
            '50%': {
              opacity: 0.5,
            },
            '100%': {
              opacity: 1,
            },
          },
        }} 
      />
    </Box>
  );
};
