import { useEffect, useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, Grid, Box, Typography, 
  MenuItem, IconButton, CircularProgress,
  FormGroup, FormControlLabel, Checkbox, FormHelperText, FormControl, FormLabel
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';

import { eventSchema } from '../../utils/validators';
import { SCOPES } from '../../utils/constants';
import { spaceService } from '../../services/spaceService';
import { showError } from '../../utils/toast';

export default function EventFormDialog({ open, onClose, onSubmit, loading, initialData }) {
  const [spaces, setSpaces] = useState([]);
  const [loadingSpaces, setLoadingSpaces] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: '',
      description: '',
      location_id: '',
      start_date: null,
      end_date: null,
      scopes: [], // Array for multi-select
    }
  });

  // Watch scopes to handle checkbox logic manually if needed
  const selectedScopes = watch('scopes') || [];

  // 1. Fetch Spaces for Location Dropdown
  useEffect(() => {
    if (open) {
      const fetchSpaces = async () => {
        setLoadingSpaces(true);
        try {
          const data = await spaceService.getAll();
          // Sort nicely by Facility Name, then Space Name
          const sorted = data.sort((a, b) => {
            const facA = a.facilities?.name || '';
            const facB = b.facilities?.name || '';
            return facA.localeCompare(facB) || a.name.localeCompare(b.name);
          });
          setSpaces(sorted);
        } catch (error) {
          console.error(error);
          showError('Failed to load locations');
        } finally {
          setLoadingSpaces(false);
        }
      };
      fetchSpaces();
    }
  }, [open]);

  // 2. Handle Edit/Reset State
  useEffect(() => {
    if (open) {
      if (initialData) {
        // Parse dates strings back to Date objects
        const start = initialData.start_date ? new Date(initialData.start_date) : null;
        const end = initialData.end_date ? new Date(initialData.end_date) : null;

        reset({
          name: initialData.name,
          description: initialData.description || '',
          location_id: initialData.location_id || '',
          start_date: start,
          end_date: end,
          scopes: initialData.scopes || [],
        });
        setPreviewUrl(initialData.image_url);
      } else {
        reset({
          name: '',
          description: '',
          location_id: '',
          start_date: null,
          end_date: null,
          scopes: [],
        });
        setPreviewUrl(null);
      }
      setImageFile(null);
    }
  }, [open, initialData, reset]);

  // 3. Image Cleanup
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

  // Helper to toggle scopes in the array
  const handleScopeToggle = (scope) => {
    const current = selectedScopes;
    const newScopes = current.includes(scope)
      ? current.filter(s => s !== scope)
      : [...current, scope];
    setValue('scopes', newScopes, { shouldValidate: true });
  };

  const handleFormSubmit = (data) => {
    onSubmit({ 
      ...data, 
      imageFile,
      currentPhotoUrl: previewUrl 
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          {initialData ? 'Edit Event' : 'Add New Event'}
        </DialogTitle>
        
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogContent dividers>
            <Grid container spacing={3}>
              
              {/* Left Column: Details */}
              <Grid item xs={12} md={7}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Event Name"
                      {...register('name')}
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      disabled={loading}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Controller
                      name="location_id"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          label="Location (Space)"
                          error={!!errors.location_id}
                          helperText={errors.location_id?.message}
                          disabled={loading || loadingSpaces}
                          SelectProps={{ native: false }}
                        >
                          {loadingSpaces ? (
                            <MenuItem disabled><CircularProgress size={20} /></MenuItem>
                          ) : (
                            spaces.map((space) => (
                              <MenuItem key={space.id} value={space.id}>
                                {space.facilities?.name} &gt; {space.name}
                              </MenuItem>
                            ))
                          )}
                        </TextField>
                      )}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Controller
                      name="start_date"
                      control={control}
                      render={({ field }) => (
                        <DateTimePicker
                          label="Start Date & Time"
                          value={field.value}
                          onChange={(date) => field.onChange(date)}
                          slotProps={{
                            textField: { 
                              fullWidth: true,
                              error: !!errors.start_date,
                              helperText: errors.start_date?.message
                            }
                          }}
                          disabled={loading}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Controller
                      name="end_date"
                      control={control}
                      render={({ field }) => (
                        <DateTimePicker
                          label="End Date & Time"
                          value={field.value}
                          onChange={(date) => field.onChange(date)}
                          slotProps={{
                            textField: { 
                              fullWidth: true,
                              error: !!errors.end_date,
                              helperText: errors.end_date?.message
                            }
                          }}
                          disabled={loading}
                        />
                      )}
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
                </Grid>
              </Grid>

              {/* Right Column: Scopes & Image */}
              <Grid item xs={12} md={5}>
                {/* Scopes Section */}
                <Box sx={{ mb: 3 }}>
                  <FormControl error={!!errors.scopes} component="fieldset" variant="standard">
                    <FormLabel component="legend">Target Audience</FormLabel>
                    <FormGroup sx={{ maxHeight: 200, overflowY: 'auto', pl: 1 }}>
                      {SCOPES.map((scope) => (
                        <FormControlLabel
                          key={scope}
                          control={
                            <Checkbox 
                              checked={selectedScopes.includes(scope)} 
                              onChange={() => handleScopeToggle(scope)}
                              size="small"
                            />
                          }
                          label={<Typography variant="body2">{scope}</Typography>}
                        />
                      ))}
                    </FormGroup>
                    <FormHelperText>{errors.scopes?.message}</FormHelperText>
                  </FormControl>
                </Box>

                {/* Image Upload */}
                <Box sx={{ border: '1px dashed grey', p: 2, borderRadius: 1, textAlign: 'center' }}>
                  {!previewUrl ? (
                    <>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Event Banner
                      </Typography>
                      <Button
                        component="label"
                        variant="outlined"
                        size="small"
                        startIcon={<CloudUploadIcon />}
                        disabled={loading}
                      >
                        Select Image
                        <input type="file" hidden accept="image/*" onChange={handleImageSelect} />
                      </Button>
                    </>
                  ) : (
                    <Box sx={{ position: 'relative' }}>
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '4px' }} 
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
              {loading ? 'Saving...' : initialData ? 'Update Event' : 'Save Event'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </LocalizationProvider>
  );
}