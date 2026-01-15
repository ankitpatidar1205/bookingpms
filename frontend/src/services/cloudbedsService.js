import api from './api';

/**
 * Cloudbeds Service
 * Frontend service for interacting with Cloudbeds API via backend
 */
const cloudbedsService = {
  /**
   * Check Cloudbeds API connection status
   */
  async getStatus() {
    const response = await api.get('/cloudbeds/status');
    return response.data;
  },

  /**
   * Get hotel details
   */
  async getHotelDetails() {
    const response = await api.get('/cloudbeds/hotel');
    return response.data;
  },

  /**
   * Get all room types
   */
  async getRoomTypes() {
    const response = await api.get('/cloudbeds/room-types');
    return response.data;
  },

  /**
   * Get all rooms
   */
  async getRooms() {
    const response = await api.get('/cloudbeds/rooms');
    return response.data;
  },

  /**
   * Get availability for a date range
   * @param {string} startDate - YYYY-MM-DD
   * @param {string} endDate - YYYY-MM-DD
   * @param {number} rooms - Number of rooms needed
   */
  async getAvailability(startDate, endDate, rooms = 1) {
    const response = await api.get('/cloudbeds/availability', {
      params: { startDate, endDate, rooms }
    });
    return response.data;
  },

  /**
   * Get calendar availability (day-by-day)
   * @param {string} startDate - YYYY-MM-DD
   * @param {string} endDate - YYYY-MM-DD
   */
  async getCalendarAvailability(startDate, endDate) {
    const response = await api.get('/cloudbeds/calendar', {
      params: { startDate, endDate }
    });
    return response.data;
  },

  /**
   * Get available date gaps
   * @param {string} startDate - YYYY-MM-DD
   * @param {string} endDate - YYYY-MM-DD
   * @param {number} minNights - Minimum nights required
   */
  async getAvailableGaps(startDate, endDate, minNights = 1) {
    const response = await api.get('/cloudbeds/gaps', {
      params: { startDate, endDate, minNights }
    });
    return response.data;
  },

  /**
   * Get room rates
   * @param {string} startDate - YYYY-MM-DD
   * @param {string} endDate - YYYY-MM-DD
   * @param {string} roomTypeId - Optional room type filter
   */
  async getRates(startDate, endDate, roomTypeId = null) {
    const params = { startDate, endDate };
    if (roomTypeId) params.roomTypeId = roomTypeId;
    const response = await api.get('/cloudbeds/rates', { params });
    return response.data;
  },

  /**
   * Get booking URL for Cloudbeds booking engine
   * @param {string} checkIn - YYYY-MM-DD
   * @param {string} checkOut - YYYY-MM-DD
   */
  async getBookingUrl(checkIn, checkOut) {
    const response = await api.get('/cloudbeds/booking-url', {
      params: { checkIn, checkOut }
    });
    return response.data;
  },

  /**
   * Redirect to Cloudbeds booking page
   * @param {string} checkIn - YYYY-MM-DD
   * @param {string} checkOut - YYYY-MM-DD
   */
  async redirectToBooking(checkIn, checkOut) {
    const result = await this.getBookingUrl(checkIn, checkOut);
    if (result.success && result.data?.bookingUrl) {
      window.open(result.data.bookingUrl, '_blank');
    }
    return result;
  }
};

export default cloudbedsService;
