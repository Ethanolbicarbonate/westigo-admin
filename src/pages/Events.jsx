import { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, TextField, InputAdornment, Paper,
  IconButton, Tooltip, Avatar, Chip, Stack
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import EventIcon from '@mui/icons-material/Event';

import { eventService } from '../services/eventService';
import { showError, showSuccess } from '../utils/toast';
import { formatDateTime } from '../utils/formatters';
import EventFormDialog from '../components/events/EventFormDialog';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await eventService.getAll();
      setEvents(data);
    } catch (error) {
      console.error('Error loading events:', error);
      showError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleAddClick = () => {
    setEditingEvent(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (event) => {
    setEditingEvent(event);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventService.delete(id);
        showSuccess('Event deleted successfully');
        loadEvents();
      } catch (error) {
        console.error('Delete error:', error);
        showError('Failed to delete event');
      }
    }
  };

  const handleSaveEvent = async (formData) => {
    setSaving(true);
    try {
      let imageUrl = formData.currentPhotoUrl;

      // 1. Upload new image if provided
      if (formData.imageFile) {
        imageUrl = await eventService.uploadImage(formData.imageFile);
      }

      // 2. Prepare Payload
      // Note: We MUST convert Date objects to ISO strings for Supabase
      const eventData = {
        name: formData.name,
        description: formData.description,
        location_id: formData.location_id,
        start_date: formData.start_date.toISOString(),
        end_date: formData.end_date.toISOString(),
        scopes: formData.scopes, // Array of strings
        image_url: imageUrl
      };

      if (editingEvent) {
        // UPDATE
        await eventService.update(editingEvent.id, eventData);
        showSuccess('Event updated successfully!');
      } else {
        // CREATE
        await eventService.create(eventData);
        showSuccess('Event created successfully!');
      }

      setIsDialogOpen(false);
      loadEvents();
      
    } catch (error) {
      console.error('Save error:', error);
      showError(error.message || 'Failed to save event');
    } finally {
      setSaving(false);
    }
  };

  // Filter Logic
  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (event.spaces?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { 
      field: 'image_url', headerName: '', width: 60,
      renderCell: (params) => (
        <Avatar 
          variant="rounded" 
          src={params.value} 
          alt={params.row.name}
          sx={{ width: 40, height: 40, bgcolor: 'warning.light' }}
        >
          <EventIcon />
        </Avatar>
      )
    },
    { field: 'name', headerName: 'Event Name', flex: 1.5, minWidth: 200 },
    { 
      field: 'location', 
      headerName: 'Location', 
      flex: 1, 
      minWidth: 180,
      valueGetter: (params, row) => {
        if (!row.spaces) return 'TBA';
        const facilityName = row.spaces.facilities?.name;
        const spaceName = row.spaces.name;
        return facilityName ? `${facilityName} > ${spaceName}` : spaceName;
      },
      renderCell: (params) => (
        <Typography variant="body2" noWrap title={params.value}>
          {params.value}
        </Typography>
      )
    },
    { 
      field: 'start_date', 
      headerName: 'Start Date', 
      width: 180,
      valueFormatter: (params) => formatDateTime(params.value),
    },
    { 
      field: 'scopes', 
      headerName: 'Audience', 
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5} sx={{ overflowX: 'auto', py: 1 }}>
          {Array.isArray(params.value) && params.value.map((scope, index) => (
            <Chip 
              key={index} 
              label={scope} 
              size="small" 
              variant="outlined" 
              sx={{ fontSize: '0.7rem' }}
            />
          ))}
        </Stack>
      )
    },
    {
      field: 'actions', headerName: 'Actions', width: 120, sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton color="primary" size="small" onClick={() => handleEditClick(params.row)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton color="error" size="small" onClick={() => handleDeleteClick(params.id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">Campus Events</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleAddClick}
        >
          Add Event
        </Button>
      </Box>

      <Paper sx={{ p: 2, height: 600, width: '100%' }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            size="small"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>) }}
            sx={{ flexGrow: 1, maxWidth: 400 }}
          />
          <Tooltip title="Refresh List">
            <IconButton onClick={loadEvents}><RefreshIcon /></IconButton>
          </Tooltip>
        </Box>

        <DataGrid
          rows={filteredEvents}
          columns={columns}
          loading={loading}
          initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection
          disableRowSelectionOnClick
          sx={{ border: 0 }}
          rowHeight={60}
        />
      </Paper>
      
      <EventFormDialog 
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSaveEvent}
        loading={saving}
        initialData={editingEvent}
      />
    </Box>
  );
}