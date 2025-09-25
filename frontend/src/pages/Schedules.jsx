import React from "react";

export default function ScheduleMeetings() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Schedule Meetings
        </h2>
        <p className="text-gray-500 mb-6">
          Your Meetwise will be invited to the calendar meeting to record,
          transcribe and summarize.
        </p>

        {/* Google Calendar */}
        <a
          href="https://calendar.google.com/calendar/r/eventedit"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-full py-3 mb-4 text-lg font-medium bg-white border rounded-lg shadow hover:bg-gray-50 transition"
        >
          <img
            src="https://www.gstatic.com/images/branding/product/1x/calendar_2020q4_48dp.png"
            alt="Google Calendar"
            className="w-6 h-6 mr-2"
          />
          Google Calendar
        </a>

        {/* Microsoft Outlook */}
        <a
          href="https://outlook.office.com/calendar/action/compose"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-full py-3 mb-4 text-lg font-medium bg-white border rounded-lg shadow hover:bg-gray-50 transition"
        >
          <img
            src="https://img.icons8.com/color/48/microsoft-outlook-2019.png"
            alt="Microsoft Outlook"
            className="w-6 h-6 mr-2"
          />
          Microsoft Outlook
        </a>

        {/* Zoom */}
        <a
          href="https://zoom.us/meeting/schedule"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-full py-3 text-lg font-medium bg-white border rounded-lg shadow hover:bg-gray-50 transition"
        >
          <img
            src="https://img.icons8.com/color/48/zoom.png"
            alt="Zoom"
            className="w-6 h-6 mr-2"
          />
          Zoom
        </a>
      </div>
    </div>
  );
}
