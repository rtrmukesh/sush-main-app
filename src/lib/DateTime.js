
import moment from "moment";


class DatTime {
    static formatedDate(date) {
        return moment(date).format("DD-MMM-YYYY hh:mm A");
      }
    static formatDuration  (seconds)  {
        const hrs = Math.floor(seconds / 3600); // Calculate total hours
        const mins = Math.floor((seconds % 3600) / 60); // Calculate remaining minutes
        const secs = seconds % 60; // Remaining seconds
      
        // Format the output string
        const formattedDuration = [
          hrs > 0 ? `${hrs} hr${hrs > 1 ? 's' : ''}` : null,
          mins > 0 ? `${mins} min${mins > 1 ? 's' : ''}` : null,
          `${secs} sec${secs > 1 ? 's' : ''}`
        ]
          .filter(Boolean) // Remove null values for cleaner output
          .join(' '); // Join all components with space
      
        return formattedDuration;
      };
}

export default DatTime