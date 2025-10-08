import { useMsal } from '@azure/msal-react';
import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaCalendarDay, FaCalendarWeek, FaFile, FaFilter } from 'react-icons/fa';
import MicrosoftGraphService from '../lib/microsoftGraph';
import api from '../lib/api';

const AllMeetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('month'); 
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const { instance } = useMsal();

  const formatEventToMeeting = (event, index) => {
    const startTime = new Date(event.start.dateTime + 'Z');
    const endTime = new Date(event.end.dateTime + 'Z');
    const duration = Math.round((endTime - startTime) / (1000 * 60)); 
    
    const now = new Date();
    let status = "Upcoming";
    if (endTime < now) status = "Completed";
    else if (startTime <= now && endTime >= now) status = "Ongoing";

    return {
      id: event.id || index,
      name: event.subject || "Untitled Meeting",
      date: startTime.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      }).toLowerCase(),
      duration: `${duration} min`,
      location: event.location.displayName || "Not Specified",
      meetingUrl: event.onlineMeeting?.joinUrl,
      time: startTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
      timeZone: event.start.timeZone,
      status: status,
      rawEvent: event 
    };
  };

  const getDateRange = () => {
    const now = new Date();
    switch (filter) {
      case 'today':
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(now);
        endOfDay.setHours(23, 59, 59, 999);
        
        return { start: startOfDay, end: endOfDay };

      case 'week':
        const dayOfWeek = now.getDay(); 
        const diffToMonday = (dayOfWeek + 6) % 7; 

        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - diffToMonday);
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        return { start: startOfWeek, end: endOfWeek };
      
      case 'month':
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        endOfMonth.setHours(23, 59, 59, 999);
        
        return { start: startOfMonth, end: endOfMonth };
      
      case 'year':
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const endOfYear = new Date(now.getFullYear(), 11, 31);
        endOfYear.setHours(23, 59, 59, 999);
        
        return { start: startOfYear, end: endOfYear };
      
      default:
        return getDateRange('month');
    }
  };

  const loadBackendMeetings = async () => {
    try {
      const { data } = await api.get("/api/meetings");
      const mapped = (data || []).map((meeting, index) => {
        const createdAt = meeting.createdAt ? new Date(meeting.createdAt) : new Date();
        const status = meeting.status || "Recorded";
        return {
          id: meeting._id || index,
          name: meeting.topic || "Recorded Meeting",
          date: createdAt.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          }).toLowerCase(),
          duration: meeting.recordings?.[0]?.duration || meeting.recordings?.[0]?.length || "--",
          location: meeting.recordings?.[0]?.fileType || "Recording",
          meetingUrl: meeting.recordings?.[0]?.playUrl,
          time: createdAt.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          status,
          rawEvent: meeting,
        };
      });

      setMeetings(mapped);
    } catch (backendError) {
      console.error("Fallback backend meetings failed", backendError);
      setError("Unable to load meetings from Outlook or backend");
      setMeetings([]);
    }
  };

  const fetchOutlookMeetings = async () => {
    setLoading(true);
    setError(null);

    try {
      const accounts = instance.getAllAccounts();
      if (accounts.length === 0) {
        throw new Error('No user signed in');
      }

      const silentRequest = {
        scopes: ["Calendars.Read", "Calendars.ReadWrite"],
        account: accounts[0]
      };

      const response = await instance.acquireTokenSilent(silentRequest);
      const accessToken = response.accessToken;

      const graphService = new MicrosoftGraphService(accessToken);

      const {start, end} = getDateRange();
      const events = await graphService.getEventsForDateRange(start, end);

      const formattedMeetings = events.map((event, index) => 
        formatEventToMeeting(event, index)
      );

      setMeetings(formattedMeetings);
    } catch (error) {
      console.error('Error fetching Outlook meetings:', error);
      setError('Failed to fetch meetings from Outlook Calendar');

      await loadBackendMeetings();
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "Completed":
        return "bg-green-100 text-green-800 border border-green-500";
      case "Ongoing":
        return "bg-cyan-100 text-cyan-800 border border-cyan-500";
      case "Failed":
        return "bg-red-100 text-red-800 border border-red-500";
      case "Upcoming":
        return "bg-yellow-100 text-yellow-800 border border-yellow-500";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setShowFilterDropdown(false);
  };

  const getFilterDisplayText = () => {
    switch (filter) {
      case 'today': return 'Today';
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case 'year': return 'This Year';
      default: return 'This Month';
    }
  };

  const getFilterIcon = () => {
    switch (filter) {
      case 'today': return <FaCalendarDay className="w-4 h-4" />;
      case 'week': return <FaCalendarWeek className="w-4 h-4" />;
      case 'month': return <FaCalendarWeek className="w-4 h-4" />;
      case 'year': return <FaCalendarAlt className="w-4 h-4" />;
      default: return <FaFilter className="w-4 h-4" />;
    }
  }

  useEffect(() => {
    fetchOutlookMeetings();
  }, [filter]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading meetings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl m-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Meeting Schedule</h1>
        <div className="flex gap-3">
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors flex items-center border border-gray-300"
            >
              {getFilterIcon()}
              <span className="ml-2 text-sm">{getFilterDisplayText()}</span>
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <button
                  onClick={() => handleFilterChange('today')}
                  className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 flex items-center gap-3 rounded-t-lg border-b border-gray-100"
                >
                  <FaCalendarDay className="text-blue-500" />
                  <span>Today</span>
                </button>
                <button
                  onClick={() => handleFilterChange('week')}
                  className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 flex items-center gap-3 rounded-t-lg border-b border-gray-100"
                >
                  <FaCalendarWeek className="text-orange-500" />
                  <span>This Week</span>
                </button>
                <button
                  onClick={() => handleFilterChange('month')}
                  className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100"
                >
                  <FaCalendarWeek className="text-green-500" />
                  <span>This Month</span>
                </button>
                <button
                  onClick={() => handleFilterChange('year')}
                  className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 flex items-center gap-3 rounded-b-lg"
                >
                  <FaCalendarAlt className="text-purple-500" />
                  <span>This Year</span>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={fetchOutlookMeetings}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-500 cursor-pointer transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

       {error && (
         <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
           {error}
         </div>
       )}
      
      <div className="overflow-auto max-h-full">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Meetings</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {meetings.map((meeting, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 align-middle">
                  <div className="flex gap-2 items-center">
                    <FaFile />
                    <p className="text-sm truncate max-w-3xs overflow-hidden" title={meeting.name} >{meeting.name}</p>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-700">{meeting.date}</td>
                <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-700">{meeting.duration}</td>
                <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-700">{meeting.time}</td>
                <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-700">{meeting.location}</td>
                <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-700">
                  {meeting.meetingUrl ? (
                    <a href={meeting.meetingUrl} className='text-blue-600 underline' target="_blank" rel="noopener noreferrer">Join here</a>
                  ): "No link"}
                  </td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  <span className={`inline-flex justify-center min-w-25 px-4 py-2 text-center text-sm rounded-md ${getStatusColor(meeting.status)}`}>
                    {meeting.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    {meetings.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          No meetings found for {getFilterDisplayText().toLowerCase()}.
        </div>
      )}
    </div>
  );
};

export default AllMeetings;
