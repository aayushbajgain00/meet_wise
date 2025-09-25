import React, { useState, useRef, useEffect } from 'react';
import Swal from 'sweetalert2';

const LiveMeeting = () => {
  const [meetingName, setMeetingName] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('English (Global)');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const dropdownRef = useRef(null);

  const languages = [
    'English (Global)',
    'Nepali',
    'Hindi',
    'Japanese',
    'Chinese',
    'French',
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!meetingName.trim()) {
      newErrors.meetingName = 'Meeting name is required';
    }

    if (!meetingLink.trim()) {
      newErrors.meetingLink = 'Meeting link is required';
    } else if (!isValidUrl(meetingLink)) {
      newErrors.meetingLink = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleStartMeeting = () => {
    if (validateForm()) {
    console.log('Meeting Details:', {
        name: meetingName,
        link: meetingLink,
        language: selectedLanguage
    });
    Swal.fire({
        title: `Meeting "${meetingName}" started successfully!`,
        icon: "success",
        toast: true,
        timer: 3000,
        position: "top-right",
        showConfirmButton: false,
    });
    }
  };

  const handleCancel = () => {
    setMeetingName('');
    setMeetingLink('');
    setSelectedLanguage('English (Global)');
    setErrors({});
  };

  return (
    <div className="min-w-xl mx-auto p-8 bg-white rounded-2xl shadow-lg">
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Meeting Name
        </label>
        <input
          type="text"
          value={meetingName}
          onChange={(e) => {
            setMeetingName(e.target.value);
            if (errors.meetingName) setErrors({...errors, meetingName: ''});
          }}
          placeholder="Eg: Your project name"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
            errors.meetingName ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.meetingName && (
          <p className="text-red-500 text-xs mt-1">{errors.meetingName}</p>
        )}
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Meeting Link
        </label>
        <input
          type="url"
          value={meetingLink}
          onChange={(e) => {
            setMeetingLink(e.target.value);
            if (errors.meetingLink) setErrors({...errors, meetingLink: ''});
          }}
          placeholder="eg: https://www.figma.com/design"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
            errors.meetingLink ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.meetingLink && (
          <p className="text-red-500 text-xs mt-1">{errors.meetingLink}</p>
        )}
      </div>
      
      <div className="mb-8" ref={dropdownRef}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Meeting Language
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-left flex justify-between items-center hover:border-gray-400"
          >
            <span className="text-gray-700">{selectedLanguage}</span>
            <svg 
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
              {languages.map((language, index) => (
                <button
                  key={language}
                  type="button"
                  onClick={() => {
                    setSelectedLanguage(language);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 ${
                    selectedLanguage === language 
                      ? 'bg-blue-50 text-blue-600 font-medium' 
                      : 'text-gray-700'
                  } ${
                    index === 0 ? 'rounded-t-lg' : 
                    index === languages.length - 1 ? 'rounded-b-lg' : ''
                  }`}
                >
                  {language}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex gap-4">
        <button
          onClick={handleCancel}
          className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          onClick={handleStartMeeting}
          className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
          disabled={!meetingName.trim() || !meetingLink.trim()}
        >
          Start
        </button>
      </div>
    </div>
  );
};

export default LiveMeeting;