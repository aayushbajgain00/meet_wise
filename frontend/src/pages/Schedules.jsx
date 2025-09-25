import React, { useState } from 'react';
import { GoogleCalendar, MicrosoftOutlook, ZoomLogo } from '../component/svgs';

const Schedules = () => {
  const [calendarOptions, setCalendarOptions] = useState({
    google: false,
    outlook: true,
    zoom: false
  });
  const [isRedirecting, setIsRedirecting] = useState(false);

  const calendarConfigs = {
    google: {
      name: 'Google Calendar',
      url: 'https://calendar.google.com',
      icon: GoogleCalendar,
      description: 'Open your Google Calendar'
    },
    outlook: {
      name: 'Microsoft Outlook',
      url: 'https://outlook.office.com/calendar',
      icon: MicrosoftOutlook,
      description: 'Open your Outlook Calendar'
    },
    zoom: {
      name: 'Zoom',
      url: 'https://zoom.us/meeting/schedule',
      icon: ZoomLogo,
      description: 'Open your Zoom Meeting Scheduler'
    }
  };

  const toggleCalendarOption = (option) => {
    setCalendarOptions(prev => ({
      google: option === 'google' ? !prev.google : false,
      outlook: option === 'outlook' ? !prev.outlook : false,
      zoom: option === 'zoom' ? !prev.zoom : false
    }));
  };

  const handleContinue = async () => {
    const selectedCalendar = calendarOptions.google ? 'google' : 
                            calendarOptions.outlook ? 'outlook' : 
                            calendarOptions.zoom ? 'zoom' : null;

    if (!selectedCalendar) {
      alert('Please select a calendar service to continue.');
      return;
    }

    setIsRedirecting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const config = calendarConfigs[selectedCalendar];
    
    window.open(config.url, '_blank', 'noopener,noreferrer');
    setIsRedirecting(false);
    
    console.log(`Redirecting to ${config.name}`);
  };

  const getSelectedCalendar = () => {
    if (calendarOptions.google) return calendarConfigs.google;
    if (calendarOptions.outlook) return calendarConfigs.outlook;
    if (calendarOptions.zoom) return calendarConfigs.zoom;
    return null;
  };

  const selectedCalendar = getSelectedCalendar();
  const isButtonDisabled = !calendarOptions.google && !calendarOptions.outlook && !calendarOptions.zoom;
  return (
    <div className="min-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Schedule Meetings</h1>
      
      <p className="text-gray-600 mb-6 leading-relaxed">
        Your Meetwise will be invited to the calendar meeting to record, transcribe and summarize.
      </p>
      
      <div className="space-y-4">
        <div 
          className={`flex max-w-96 items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
            calendarOptions.google 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
          }`}
          onClick={() => toggleCalendarOption('google')}
        >
          <span className={`flex gap-2 items-center font-medium ${
            calendarOptions.google ? 'text-blue-700' : 'text-gray-700'
          }`}>
            <GoogleCalendar/>
            Google Calendar
          </span>
        </div>
        
        <div 
          className={`flex max-w-96 items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
            calendarOptions.outlook 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
          }`}
          onClick={() => toggleCalendarOption('outlook')}
        >
          <span className={`flex gap-2 items-center font-medium ${
            calendarOptions.outlook ? 'text-blue-700' : 'text-gray-700'
          }`}>
            <MicrosoftOutlook/>
            Microsoft Outlook
          </span>
        </div>

        <div 
          className={`flex max-w-96 items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
            calendarOptions.zoom 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
          }`}
          onClick={() => toggleCalendarOption('zoom')}
        >
          <span className={`flex gap-2 items-center font-medium ${
            calendarOptions.zoom ? 'text-blue-700' : 'text-gray-700'
          }`}>
            <ZoomLogo/>
            Zoom
          </span>
        </div>
      </div>

      {selectedCalendar && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-700 text-sm">
            <strong>Selected:</strong> {selectedCalendar.description}
          </p>
        </div>
      )}
      
      <div className="mt-6 flex justify-end items-center gap-4">
        {isRedirecting && (
          <div className="flex items-center text-gray-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            Redirecting...
          </div>
        )}
        <button 
          onClick={handleContinue}
          className="px-6 py-2 bg-blue-800 text-white font-medium rounded-lg cursor-pointer hover:bg-blue-900 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          disabled={isButtonDisabled || isRedirecting}
        >
          {isRedirecting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Opening...
            </>
          ) : (
            'Continue'
          )}
        </button>
      </div>
    </div>
  );
};

export default Schedules;