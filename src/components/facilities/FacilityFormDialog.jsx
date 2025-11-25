import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, Trash2 } from "lucide-react";

import { facilitySchema } from "../../utils/validators";
import MapPicker from "../common/MapPicker";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export default function FacilityFormDialog({
  open,
  onClose,
  onSubmit,
  loading,
  initialData,
}) {
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
      name: "",
      description: "",
      latitude: "",
      longitude: "",
    },
  });

  const currentLat = watch("latitude");
  const currentLng = watch("longitude");

  // Handle Opening/Closing and Editing State
  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          name: initialData.name,
          description: initialData.description || "",
          latitude: initialData.latitude,
          longitude: initialData.longitude,
        });
        setPreviewUrl(initialData.photo_url);
      } else {
        reset({
          name: "",
          description: "",
          latitude: "",
          longitude: "",
        });
        setPreviewUrl(null);
      }
      setImageFile(null);
    }
  }, [open, initialData, reset]);

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
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
    onSubmit({
      ...data,
      imageFile,
      currentPhotoUrl: previewUrl,
    });
  };

  const handleLocationSelect = (lat, lng) => {
    setValue("latitude", Number(lat.toFixed(6)), { shouldValidate: true });
    setValue("longitude", Number(lng.toFixed(6)), { shouldValidate: true });
  };

  const footer = (
    <>
      <Button type="submit" form="facility-form" isLoading={loading}>
        {initialData ? "Update Facility" : "Save Facility"}
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
      title={initialData ? "Edit Facility" : "Add New Facility"}
      className="max-w-4xl" // Wider modal for map layout
      footer={footer}
    >
      <form
        id="facility-form"
        onSubmit={handleSubmit(handleFormSubmit)}
        className="grid grid-cols-1 md:grid-cols-12 gap-6"
      >
        {/* Left Column: Details */}
        <div className="md:col-span-5 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-ios-label">
              Facility Name
            </label>
            <Input
              placeholder="e.g., Science Building"
              {...register("name")}
              error={errors.name?.message}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-ios-label">
              Description
            </label>
            <textarea
              className="flex w-full rounded-ios border border-transparent bg-ios-bg px-3 py-2 text-sm text-ios-label placeholder:text-ios-gray2 shadow-ios-sm focus:outline-none focus:ring-2 focus:ring-ios-blue disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px]"
              placeholder="Brief description..."
              {...register("description")}
              disabled={loading}
            />
            {errors.description && (
              <p className="text-xs text-ios-red">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <label className="text-xs font-medium text-ios-secondaryLabel">
                Latitude
              </label>
              <Input
                type="number"
                step="any"
                {...register("latitude")}
                error={errors.latitude?.message}
                readOnly // Use map to set this usually
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-ios-secondaryLabel">
                Longitude
              </label>
              <Input
                type="number"
                step="any"
                {...register("longitude")}
                error={errors.longitude?.message}
                readOnly
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-ios-label">Photo</label>
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

        {/* Right Column: Map */}
        <div className="md:col-span-7 space-y-2">
          <label className="text-sm font-medium text-ios-label">Location</label>
          <div className="overflow-hidden rounded-ios border border-ios-separator/50 shadow-ios-sm h-[200px] md:h-[300px]">
            {" "}
            <MapPicker
              lat={currentLat}
              lng={currentLng}
              onLocationSelect={handleLocationSelect}
            />
          </div>
          {errors.latitude && (
            <p className="text-xs text-ios-red">
              Please select a location on the map.
            </p>
          )}
        </div>
      </form>
    </Modal>
  );
}
