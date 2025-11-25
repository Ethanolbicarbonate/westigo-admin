import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, Trash2, ChevronDown } from 'lucide-react';

import { spaceSchema } from '../../utils/validators';
import { facilityService } from '../../services/facilityService';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { showError } from '../../utils/toast';

export default function SpaceFormDialog({ open, onClose, onSubmit, loading, initialData }) {
  const [facilities, setFacilities] = useState([]);
  const [loadingFacilities, setLoadingFacilities] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const {
    register,
    handleSubmit,
    control,
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

  const footer = (
    <>
      <Button type="submit" form="space-form" isLoading={loading}>
        {initialData ? 'Update Space' : 'Save Space'}
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
      title={initialData ? 'Edit Space' : 'Add New Space'}
      className="max-w-lg"
      footer={footer}
    >
      <form id="space-form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        
        {/* Parent Facility Dropdown */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-ios-label">Parent Facility</label>
          <div className="relative">
            <Controller
              name="parent_facility_id"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  disabled={loading || loadingFacilities}
                  className="flex w-full appearance-none rounded-ios border border-transparent bg-ios-bg px-3 py-2 text-sm text-ios-label shadow-ios-sm focus:outline-none focus:ring-2 focus:ring-ios-blue disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select a facility...</option>
                  {facilities.map((facility) => (
                    <option key={facility.id} value={facility.id}>
                      {facility.name}
                    </option>
                  ))}
                </select>
              )}
            />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ios-gray2 pointer-events-none" />
          </div>
          {errors.parent_facility_id && <p className="text-xs text-ios-red">{errors.parent_facility_id.message}</p>}
        </div>

        {/* Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-ios-label">Space Name</label>
          <Input
            placeholder="e.g., Room 101, Dean's Office"
            {...register('name')}
            error={errors.name?.message}
            disabled={loading}
          />
        </div>

        {/* Floor Level */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-ios-label">Floor Level</label>
          <Input
            placeholder="e.g., 1st Floor"
            {...register('floor_level')}
            error={errors.floor_level?.message}
            disabled={loading}
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-ios-label">Description</label>
          <textarea
            className="flex w-full rounded-ios border border-transparent bg-ios-bg px-3 py-2 text-sm text-ios-label placeholder:text-ios-gray2 shadow-ios-sm focus:outline-none focus:ring-2 focus:ring-ios-blue disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px]"
            placeholder="Brief description..."
            {...register('description')}
            disabled={loading}
          />
          {errors.description && <p className="text-xs text-ios-red">{errors.description.message}</p>}
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-ios-label">Space Photo</label>
          <div className="rounded-ios border border-dashed border-ios-gray3 p-4 text-center hover:bg-ios-gray6/50 transition-colors">
            {!previewUrl ? (
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-ios-gray2" />
                <div className="text-xs text-ios-secondaryLabel">
                  <label className="cursor-pointer font-medium text-ios-blue hover:underline">
                    Upload a file
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleImageSelect} 
                    />
                  </label>
                  <p>PNG, JPG up to 5MB</p>
                </div>
              </div>
            ) : (
              <div className="relative">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="h-40 w-full object-cover rounded-ios"
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

      </form>
    </Modal>
  );
}