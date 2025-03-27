import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navigation from './components/layout/Navigation';
import * as Pages from './pages';
import { useStores } from './stores/StoreProvider';
import { observer } from 'mobx-react-lite';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { SnackbarProvider } from 'notistack';
import FloatingAssistant from './components/ai/FloatingAssistant';

const App = observer(() => {
  const { themeStore } = useStores();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <SnackbarProvider maxSnack={3}>
        <ThemeProvider theme={themeStore.theme}>
          <CssBaseline />
          <Box sx={{ display: 'flex' }}>
            <Navigation />
            <Box component="main" sx={{ flexGrow: 1, height: '100vh', overflow: 'auto' }}>
              <Routes>
                {/* Dashboard */}
                <Route path="/" element={<Pages.DashboardPage />} />
                <Route path="/dashboard" element={<Pages.DashboardPage />} />

                {/* Trading */}
                <Route path="/trading" element={<Pages.TradingPlatform />} />
                <Route path="/trading/mt5" element={<Pages.MT5Page />} />
                <Route path="/trading/hft" element={<Pages.HFTPage />} />
                <Route path="/trading/advanced" element={<Pages.AdvancedTradingPage />} />

                {/* Portfolio & Analysis */}
                <Route path="/portfolio" element={<Pages.PortfolioPage />} />
                <Route path="/analytics" element={<Pages.AnalysisPage />} />
                <Route path="/strategies" element={<Pages.StrategiesPage />} />
                <Route path="/risk-management" element={<Pages.RiskManagementPage />} />

                {/* Market & News */}
                <Route path="/news" element={<Pages.NewsPage />} />
                <Route path="/nft" element={<Pages.NFTPage />} />
                <Route path="/nft/marketplace" element={<Pages.NFTMarketplace />} />

                {/* Portals */}
                <Route path="/broker" element={<Pages.BrokerPortalPage />} />
                <Route path="/investor" element={<Pages.InvestorPortalPage />} />
                <Route path="/signal-provider" element={<Pages.SignalProviderPage />} />

                {/* Education */}
                <Route path="/academy" element={<Pages.AcademyPage />} />
                <Route path="/ai-agent" element={<Pages.AIAgent />} />

                {/* User */}
                <Route path="/profile" element={<Pages.ProfileSettings />} />
                <Route path="/subscription" element={<Pages.SubscriptionPage />} />

                {/* Auth */}
                <Route path="/auth/signin" element={<Pages.SignInPage />} />
                <Route path="/auth/signup" element={<Pages.SignUpPage />} />
                <Route path="/auth/forgot-password" element={<Pages.ForgotPasswordPage />} />
                <Route path="/auth/reset-password" element={<Pages.ResetPasswordPage />} />
                <Route path="/auth/verify-email" element={<Pages.VerifyEmail />} />
                <Route path="/welcome" element={<Pages.WelcomePage />} />
              </Routes>
            </Box>
            <FloatingAssistant />
          </Box>
        </ThemeProvider>
      </SnackbarProvider>
    </LocalizationProvider>
  );
});

export default App;
