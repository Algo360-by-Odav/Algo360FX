import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores/StoreProvider';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface RequireSubscriptionProps {
  feature: string;
  requiredTier: 'basic' | 'pro' | 'enterprise';
  children: React.ReactNode;
}

const RequireSubscription: React.FC<RequireSubscriptionProps> = observer(({
  feature,
  requiredTier,
  children,
}) => {
  const { subscriptionService } = useStores();
  const navigate = useNavigate();
  const [showUpgradeDialog, setShowUpgradeDialog] = React.useState(false);

  const hasAccess = React.useMemo(() => {
    const currentSubscription = subscriptionService.getCurrentSubscription();
    if (!currentSubscription) return false;

    const tierLevels = {
      basic: 0,
      pro: 1,
      enterprise: 2,
    };

    const currentTierLevel = tierLevels[currentSubscription.tierId as keyof typeof tierLevels];
    const requiredTierLevel = tierLevels[requiredTier];

    return currentTierLevel >= requiredTierLevel;
  }, [subscriptionService, requiredTier]);

  if (hasAccess) {
    return <>{children}</>;
  }

  const handleUpgradeClick = () => {
    setShowUpgradeDialog(false);
    navigate('/dashboard/subscription');
  };

  return (
    <>
      <Box
        onClick={() => setShowUpgradeDialog(true)}
        sx={{
          cursor: 'pointer',
          opacity: 0.7,
          position: 'relative',
          '&:hover': {
            opacity: 0.9,
          },
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
          }}
        >
          <Button variant="contained" color="primary">
            Upgrade to Access
          </Button>
        </Box>
        {children}
      </Box>

      <Dialog
        open={showUpgradeDialog}
        onClose={() => setShowUpgradeDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Upgrade Required</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            This feature requires a {requiredTier} subscription or higher.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Upgrade your subscription to access {feature} and many other premium features.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUpgradeDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpgradeClick} variant="contained" color="primary">
            View Plans
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default RequireSubscription;
