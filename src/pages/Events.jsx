import { useState, useEffect } from 'react';
import { Plus, Search, RefreshCw, Edit, Trash2, Calendar, MapPin } from 'lucide-react';

import { eventService } from '../services/eventService';
import { showError, showSuccess } from '../utils/toast';
import { formatDateTime } from '../utils/formatters';
import EventFormDialog from '../components/events/EventFormDialog';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Table, TableHeader, TableRow, TableHead, TableCell } from '../components/ui/Table';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await eventService.getAll();
      setEvents(data);
    } catch (error) {
      console.error('Error loading events:', error);
      showError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleAddClick = () => {
    setEditingEvent(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (event) => {
    setEditingEvent(event);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventService.delete(id);
        showSuccess('Event deleted successfully');
        loadEvents();
      } catch (error) {
        console.error('Delete error:', error);
        showError('Failed to delete event');
      }
    }
  };

  const handleSaveEvent = async (formData) => {
    setSaving(true);
    try {
      let imageUrl = formData.currentPhotoUrl;

      if (formData.imageFile) {
        imageUrl = await eventService.uploadImage(formData.imageFile);
      }

      const eventData = {
        name: formData.name,
        description: formData.description,
        location_id: formData.location_id,
        start_date: formData.start_date.toISOString(),
        end_date: formData.end_date.toISOString(),
        scopes: formData.scopes,
        image_url: imageUrl
      };

      if (editingEvent) {
        await eventService.update(editingEvent.id, eventData);
        showSuccess('Event updated successfully!');
      } else {
        await eventService.create(eventData);
        showSuccess('Event created successfully!');
      }

      setIsDialogOpen(false);
      loadEvents();
      
    } catch (error) {
      console.error('Save error:', error);
      showError(error.message || 'Failed to save event');
    } finally {
      setSaving(false);
    }
  };

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (event.spaces?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-ios-secondaryLabel mt-1">Manage campus activities and schedules.</p>
        </div>
        <Button onClick={handleAddClick}>
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </div>

      {/* Content */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ios-gray2" />
              <Input 
                placeholder="Search events..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="ghost" size="icon" onClick={loadEvents} title="Refresh">
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
                  <TableHead>Event Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Location</TableHead>
                  <TableHead className="hidden md:table-cell">Start Date</TableHead>
                  <TableHead className="hidden lg:table-cell">Audience</TableHead>
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
                ) : filteredEvents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-ios-secondaryLabel">
                      No events found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        {event.image_url ? (
                          <img 
                            src={event.image_url} 
                            alt={event.name} 
                            className="h-10 w-10 rounded-ios object-cover bg-ios-orange/10"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-ios bg-ios-orange/10 flex items-center justify-center text-ios-orange">
                            <Calendar className="h-5 w-5" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{event.name}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center text-xs text-ios-secondaryLabel">
                          <MapPin className="mr-1 h-3 w-3" />
                          {event.spaces?.facilities?.name ? (
                            <span>{event.spaces.facilities.name} &gt; {event.spaces.name}</span>
                          ) : (
                            <span>TBA</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-ios-label">
                        {formatDateTime(event.start_date)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {event.scopes?.map((scope, i) => (
                            <span key={i} className="inline-flex items-center rounded-full bg-ios-gray6 px-2 py-0.5 text-[10px] font-medium text-ios-secondaryLabel">
                              {scope}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEditClick(event)}
                          >
                            <Edit className="h-4 w-4 text-ios-blue" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteClick(event.id)}
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
      
      <EventFormDialog 
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSaveEvent}
        loading={saving}
        initialData={editingEvent}
      />
    </div>
  );
}