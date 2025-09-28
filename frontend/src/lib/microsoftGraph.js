import { Client } from '@microsoft/microsoft-graph-client';

class MicrosoftGraphService {
  constructor(accessToken) {
    this.client = Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      }
    });
  }

  async getCalendarEvents(startDate, endDate) {
    try {
      const events = await this.client
        .api('/me/events')
        .select('subject,start,end,location,onlineMeeting')
        .filter(`start/dateTime ge '${startDate}' and end/dateTime le '${endDate}'`)
        .orderby('start/dateTime')
        .top(300)
        .get();

      return events.value;
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw error;
    }
  }

  async getEventsForDateRange(startDate, endDate) {
    return this.getCalendarEvents(startDate.toISOString(), endDate.toISOString());
  }
}

export default MicrosoftGraphService;