import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Grid,
  Breadcrumbs,
  Link,
  CircularProgress,
} from '@mui/material';
import {
  Description,
  ChevronRight,
  Article,
} from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';

interface DocSection {
  title: string;
  content: string;
  path: string;
  children?: DocSection[];
}

const DocumentationViewer: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [docContent, setDocContent] = useState<string>('');
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);

  const loadDocContent = async (path: string) => {
    try {
      const response = await fetch(`/docs${path}.md`);
      const content = await response.text();
      setDocContent(content);
      setLoading(false);
    } catch (error) {
      console.error('Error loading documentation:', error);
      setDocContent('# Error\n\nFailed to load documentation content.');
      setLoading(false);
    }
  };

  const docSections: DocSection[] = [
    {
      title: 'Risk Management',
      path: '/risk',
      content: '',
      children: [
        {
          title: 'Overview',
          path: '/risk/overview',
          content: ''
        },
        {
          title: 'Position Sizing',
          path: '/risk/position-sizing',
          content: ''
        },
        {
          title: 'Risk Metrics',
          path: '/risk/metrics',
          content: ''
        }
      ]
    },
    {
      title: 'Trading Strategies',
      path: '/strategies',
      content: '',
      children: [
        {
          title: 'Strategy Development',
          path: '/strategies/development',
          content: ''
        },
        {
          title: 'Backtesting',
          path: '/strategies/backtesting',
          content: ''
        }
      ]
    }
  ];

  const findDocContent = (path: string, sections: DocSection[]): string => {
    for (const section of sections) {
      if (section.path === path) {
        return section.content;
      }
      if (section.children) {
        const content = findDocContent(path, section.children);
        if (content) return content;
      }
    }
    return '';
  };

  const handleDocSelect = (path: string) => {
    setSelectedDoc(path);
    loadDocContent(path);

    // Update breadcrumbs
    const parts = path.split('/').filter(Boolean);
    const breadcrumbTitles = parts.map((part) => {
      const section = docSections.find((s) => s.path === `/${part}`);
      if (section) return section.title;
      
      for (const mainSection of docSections) {
        if (mainSection.children) {
          const subsection = mainSection.children.find((s) => s.path === `/${parts[0]}/${part}`);
          if (subsection) return subsection.title;
        }
      }
      return part;
    });
    setBreadcrumbs(breadcrumbTitles);
  };

  useEffect(() => {
    // Load initial documentation content
    if (!selectedDoc) {
      setSelectedDoc('/risk/overview');
      loadDocContent('/risk/overview');
      setBreadcrumbs(['Risk Management', 'Overview']);
    }
  }, []);

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Breadcrumbs separator={<ChevronRight />} aria-label="breadcrumb">
          {breadcrumbs.map((crumb, index) => (
            <Typography
              key={index}
              color={index === breadcrumbs.length - 1 ? 'text.primary' : 'inherit'}
            >
              {crumb}
            </Typography>
          ))}
        </Breadcrumbs>
      </Paper>

      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Contents
            </Typography>
            <List>
              {docSections.map((section) => (
                <React.Fragment key={section.path}>
                  <ListItem
                    button
                    onClick={() => handleDocSelect(section.path)}
                    selected={selectedDoc === section.path}
                  >
                    <ListItemIcon>
                      <Description />
                    </ListItemIcon>
                    <ListItemText primary={section.title} />
                  </ListItem>
                  {section.children && (
                    <List component="div" disablePadding>
                      {section.children.map((child) => (
                        <ListItem
                          key={child.path}
                          button
                          sx={{ pl: 4 }}
                          onClick={() => handleDocSelect(child.path)}
                          selected={selectedDoc === child.path}
                        >
                          <ListItemIcon>
                            <Article />
                          </ListItemIcon>
                          <ListItemText primary={child.title} />
                        </ListItem>
                      ))}
                    </List>
                  )}
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={9}>
          <Paper sx={{ p: 2 }}>
            {loading ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            ) : (
              <Box className="markdown-body">
                <ReactMarkdown>{docContent}</ReactMarkdown>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DocumentationViewer;
