import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Plus, 
  ArrowRight 
} from 'lucide-react';

import { facilityService } from '../services/facilityService';
import { spaceService } from '../services/spaceService';
import { eventService } from '../services/eventService';
import { formatDateTime } from '../utils/formatters';
import { showError } from '../utils/toast';

import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    facilities: 0,
    spaces: 0,
    events: 0
  });
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Fetch all data in parallel
      const [facilitiesData, spacesData, eventsData] = await Promise.all([
        facilityService.getAll(),
        spaceService.getAll(),
        eventService.getAll()
      ]);

      // Calculate Stats
      setStats({
        facilities: facilitiesData.length,
        spaces: spacesData.length,
        events: eventsData.length
      });

      // Filter & Sort Upcoming Events (Future only, nearest first)
      const now = new Date();
      const futureEvents = eventsData
        .filter(e => new Date(e.start_date) > now)
        .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
        .slice(0, 3); // Take top 3

      setUpcomingEvents(futureEvents);

    } catch (error) {
      console.error('Error loading dashboard:', error);
      showError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <Card>
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-ios-secondaryLabel uppercase tracking-wide">
            {title}
          </p>
          <h3 className="text-3xl font-bold text-ios-label mt-1">
            {loading ? '...' : value}
          </h3>
        </div>
        <div className={`p-3 rounded-full ${colorClass}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-ios-label tracking-tight">
          Dashboard
        </h1>
        <p className="text-ios-secondaryLabel mt-1">
          Overview of campus assets and upcoming schedules.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Facilities" 
          value={stats.facilities} 
          icon={Building2} 
          colorClass="bg-ios-blue" 
        />
        <StatCard 
          title="Total Spaces" 
          value={stats.spaces} 
          icon={MapPin} 
          colorClass="bg-ios-indigo" 
        />
        <StatCard 
          title="Active Events" 
          value={stats.events} 
          icon={Calendar} 
          colorClass="bg-ios-orange" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="primary" 
              className="w-full justify-start" 
              onClick={() => navigate('/events')}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New Event
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={() => navigate('/facilities')}
            >
              <Building2 className="mr-2 h-4 w-4" />
              Add New Facility
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={() => navigate('/spaces')}
            >
              <MapPin className="mr-2 h-4 w-4" />
              Add New Space
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Events List */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Upcoming Events</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/events')}>
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-ios-separator/50">
              {loading ? (
                <div className="py-8 text-center text-ios-secondaryLabel">Loading...</div>
              ) : upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center py-4 first:pt-0 last:pb-0">
                    <div className="flex-shrink-0 w-12 h-12 bg-ios-blue/10 rounded-ios flex flex-col items-center justify-center text-ios-blue">
                      <span className="text-[10px] font-bold uppercase">
                        {new Date(event.start_date).toLocaleString('default', { month: 'short' })}
                      </span>
                      <span className="text-lg font-bold leading-none">
                        {new Date(event.start_date).getDate()}
                      </span>
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                      <p className="text-sm font-medium text-ios-label truncate">
                        {event.name}
                      </p>
                      <p className="text-xs text-ios-secondaryLabel truncate">
                        {formatDateTime(event.start_date)} • {event.spaces?.name || 'TBA'}
                      </p>
                    </div>
                    <div className="ml-4 hidden sm:block">
                      <span className="inline-flex items-center rounded-full bg-ios-gray6 px-2.5 py-0.5 text-xs font-medium text-ios-secondaryLabel">
                        {event.scopes?.[0] || 'General'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-ios-secondaryLabel">
                  No upcoming events scheduled.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}