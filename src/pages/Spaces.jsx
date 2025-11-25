import { useState, useEffect } from 'react';
import { Plus, Search, RefreshCw, Edit, Trash2, MapPin, Building2 } from 'lucide-react';

import { spaceService } from '../services/spaceService';
import { showError, showSuccess } from '../utils/toast';
import SpaceFormDialog from '../components/spaces/SpaceFormDialog';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Table, TableHeader, TableRow, TableHead, TableCell } from '../components/ui/Table';

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
        parent_facility_id: formData.parent_facility_id,
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-ios-secondaryLabel mt-1">Manage individual rooms and areas.</p>
        </div>
        <Button onClick={handleAddClick}>
          <Plus className="mr-2 h-4 w-4" />
          Add Space
        </Button>
      </div>

      {/* Content */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ios-gray2" />
              <Input 
                placeholder="Search spaces or facilities..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="ghost" size="icon" onClick={loadSpaces} title="Refresh">
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
                  <TableHead>Space Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Parent Facility</TableHead>
                  <TableHead className="hidden md:table-cell">Floor</TableHead>
                  <TableHead className="hidden lg:table-cell">Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <tbody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-ios-secondaryLabel">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredSpaces.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-ios-secondaryLabel">
                      No spaces found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSpaces.map((space) => (
                    <TableRow key={space.id}>
                      <TableCell>
                        {space.photo_url ? (
                          <img 
                            src={space.photo_url} 
                            alt={space.name} 
                            className="h-10 w-10 rounded-ios object-cover bg-ios-gray6"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-ios bg-ios-gray6 flex items-center justify-center text-ios-gray2">
                            <MapPin className="h-5 w-5" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{space.name}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className="inline-flex items-center rounded-full bg-ios-blue/10 px-2.5 py-0.5 text-xs font-medium text-ios-blue border border-ios-blue/20">
                          <Building2 className="mr-1 h-3 w-3" />
                          {space.facilities?.name || 'Unknown'}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-ios-secondaryLabel">
                        {space.floor_level || '-'}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-ios-secondaryLabel max-w-xs truncate">
                        {space.description || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEditClick(space)}
                          >
                            <Edit className="h-4 w-4 text-ios-blue" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteClick(space.id)}
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
      
      <SpaceFormDialog 
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSaveSpace}
        loading={saving}
        initialData={editingSpace}
      />
    </div>
  );
}