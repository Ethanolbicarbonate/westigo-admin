import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, Trash2, ChevronDown } from 'lucide-react';

import { eventSchema } from '../../utils/validators';
import { SCOPES } from '../../utils/constants';
import { spaceService } from '../../services/spaceService';
import { showError } from '../../utils/toast';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

// Helper to format Date object to "YYYY-MM-DDTHH:mm" string for input value
const toDateTimeLocal = (date) => {
  if (!date) return '';
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

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
      start_date: '',
      end_date: '',
      scopes: [],
    }
  });

  const selectedScopes = watch('scopes') || [];

  // 1. Fetch Locations
  useEffect(() => {
    if (open) {
      const fetchSpaces = async () => {
        setLoadingSpaces(true);
        try {
          const data = await spaceService.getAll();
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

  // 2. Handle Edit/Reset
  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          name: initialData.name,
          description: initialData.description || '',
          location_id: initialData.location_id || '',
          // Important: Convert DB date string to Date object for validator
          // But Inputs need strings (handled via toDateTimeLocal in render or controller)
          start_date: initialData.start_date ? new Date(initialData.start_date) : null,
          end_date: initialData.end_date ? new Date(initialData.end_date) : null,
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

  const footer = (
    <>
      <Button type="submit" form="event-form" isLoading={loading}>
        {initialData ? 'Update Event' : 'Save Event'}
      </Button>
      <Button variant="ghost" onClick={onClose} disabled={loading}>
        Cancel
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title={initialData ? 'Edit Event' : 'Add New Event'}
      className="max-w-3xl"
      footer={footer}
    >
      <form id="event-form" onSubmit={handleSubmit(handleFormSubmit)} className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column: Details */}
        <div className="md:col-span-7 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-ios-label">Event Name</label>
            <Input
              placeholder="e.g., Freshman Orientation"
              {...register('name')}
              error={errors.name?.message}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-ios-label">Location</label>
            <div className="relative">
              <Controller
                name="location_id"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    disabled={loading || loadingSpaces}
                    className="flex w-full appearance-none rounded-ios border border-transparent bg-ios-bg px-3 py-2 text-sm text-ios-label shadow-ios-sm focus:outline-none focus:ring-2 focus:ring-ios-blue disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select a location...</option>
                    {spaces.map((space) => (
                      <option key={space.id} value={space.id}>
                        {space.facilities?.name} &gt; {space.name}
                      </option>
                    ))}
                  </select>
                )}
              />
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ios-gray2 pointer-events-none" />
            </div>
            {errors.location_id && <p className="text-xs text-ios-red">{errors.location_id.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-ios-label">Start Date</label>
              <Controller
                name="start_date"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    type="datetime-local"
                    value={toDateTimeLocal(value)}
                    onChange={(e) => onChange(new Date(e.target.value))}
                    error={errors.start_date?.message}
                    disabled={loading}
                  />
                )}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ios-label">End Date</label>
              <Controller
                name="end_date"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    type="datetime-local"
                    value={toDateTimeLocal(value)}
                    onChange={(e) => onChange(new Date(e.target.value))}
                    error={errors.end_date?.message}
                    disabled={loading}
                  />
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-ios-label">Description</label>
            <textarea
              className="flex w-full rounded-ios border border-transparent bg-ios-bg px-3 py-2 text-sm text-ios-label placeholder:text-ios-gray2 shadow-ios-sm focus:outline-none focus:ring-2 focus:ring-ios-blue disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
              placeholder="Event details..."
              {...register('description')}
              disabled={loading}
            />
            {errors.description && <p className="text-xs text-ios-red">{errors.description.message}</p>}
          </div>
        </div>

        {/* Right Column: Scopes & Image */}
        <div className="md:col-span-5 space-y-4">
          {/* Audience Scopes */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-ios-label">Target Audience</label>
            <div className="rounded-ios border border-transparent bg-ios-bg p-3 h-[180px] overflow-y-auto shadow-ios-sm">
              <div className="space-y-2">
                {SCOPES.map((scope) => (
                  <label key={scope} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${selectedScopes.includes(scope) ? 'bg-ios-blue border-ios-blue' : 'border-ios-gray3 bg-white'}`}>
                      <input 
                        type="checkbox"
                        className="hidden"
                        checked={selectedScopes.includes(scope)} 
                        onChange={() => handleScopeToggle(scope)}
                      />
                      {selectedScopes.includes(scope) && (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm text-ios-label group-hover:text-ios-blue transition-colors">{scope}</span>
                  </label>
                ))}
              </div>
            </div>
            {errors.scopes && <p className="text-xs text-ios-red">{errors.scopes.message}</p>}
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-ios-label">Event Banner</label>
            <div className="rounded-ios border border-dashed border-ios-gray3 p-4 text-center hover:bg-ios-gray6/50 transition-colors">
              {!previewUrl ? (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-ios-gray2" />
                  <div className="text-xs text-ios-secondaryLabel">
                    <label className="cursor-pointer font-medium text-ios-blue hover:underline">
                      Upload a file
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageSelect} />
                    </label>
                    <p>PNG, JPG</p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="h-32 w-full object-cover rounded-ios"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 rounded-full bg-black/50 p-1.5 text-white hover:bg-ios-red transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

      </form>
    </Modal>
  );
}