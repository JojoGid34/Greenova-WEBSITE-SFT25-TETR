/**
 * Utility functions for date formatting and parsing
 * Ensures consistent dd-mm-yyyy hh:mm:ss format throughout the app
 */

export const formatDateConsistent = (date: Date | string | number | undefined | null): string => {
  try {
    let dateObj: Date;

    if (!date) {
      dateObj = new Date(); // Use current date as fallback
    } else if (date instanceof Date) {
      dateObj = date;
    } else if (typeof date === 'string') {
      // Try to parse the string date
      dateObj = parseDateString(date);
    } else if (typeof date === 'number') {
      // Handle numeric timestamps
      if (date < 1000000) {
        // Treat as seconds ago from now
        const now = new Date();
        dateObj = new Date(now.getTime() - (date * 1000));
      } else if (date < 10000000000) {
        // Treat as Unix timestamp in seconds
        dateObj = new Date(date * 1000);
      } else {
        // Treat as Unix timestamp in milliseconds
        dateObj = new Date(date);
      }
    } else {
      dateObj = new Date();
    }

    // Validate the date
    if (isNaN(dateObj.getTime())) {
      console.warn('Invalid date created, using current date:', date);
      dateObj = new Date();
    }

    // Format as dd-mm-yyyy hh:mm:ss
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    const seconds = dateObj.getSeconds().toString().padStart(2, '0');
    
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  } catch (error) {
    console.error('Error formatting date:', date, error);
    // Return current date formatted as fallback
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  }
};

export const parseDateString = (dateInput: string): Date => {
  try {
    // Try to parse as ISO string first
    const isoDate = new Date(dateInput);
    if (!isNaN(isoDate.getTime())) {
      return isoDate;
    }

    // Parse custom formats: "10-09-2025 22:12:17" or "12-09-2025, 06.59.17"
    let datePart, timePart;
    
    // Handle comma-separated format: "12-09-2025, 06.59.17"
    if (dateInput.includes(', ')) {
      const parts = dateInput.split(', ');
      if (parts.length !== 2) {
        throw new Error(`Invalid date format: ${dateInput}`);
      }
      [datePart, timePart] = parts;
      // Replace dots with colons for time part
      timePart = timePart.replace(/\./g, ':');
    } else {
      // Handle space-separated format: "10-09-2025 22:12:17"
      const parts = dateInput.split(' ');
      if (parts.length !== 2) {
        throw new Error(`Invalid date format: ${dateInput}`);
      }
      [datePart, timePart] = parts;
    }

    const dateParts = datePart.split('-');
    const timeParts = timePart.split(':');

    if (dateParts.length !== 3 || timeParts.length !== 3) {
      throw new Error(`Invalid date/time format: ${dateInput}`);
    }

    const [day, month, year] = dateParts;
    const [hour, minute, second] = timeParts;
    
    const parsedDate = new Date(
      parseInt(year),
      parseInt(month) - 1, // Month is 0-indexed
      parseInt(day),
      parseInt(hour),
      parseInt(minute),
      parseInt(second)
    );

    // Check if the parsed date is valid
    if (isNaN(parsedDate.getTime())) {
      throw new Error(`Invalid date values: ${dateInput}`);
    }

    return parsedDate;
  } catch (error) {
    console.error('Error parsing date input:', dateInput, error);
    return new Date(); // Return current date as fallback
  }
};

export const getCurrentFormattedDate = (): string => {
  return formatDateConsistent(new Date());
};

export const formatTimeAgo = (date: Date | string | number | undefined | null): string => {
  try {
    const dateObj = typeof date === 'string' ? parseDateString(date) : 
                    typeof date === 'number' ? new Date(date) :
                    date instanceof Date ? date : new Date();
    
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'Baru saja';
    if (diffMinutes < 60) return `${diffMinutes} menit yang lalu`;
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    if (diffDays < 7) return `${diffDays} hari yang lalu`;
    
    return formatDateConsistent(dateObj);
  } catch (error) {
    console.error('Error calculating time ago:', date, error);
    return 'Tidak diketahui';
  }
};