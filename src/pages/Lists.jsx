import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Edit, 
  ExternalLink 
} from 'lucide-react';

import { facilityService } from '../services/facilityService';
import { spaceService } from '../services/spaceService';
import { eventService } from '../services/eventService';
import { formatDateTime } from '../utils/formatters';
import { showError } from '../utils/toast';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

export default function Lists() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('structure'); // 'structure' or 'schedule'
  const [loading, setLoading] = useState(true);
  
  // Data
  const [hierarchy, setHierarchy] = useState([]); 
  const [events, setEvents] = useState([]);
  
  // Collapse state for facilities
  const [openFacilities, setOpenFacilities] = useState({});

  useEffect(() => {
    loadMasterData();
  }, []);

  const loadMasterData = async () => {
    setLoading(true);
    try {
      const [facilitiesData, spacesData, eventsData] = await Promise.all([
        facilityService.getAll(),
        spaceService.getAll(),
        eventService.getAll()
      ]);

      const nestedData = facilitiesData.map(facility => {
        return {
          ...facility,
          spaces: spacesData.filter(space => space.parent_facility_id === facility.id)
        };
      });

      setHierarchy(nestedData);
      setEvents(eventsData);
      
      const initialOpenState = {};
      facilitiesData.forEach(f => { initialOpenState[f.id] = true; });
      setOpenFacilities(initialOpenState);

    } catch (error) {
      console.error('Error loading master lists:', error);
      showError('Failed to load master data');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (id) => {
    setOpenFacilities(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-ios-blue border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-ios-secondaryLabel mt-1">
          Unified view of all campus assets and schedules.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-ios-gray6/50 rounded-ios-lg w-full max-w-md mx-auto sm:mx-0">
        <button
          onClick={() => setActiveTab('structure')}
          className={`flex-1 flex items-center justify-center py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
            activeTab === 'structure' 
              ? 'bg-white text-ios-label shadow-ios-sm' 
              : 'text-ios-secondaryLabel hover:text-ios-label'
          }`}
        >
          <Building2 className="w-4 h-4 mr-2" />
          Campus Structure
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex-1 flex items-center justify-center py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
            activeTab === 'schedule' 
              ? 'bg-white text-ios-label shadow-ios-sm' 
              : 'text-ios-secondaryLabel hover:text-ios-label'
          }`}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Event Schedule
        </button>
      </div>

      {/* TAB 1: CAMPUS STRUCTURE */}
      {activeTab === 'structure' && (
        <div className="space-y-4 animate-enter">
          <div className="flex justify-end">
            <Button size="sm" variant="outline" onClick={() => navigate('/facilities')}>
              Manage Facilities <ExternalLink className="ml-2 h-3 w-3" />
            </Button>
          </div>
          
          <div className="space-y-4">
            {hierarchy.map((facility) => (
              <Card key={facility.id} className="overflow-hidden">
                <button 
                  onClick={() => handleToggle(facility.id)}
                  className="w-full flex items-center justify-between p-4 bg-ios-bg/30 hover:bg-ios-bg/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-ios-blue/10 rounded-ios text-ios-blue">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-ios-label">{facility.name}</h3>
                      <p className="text-xs text-ios-secondaryLabel mt-0.5">
                        {facility.spaces.length} Spaces • {facility.description || 'No description'}
                      </p>
                    </div>
                  </div>
                  {openFacilities[facility.id] ? (
                    <ChevronUp className="w-5 h-5 text-ios-secondaryLabel" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-ios-secondaryLabel" />
                  )}
                </button>
                
                {openFacilities[facility.id] && (
                  <div className="divide-y divide-ios-separator/50 border-t border-ios-separator/50">
                    {facility.spaces.length > 0 ? (
                      facility.spaces.map((space) => (
                        <div key={space.id} className="flex items-center justify-between p-4 pl-12 bg-white hover:bg-ios-gray6/20 transition-colors group">
                          <div className="flex items-center gap-3">
                            <MapPin className="w-4 h-4 text-ios-gray2" />
                            <div>
                              <p className="text-sm font-medium text-ios-label">{space.name}</p>
                              <p className="text-xs text-ios-secondaryLabel">{space.floor_level || 'Ground Floor'}</p>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => navigate('/spaces')}
                          >
                            Edit <Edit className="ml-1.5 h-3 w-3" />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 pl-12 text-sm text-ios-secondaryLabel italic">
                        No spaces recorded for this facility.
                      </div>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: EVENTS SCHEDULE */}
      {activeTab === 'schedule' && (
        <div className="space-y-4 animate-enter">
          <div className="flex justify-end">
            <Button size="sm" variant="outline" onClick={() => navigate('/events')}>
              Manage Events <ExternalLink className="ml-2 h-3 w-3" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
              <Card key={event.id} className="flex flex-col h-full hover:shadow-ios-lg transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-base leading-snug line-clamp-2">
                      {event.name}
                    </CardTitle>
                    {event.scopes?.[0] && (
                      <span className="inline-flex items-center rounded-full bg-ios-blue/10 px-2 py-0.5 text-[10px] font-medium text-ios-blue shrink-0">
                        {event.scopes[0]}
                      </span>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-sm text-ios-secondaryLabel line-clamp-3 flex-1 mb-4">
                    {event.description || 'No description provided.'}
                  </p>
                  
                  <div className="space-y-2 pt-3 border-t border-ios-separator/50">
                    <div className="flex items-center gap-2 text-xs text-ios-label">
                      <Calendar className="w-3.5 h-3.5 text-ios-gray2" />
                      <span className="font-medium">{formatDateTime(event.start_date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-ios-secondaryLabel">
                      <MapPin className="w-3.5 h-3.5 text-ios-gray2" />
                      <span>{event.spaces?.facilities?.name} &gt; {event.spaces?.name || 'TBA'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}