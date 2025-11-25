import { useEffect, useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Grid, 
  Box, 
  Typography, 
  MenuItem, 
  IconButton,
  CircularProgress
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form'; // Controller is needed for MUI Select
import { zodResolver } from '@hookform/resolvers/zod';
import { spaceSchema } from '../../utils/validators';
import { facilityService } from '../../services/facilityService';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { showError } from '../../utils/toast';

export default function SpaceFormDialog({ open, onClose, onSubmit, loading, initialData }) {
  const [facilities, setFacilities] = useState([]);
  const [loadingFacilities, setLoadingFacilities] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const {
    register,
    handleSubmit,
    control, // Needed for Select/Dropdown
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(spaceSchema),
    defaultValues: {
      name: '',
      description: '',
      parent_facility_id: '',
      floor_level: '',
    }
  });

  // 1. Fetch Facilities for Dropdown
  useEffect(() => {
    if (open) {
      const fetchFacilities = async () => {
        setLoadingFacilities(true);
        try {
          const data = await facilityService.getAll();
          setFacilities(data);
        } catch (error) {
          console.error(error);
          showError('Failed to load facilities list');
        } finally {
          setLoadingFacilities(false);
        }
      };
      fetchFacilities();
    }
  }, [open]);

  // 2. Handle Edit/Reset State
  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          name: initialData.name,
          description: initialData.description || '',
          parent_facility_id: initialData.parent_facility_id,
          floor_level: initialData.floor_level || '',
        });
        setPreviewUrl(initialData.photo_url);
      } else {
        reset({
          name: '',
          description: '',
          parent_facility_id: '',
          floor_level: '',
        });
        setPreviewUrl(null);
      }
      setImageFile(null);
    }
  }, [open, initialData, reset]);

  // 3. Image Handling
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
  };

  const handleFormSubmit = (data) => {
    onSubmit({ 
      ...data, 
      imageFile,
      currentPhotoUrl: previewUrl 
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold' }}>
        {initialData ? 'Edit Space' : 'Add New Space'}
      </DialogTitle>
      
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            
            {/* Parent Facility Dropdown */}
            <Grid item xs={12}>
              <Controller
                name="parent_facility_id"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="Parent Facility"
                    error={!!errors.parent_facility_id}
                    helperText={errors.parent_facility_id?.message}
                    disabled={loading || loadingFacilities}
                    SelectProps={{ native: false }} // Use MUI Menu items
                  >
                    {loadingFacilities ? (
                      <MenuItem disabled><CircularProgress size={20} /></MenuItem>
                    ) : (
                      facilities.map((facility) => (
                        <MenuItem key={facility.id} value={facility.id}>
                          {facility.name}
                        </MenuItem>
                      ))
                    )}
                  </TextField>
                )}
              />
            </Grid>

            {/* Name */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Space Name (e.g., Room 101, Dean's Office)"
                {...register('name')}
                error={!!errors.name}
                helperText={errors.name?.message}
                disabled={loading}
              />
            </Grid>

            {/* Floor Level */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Floor Level (e.g., 1st Floor)"
                {...register('floor_level')}
                error={!!errors.floor_level}
                helperText={errors.floor_level?.message}
                disabled={loading}
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                {...register('description')}
                error={!!errors.description}
                helperText={errors.description?.message}
                disabled={loading}
              />
            </Grid>

            {/* Image Upload */}
            <Grid item xs={12}>
              <Box sx={{ border: '1px dashed grey', p: 2, borderRadius: 1, textAlign: 'center' }}>
                {!previewUrl ? (
                  <>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Space Photo
                    </Typography>
                    <Button
                      component="label"
                      variant="outlined"
                      size="small"
                      startIcon={<CloudUploadIcon />}
                      disabled={loading}
                    >
                      Select Image
                      <input 
                        type="file" 
                        hidden 
                        accept="image/*" 
                        onChange={handleImageSelect}
                      />
                    </Button>
                  </>
                ) : (
                  <Box sx={{ position: 'relative' }}>
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }} 
                    />
                    <IconButton
                      size="small"
                      color="error"
                      onClick={handleRemoveImage}
                      sx={{ position: 'absolute', top: 5, right: 5, bgcolor: 'rgba(255,255,255,0.8)' }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Grid>

          </Grid>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Saving...' : initialData ? 'Update Space' : 'Save Space'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}