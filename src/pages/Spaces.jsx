import { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, TextField, InputAdornment, Paper,
  IconButton, Tooltip, Avatar, Chip
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';

import { spaceService } from '../services/spaceService';
import { showError, showSuccess } from '../utils/toast';
import SpaceFormDialog from '../components/spaces/SpaceFormDialog';

export default function Spaces() {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingSpace, setEditingSpace] = useState(null);

  const loadSpaces = async () => {
    setLoading(true);
    try {
      const data = await spaceService.getAll();
      setSpaces(data);
    } catch (error) {
      console.error('Error loading spaces:', error);
      showError('Failed to load spaces');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSpaces();
  }, []);

  const handleAddClick = () => {
    setEditingSpace(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (space) => {
    setEditingSpace(space);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this space?')) {
      try {
        await spaceService.delete(id);
        showSuccess('Space deleted successfully');
        loadSpaces();
      } catch (error) {
        console.error('Delete error:', error);
        showError('Failed to delete space');
      }
    }
  };

  const handleSaveSpace = async (formData) => {
    setSaving(true);
    try {
      let photoUrl = formData.currentPhotoUrl;

      // 1. Upload new image if exists
      if (formData.imageFile) {
        photoUrl = await spaceService.uploadImage(formData.imageFile);
      }

      // 2. Prepare Data
      const spaceData = {
        name: formData.name,
        description: formData.description,
        floor_level: formData.floor_level,
        parent_facility_id: formData.parent_facility_id, // Vital link
        photo_url: photoUrl
      };

      if (editingSpace) {
        // UPDATE
        await spaceService.update(editingSpace.id, spaceData);
        showSuccess('Space updated successfully!');
      } else {
        // CREATE
        await spaceService.create(spaceData);
        showSuccess('Space created successfully!');
      }

      setIsDialogOpen(false);
      loadSpaces();
      
    } catch (error) {
      console.error('Save error:', error);
      showError(error.message || 'Failed to save space');
    } finally {
      setSaving(false);
    }
  };

  // Filter Logic
  const filteredSpaces = spaces.filter((space) =>
    space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (space.facilities?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { 
      field: 'photo_url', headerName: '', width: 60,
      renderCell: (params) => (
        <Avatar 
          variant="rounded" 
          src={params.value} 
          alt={params.row.name}
          sx={{ width: 40, height: 40, bgcolor: 'secondary.light' }}
        >
          <MeetingRoomIcon />
        </Avatar>
      )
    },
    { field: 'name', headerName: 'Space Name', flex: 1, minWidth: 150 },
    { 
      field: 'parent_facility', 
      headerName: 'Parent Facility', 
      flex: 1, 
      minWidth: 180,
      valueGetter: (params, row) => row.facilities?.name || 'Unknown',
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          color="primary" 
          variant="outlined" 
        />
      )
    },
    { field: 'floor_level', headerName: 'Floor', width: 100 },
    { 
      field: 'description', headerName: 'Description', flex: 2, minWidth: 200,
      renderCell: (params) => (
        <Typography variant="body2" noWrap title={params.value}>
          {params.value || '-'}
        </Typography>
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
        <Typography variant="h5" fontWeight="bold">Spaces Management</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleAddClick}
        >
          Add Space
        </Button>
      </Box>

      <Paper sx={{ p: 2, height: 600, width: '100%' }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            size="small"
            placeholder="Search spaces or facilities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>) }}
            sx={{ flexGrow: 1, maxWidth: 400 }}
          />
          <Tooltip title="Refresh List">
            <IconButton onClick={loadSpaces}><RefreshIcon /></IconButton>
          </Tooltip>
        </Box>

        <DataGrid
          rows={filteredSpaces}
          columns={columns}
          loading={loading}
          initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection
          disableRowSelectionOnClick
          sx={{ border: 0 }}
        />
      </Paper>
      
      <SpaceFormDialog 
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSaveSpace}
        loading={saving}
        initialData={editingSpace}
      />
    </Box>
  );
}