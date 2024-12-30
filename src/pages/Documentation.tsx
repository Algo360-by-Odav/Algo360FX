import React from 'react';
import { Box, Typography } from '@mui/material';
import DocumentationViewer from '@components/Documentation/DocumentationViewer';
import { observer } from 'mobx-react-lite';

const Documentation: React.FC = observer(() => {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Documentation
      </Typography>

      <DocumentationViewer />
    </Box>
  );
});

export default Documentation;
