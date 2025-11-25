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
  IconButton
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { facilitySchema } from '../../utils/validators';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import MapPicker from '../common/MapPicker';

export default function FacilityFormDialog({ open, onClose, onSubmit, loading, initialData }) {
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(facilitySchema),
    defaultValues: {
      name: '',
      description: '',
      latitude: '',
      longitude: '',
    }
  });

  const currentLat = watch('latitude');
  const currentLng = watch('longitude');

  // Handle Opening/Closing and Editing State
  useEffect(() => {
    if (open) {
      if (initialData) {
        // EDIT MODE: Populate form
        reset({
          name: initialData.name,
          description: initialData.description || '',
          latitude: initialData.latitude,
          longitude: initialData.longitude,
        });
        setPreviewUrl(initialData.photo_url); // Show existing photo
      } else {
        // CREATE MODE: Reset to empty
        reset({
          name: '',
          description: '',
          latitude: '',
          longitude: '',
        });
        setPreviewUrl(null);
      }
      setImageFile(null); // Clear any previous file selection
    }
  }, [open, initialData, reset]);

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      // Only revoke if it's a local blob (not a remote URL)
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
  };

  const handleFormSubmit = (data) => {
    // Pass everything needed to determine what to do with the image
    onSubmit({ 
      ...data, 
      imageFile, // New file (if any)
      currentPhotoUrl: previewUrl // Current visible image (or null if removed)
    });
  };

  const handleLocationSelect = (lat, lng) => {
    setValue('latitude', Number(lat.toFixed(6)), { shouldValidate: true });
    setValue('longitude', Number(lng.toFixed(6)), { shouldValidate: true });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold' }}>
        {initialData ? 'Edit Facility' : 'Add New Facility'}
      </DialogTitle>
      
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {/* Left Column */}
            <Grid item xs={12} md={5}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Facility Name"
                    {...register('name')}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    disabled={loading}
                  />
                </Grid>

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

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Latitude"
                    type="number"
                    inputProps={{ step: "any" }}
                    {...register('latitude')}
                    error={!!errors.latitude}
                    helperText={errors.latitude?.message}
                    InputLabelProps={{ shrink: true }} 
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Longitude"
                    type="number"
                    inputProps={{ step: "any" }}
                    {...register('longitude')}
                    error={!!errors.longitude}
                    helperText={errors.longitude?.message}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ border: '1px dashed grey', p: 2, borderRadius: 1, textAlign: 'center' }}>
                    {!previewUrl ? (
                      <>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Facility Photo
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
                          style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }} 
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
            </Grid>

            {/* Right Column: Map */}
            <Grid item xs={12} md={7}>
              <Typography variant="subtitle2" gutterBottom>Location on Map</Typography>
              <Box sx={{ border: '1px solid #ccc', borderRadius: 1, overflow: 'hidden' }}>
                <MapPicker 
                  lat={currentLat} 
                  lng={currentLng} 
                  onLocationSelect={handleLocationSelect} 
                />
              </Box>
              {errors.latitude && <Typography variant="caption" color="error">Location is required</Typography>}
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Saving...' : initialData ? 'Update Facility' : 'Save Facility'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}