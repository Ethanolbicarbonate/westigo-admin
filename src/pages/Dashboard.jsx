import { useState } from 'react';
import { Typography, Button, Box, Paper, CircularProgress } from '@mui/material';
import { facilityService } from '../services/facilityService';
import { showSuccess, showError } from '../utils/toast';

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const handleTestConnection = async () => {
    setLoading(true);
    try {
      // Use the service layer, not raw Supabase
      const facilities = await facilityService.getAll();
      
      console.log('Supabase Data:', facilities);
      setData(facilities);
      showSuccess(`Successfully fetched ${facilities.length} facilities!`);
    } catch (error) {
      console.error(error);
      showError('Failed to fetch data. Check console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          System Status Check
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
          <Button 
            variant="contained" 
            onClick={handleTestConnection}
            disabled={loading}
          >
            {loading ? 'Connecting...' : 'Test Supabase Connection'}
          </Button>
          
          {loading && <CircularProgress size={24} />}
        </Box>

        {data && (
          <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
            <Typography variant="body2" fontFamily="monospace">
              {JSON.stringify(data, null, 2)}
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}