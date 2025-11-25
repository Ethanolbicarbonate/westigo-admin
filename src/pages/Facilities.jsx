import { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, TextField, InputAdornment, Paper,
  IconButton, Tooltip, Avatar
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import BusinessIcon from '@mui/icons-material/Business';

import { facilityService } from '../services/facilityService';
import { showError, showSuccess } from '../utils/toast';
import FacilityFormDialog from '../components/facilities/FacilityFormDialog';

export default function Facilities() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal & Edit State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingFacility, setEditingFacility] = useState(null);

  const loadFacilities = async () => {
    setLoading(true);
    try {
      const data = await facilityService.getAll();
      setFacilities(data);
    } catch (error) {
      console.error('Error loading facilities:', error);
      showError('Failed to load facilities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFacilities();
  }, []);

  // Open Modal for Create
  const handleAddClick = () => {
    setEditingFacility(null); // Clear edit state
    setIsDialogOpen(true);
  };

  // Open Modal for Edit
  const handleEditClick = (facility) => {
    setEditingFacility(facility);
    setIsDialogOpen(true);
  };

  // Handle Delete
  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this facility? This will also delete all associated spaces.')) {
      try {
        await facilityService.delete(id);
        showSuccess('Facility deleted successfully');
        loadFacilities();
      } catch (error) {
        console.error('Delete error:', error);
        showError('Failed to delete facility');
      }
    }
  };

  // Handle Save (Create or Update)
  const handleSaveFacility = async (formData) => {
    setSaving(true);
    try {
      let photoUrl = formData.currentPhotoUrl; // Start with existing/null

      // 1. If new file uploaded, upload it
      if (formData.imageFile) {
        photoUrl = await facilityService.uploadImage(formData.imageFile);
      }

      const facilityData = {
        name: formData.name,
        description: formData.description,
        latitude: formData.latitude,
        longitude: formData.longitude,
        photo_url: photoUrl
      };

      if (editingFacility) {
        // UPDATE
        await facilityService.update(editingFacility.id, facilityData);
        showSuccess('Facility updated successfully!');
      } else {
        // CREATE
        await facilityService.create(facilityData);
        showSuccess('Facility created successfully!');
      }

      setIsDialogOpen(false);
      loadFacilities();
      
    } catch (error) {
      console.error('Save error:', error);
      showError(error.message || 'Failed to save facility');
    } finally {
      setSaving(false);
    }
  };

  const filteredFacilities = facilities.filter((facility) =>
    facility.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { 
      field: 'photo_url', headerName: '', width: 60,
      renderCell: (params) => (
        <Avatar 
          variant="rounded" 
          src={params.value} 
          alt={params.row.name}
          sx={{ width: 40, height: 40 }}
        >
          <BusinessIcon />
        </Avatar>
      )
    },
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 150 },
    { 
      field: 'description', headerName: 'Description', flex: 2, minWidth: 250,
      renderCell: (params) => (
        <Typography variant="body2" noWrap title={params.value}>
          {params.value || '-'}
        </Typography>
      )
    },
    { 
      field: 'location', headerName: 'Location', width: 180,
      valueGetter: (params, row) => {
        if (!row.latitude || !row.longitude) return 'N/A';
        return `${Number(row.latitude).toFixed(4)}, ${Number(row.longitude).toFixed(4)}`;
      }
    },
    {
      field: 'actions', headerName: 'Actions', width: 120, sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton 
              color="primary" 
              size="small"
              onClick={() => handleEditClick(params.row)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton 
              color="error" 
              size="small"
              onClick={() => handleDeleteClick(params.id)}
            >
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
        <Typography variant="h5" fontWeight="bold">Facilities</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleAddClick}
        >
          Add Facility
        </Button>
      </Box>

      <Paper sx={{ p: 2, height: 600, width: '100%' }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            size="small"
            placeholder="Search facilities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>) }}
            sx={{ flexGrow: 1, maxWidth: 400 }}
          />
          <Tooltip title="Refresh List">
            <IconButton onClick={loadFacilities}><RefreshIcon /></IconButton>
          </Tooltip>
        </Box>

        <DataGrid
          rows={filteredFacilities}
          columns={columns}
          loading={loading}
          initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection
          disableRowSelectionOnClick
          sx={{ border: 0 }}
        />
      </Paper>

      <FacilityFormDialog 
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSaveFacility}
        loading={saving}
        initialData={editingFacility} // Pass the facility to edit
      />
    </Box>
  );
}