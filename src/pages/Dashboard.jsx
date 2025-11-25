import { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Paper, Button, Skeleton, 
  List, ListItem, ListItemText, ListItemIcon, Divider, Chip 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Icons
import AddIcon from '@mui/icons-material/Add';
import BusinessIcon from '@mui/icons-material/Business';
import EventIcon from '@mui/icons-material/Event';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Services & Utils
import { facilityService } from '../services/facilityService';
import { spaceService } from '../services/spaceService';
import { eventService } from '../services/eventService';
import { formatDateTime } from '../utils/formatters';
import { showError } from '../utils/toast';

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    facilities: 0,
    spaces: 0,
    events: 0
  });
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Fetch all data in parallel
      const [facilitiesData, spacesData, eventsData] = await Promise.all([
        facilityService.getAll(),
        spaceService.getAll(),
        eventService.getAll()
      ]);

      // Calculate Stats
      setStats({
        facilities: facilitiesData.length,
        spaces: spacesData.length,
        events: eventsData.length
      });

      // Filter & Sort Upcoming Events (Future only, nearest first)
      const now = new Date();
      const futureEvents = eventsData
        .filter(e => new Date(e.start_date) > now)
        .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
        .slice(0, 3); // Take top 3

      setUpcomingEvents(futureEvents);

    } catch (error) {
      console.error('Error loading dashboard:', error);
      showError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Overview of campus assets and upcoming schedules.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Facilities Card */}
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="body2" color="text.secondary" fontWeight="bold">
                TOTAL FACILITIES
              </Typography>
              <Typography variant="h3" fontWeight="bold" sx={{ mt: 1, color: 'primary.main' }}>
                {loading ? <Skeleton width={50} /> : stats.facilities}
              </Typography>
            </Box>
            <Box sx={{ bgcolor: 'primary.lighter', p: 1.5, borderRadius: '50%', color: 'primary.main' }}>
              <BusinessIcon fontSize="large" />
            </Box>
          </Paper>
        </Grid>

        {/* Spaces Card */}
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="body2" color="text.secondary" fontWeight="bold">
                TOTAL SPACES
              </Typography>
              <Typography variant="h3" fontWeight="bold" sx={{ mt: 1, color: 'info.main' }}>
                {loading ? <Skeleton width={50} /> : stats.spaces}
              </Typography>
            </Box>
            <Box sx={{ bgcolor: 'info.lighter', p: 1.5, borderRadius: '50%', color: 'info.main' }}>
              <MeetingRoomIcon fontSize="large" />
            </Box>
          </Paper>
        </Grid>

        {/* Events Card */}
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="body2" color="text.secondary" fontWeight="bold">
                ACTIVE EVENTS
              </Typography>
              <Typography variant="h3" fontWeight="bold" sx={{ mt: 1, color: 'warning.main' }}>
                {loading ? <Skeleton width={50} /> : stats.events}
              </Typography>
            </Box>
            <Box sx={{ bgcolor: 'warning.lighter', p: 1.5, borderRadius: '50%', color: 'warning.main' }}>
              <EventIcon fontSize="large" />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Quick Actions
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button 
                variant="contained" 
                size="large"
                startIcon={<AddIcon />}
                onClick={() => navigate('/events')}
                fullWidth
                sx={{ justifyContent: 'flex-start', py: 1.5 }}
              >
                Create New Event
              </Button>
              <Button 
                variant="outlined" 
                size="large"
                startIcon={<AddIcon />}
                onClick={() => navigate('/facilities')}
                fullWidth
                sx={{ justifyContent: 'flex-start', py: 1.5 }}
              >
                Add New Facility
              </Button>
               <Button 
                variant="outlined" 
                size="large"
                startIcon={<AddIcon />}
                onClick={() => navigate('/spaces')}
                fullWidth
                sx={{ justifyContent: 'flex-start', py: 1.5 }}
              >
                Add New Space
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Upcoming Events List */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6" fontWeight="bold">
                Upcoming Events
              </Typography>
              <Button endIcon={<ArrowForwardIcon />} onClick={() => navigate('/events')}>
                View All
              </Button>
            </Box>
            <Divider sx={{ mb: 1 }} />

            <List>
              {loading ? (
                // Loading Skeleton
                [1, 2, 3].map((i) => (
                  <ListItem key={i}>
                    <ListItemText primary={<Skeleton width="60%" />} secondary={<Skeleton width="40%" />} />
                  </ListItem>
                ))
              ) : upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <ListItem 
                    key={event.id} 
                    disableGutters 
                    sx={{ 
                      py: 1.5, 
                      borderBottom: '1px solid #f0f0f0',
                      '&:last-child': { borderBottom: 'none' }
                    }}
                  >
                    <Box 
                      sx={{ 
                        mr: 2, 
                        bgcolor: 'primary.lighter', 
                        color: 'primary.main',
                        borderRadius: 1,
                        p: 1,
                        minWidth: 50,
                        textAlign: 'center'
                      }}
                    >
                      <Typography variant="caption" fontWeight="bold" display="block" sx={{ lineHeight: 1 }}>
                        {new Date(event.start_date).toLocaleString('default', { month: 'short' }).toUpperCase()}
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1 }}>
                        {new Date(event.start_date).getDate()}
                      </Typography>
                    </Box>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" fontWeight="bold">
                          {event.name}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {formatDateTime(event.start_date)} • {event.spaces?.name || 'TBA'}
                        </Typography>
                      }
                    />
                    <Chip 
                      label={event.scopes && event.scopes[0]} 
                      size="small" 
                      variant="outlined"
                      sx={{ ml: 1, display: { xs: 'none', sm: 'flex' } }}
                    />
                  </ListItem>
                ))
              ) : (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No upcoming events scheduled.
                  </Typography>
                </Box>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}