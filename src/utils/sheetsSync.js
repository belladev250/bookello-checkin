// src/utils/sheetsSync.js
const SHEETS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwTeYUzqbfS0UR_yE60EJAKBEVCMkIgatHR0GkdtOVvJ5fsH98wPSBKerosrlY75yKu/exec';

export async function syncToSheets(hotelData) {
  return new Promise((resolve, reject) => {
    const callbackName = 'sheetsCallback_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const script = document.createElement('script');
    

    window[callbackName] = (response) => {
      delete window[callbackName];
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      
      if (response && response.success) {
        console.log('✅ Sheets sync successful:', response);
        resolve(response);
      } else {
        console.error('❌ Sheets sync failed:', response);
        reject(new Error(response?.error || 'Sheets sync failed'));
      }
    };
    
    const url = `${SHEETS_WEB_APP_URL}?callback=${callbackName}&data=${encodeURIComponent(JSON.stringify(hotelData))}`;
    script.src = url;
    
    script.onerror = () => {
      delete window[callbackName];
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      reject(new Error('Failed to load Google Apps Script'));
    };
    
    // Add timeout
    setTimeout(() => {
      if (window[callbackName]) {
        delete window[callbackName];
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
        reject(new Error('Sheets sync timeout'));
      }
    }, 15000);
    
    console.log('📤 Sending to Sheets:', hotelData);
    document.head.appendChild(script);
  });
}

// Simple function to sync guest data
export async function syncGuestToSheets(guestData) {
  const dataWithType = {
    type: 'guest',
    guestName: guestData.guestName,
    email: guestData.email,
    phone: guestData.phone,
    nationality: guestData.nationality
  };
  
  return syncToSheets(dataWithType);
}

// Keep existing hotel sync function
export async function syncHotelToSheets(hotelData) {
  return syncToSheets(hotelData);
}