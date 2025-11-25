import { useState, useEffect } from 'react';
import { Plus, Search, RefreshCw, Edit, Trash2, MapPin } from 'lucide-react';

import { facilityService } from '../services/facilityService';
import { showError, showSuccess } from '../utils/toast';
import FacilityFormDialog from '../components/facilities/FacilityFormDialog';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Table, TableHeader, TableRow, TableHead, TableCell } from '../components/ui/Table';

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

  const handleAddClick = () => {
    setEditingFacility(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (facility) => {
    setEditingFacility(facility);
    setIsDialogOpen(true);
  };

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

  const handleSaveFacility = async (formData) => {
    setSaving(true);
    try {
      let photoUrl = formData.currentPhotoUrl;

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
        await facilityService.update(editingFacility.id, facilityData);
        showSuccess('Facility updated successfully!');
      } else {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-ios-secondaryLabel mt-1">Manage campus buildings and locations.</p>
        </div>
        <Button onClick={handleAddClick}>
          <Plus className="mr-2 h-4 w-4" />
          Add Facility
        </Button>
      </div>

      {/* Content */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ios-gray2" />
              <Input 
                placeholder="Search facilities..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="ghost" size="icon" onClick={loadFacilities} title="Refresh">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="border-0 shadow-none rounded-none">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead className="hidden sm:table-cell">Location</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <tbody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-ios-secondaryLabel">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredFacilities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-ios-secondaryLabel">
                      No facilities found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFacilities.map((facility) => (
                    <TableRow key={facility.id}>
                      <TableCell>
                        {facility.photo_url ? (
                          <img 
                            src={facility.photo_url} 
                            alt={facility.name} 
                            className="h-10 w-10 rounded-ios object-cover bg-ios-gray6"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-ios bg-ios-gray6 flex items-center justify-center text-ios-gray2">
                            <MapPin className="h-5 w-5" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{facility.name}</TableCell>
                      <TableCell className="hidden md:table-cell text-ios-secondaryLabel max-w-xs truncate">
                        {facility.description || '-'}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-xs text-ios-secondaryLabel font-mono">
                        {facility.latitude && facility.longitude 
                          ? `${Number(facility.latitude).toFixed(4)}, ${Number(facility.longitude).toFixed(4)}`
                          : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEditClick(facility)}
                          >
                            <Edit className="h-4 w-4 text-ios-blue" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteClick(facility.id)}
                          >
                            <Trash2 className="h-4 w-4 text-ios-red" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <FacilityFormDialog 
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSaveFacility}
        loading={saving}
        initialData={editingFacility}
      />
    </div>
  );
}