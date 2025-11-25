import { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Grid, Tab, Tabs, 
  List, ListItem, ListItemText, ListItemIcon, 
  Collapse, IconButton, Chip, Divider, Button, Skeleton 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Icons
import BusinessIcon from '@mui/icons-material/Business';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import EventIcon from '@mui/icons-material/Event';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import LaunchIcon from '@mui/icons-material/Launch';

// Services & Utils
import { facilityService } from '../services/facilityService';
import { spaceService } from '../services/spaceService';
import { eventService } from '../services/eventService';
import { formatDateTime } from '../utils/formatters';
import { showError } from '../utils/toast';

export default function Lists() {
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Data
  const [hierarchy, setHierarchy] = useState([]); // Facilities with nested spaces
  const [events, setEvents] = useState([]);
  
  // Collapse state for facilities
  const [openFacilities, setOpenFacilities] = useState({});

  useEffect(() => {
    loadMasterData();
  }, []);

  const loadMasterData = async () => {
    setLoading(true);
    try {
      // 1. Fetch all raw data in parallel
      const [facilitiesData, spacesData, eventsData] = await Promise.all([
        facilityService.getAll(),
        spaceService.getAll(),
        eventService.getAll()
      ]);

      // 2. Nest Spaces inside Facilities
      const nestedData = facilitiesData.map(facility => {
        return {
          ...facility,
          spaces: spacesData.filter(space => space.parent_facility_id === facility.id)
        };
      });

      setHierarchy(nestedData);
      setEvents(eventsData);
      
      // Open all facilities by default
      const initialOpenState = {};
      facilitiesData.forEach(f => { initialOpenState[f.id] = true; });
      setOpenFacilities(initialOpenState);

    } catch (error) {
      console.error('Error loading master lists:', error);
      showError('Failed to load master data');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (id) => {
    setOpenFacilities(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  // --- RENDER HELPERS ---

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom><Skeleton width={200} /></Typography>
        <Paper sx={{ p: 2 }}>
          <Skeleton variant="rectangular" height={400} />
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">Master List</Typography>
        <Typography variant="body2" color="text.secondary">
          Unified view of all campus assets and schedules.
        </Typography>
      </Box>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab icon={<BusinessIcon />} iconPosition="start" label="Campus Structure" />
          <Tab icon={<EventIcon />} iconPosition="start" label="Event Schedule" />
        </Tabs>
        
        <Divider />

        {/* TAB 1: CAMPUS STRUCTURE (Facilities > Spaces) */}
        {tabIndex === 0 && (
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button size="small" startIcon={<LaunchIcon />} onClick={() => navigate('/facilities')}>
                Manage Facilities
              </Button>
            </Box>
            
            <List component="nav">
              {hierarchy.map((facility) => (
                <Box key={facility.id} sx={{ mb: 1, border: '1px solid #eee', borderRadius: 1 }}>
                  {/* Facility Header */}
                  <ListItem button onClick={() => handleToggle(facility.id)} sx={{ bgcolor: 'grey.50' }}>
                    <ListItemIcon>
                      <BusinessIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={
                        <Typography variant="subtitle1" fontWeight="bold">
                          {facility.name}
                        </Typography>
                      } 
                      secondary={`${facility.spaces.length} Spaces • ${facility.description || 'No description'}`}
                    />
                    {openFacilities[facility.id] ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  
                  {/* Nested Spaces */}
                  <Collapse in={openFacilities[facility.id]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {facility.spaces.length > 0 ? (
                        facility.spaces.map((space) => (
                          <ListItem key={space.id} sx={{ pl: 4, borderTop: '1px dashed #eee' }}>
                            <ListItemIcon>
                              <MeetingRoomIcon fontSize="small" color="action" />
                            </ListItemIcon>
                            <ListItemText 
                              primary={space.name} 
                              secondary={space.floor_level ? `${space.floor_level}` : 'Ground Floor'} 
                            />
                            <Chip 
                              label="Edit" 
                              size="small" 
                              variant="outlined" 
                              onClick={() => navigate('/spaces')}
                              icon={<EditIcon />}
                              sx={{ cursor: 'pointer' }}
                            />
                          </ListItem>
                        ))
                      ) : (
                        <ListItem sx={{ pl: 4 }}>
                          <ListItemText 
                            secondary="No spaces recorded for this facility." 
                            sx={{ fontStyle: 'italic' }} 
                          />
                        </ListItem>
                      )}
                    </List>
                  </Collapse>
                </Box>
              ))}
            </List>
          </Box>
        )}

        {/* TAB 2: EVENTS SCHEDULE */}
        {tabIndex === 1 && (
          <Box sx={{ p: 2 }}>
             <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button size="small" startIcon={<LaunchIcon />} onClick={() => navigate('/events')}>
                Manage Events
              </Button>
            </Box>

            <Grid container spacing={2}>
              {events.map((event) => (
                <Grid item xs={12} md={6} lg={4} key={event.id}>
                  <Paper variant="outlined" sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {event.name}
                      </Typography>
                      <Chip 
                        label={event.scopes && event.scopes[0]} 
                        size="small" 
                        color="primary" 
                        variant="soft" 
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                      {event.description || 'No description provided.'}
                    </Typography>
                    
                    <Divider sx={{ my: 1 }} />
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <EventIcon fontSize="small" color="action" />
                      <Typography variant="caption" fontWeight="bold">
                        {formatDateTime(event.start_date)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <MeetingRoomIcon fontSize="small" color="action" />
                      <Typography variant="caption">
                         {event.spaces?.facilities?.name} &gt; {event.spaces?.name || 'TBA'}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Paper>
    </Box>
  );
}