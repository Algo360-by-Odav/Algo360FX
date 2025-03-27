import { Grid, Paper, Skeleton } from '@mui/material';

export const StatsSkeleton: React.FC = () => {
  return (
    <Grid container spacing={2}>
      {[...Array(4)].map((_, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Paper sx={{ p: 2 }}>
            <Skeleton variant="text" width={100} height={24} sx={{ mb: 1 }} />
            <Skeleton variant="text" width={140} height={32} />
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};
