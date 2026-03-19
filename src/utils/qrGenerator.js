import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'

export const generateQRCode = async (hotelId, hotelName) => {
  const checkinUrl = `${window.location.origin}/checkin/${hotelId}`
  
  try {
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(checkinUrl)}`
    
    await updateDoc(doc(db, 'hotels', hotelId), {
      qrCode: qrCodeUrl,
      checkinUrl: checkinUrl,
      updatedAt: new Date()
    })
    
    return qrCodeUrl
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw error
  }
}

export const downloadQRPoster = async (hotelId, hotelName) => {
  try {
    const hotelDoc = await getDoc(doc(db, 'hotels', hotelId))
    if (!hotelDoc.exists()) throw new Error('Hotel not found')
    
    const hotelData = hotelDoc.data()
    const qrCodeUrl = hotelData.qrCode
    
    // Create a canvas for the poster
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = 600
    canvas.height = 800
    
    // Background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Title
    ctx.fillStyle = '#1f2937'
    ctx.font = 'bold 28px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(hotelName, canvas.width / 2, 60)
    
    // Subtitle
    ctx.fillStyle = '#6b7280'
    ctx.font = '18px Arial'
    ctx.fillText('Self Check-In', canvas.width / 2, 90)
    
    // QR Code
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = qrCodeUrl
    
    await new Promise((resolve) => {
      img.onload = resolve
    })
    
    ctx.drawImage(img, canvas.width / 2 - 150, 120, 300, 300)
    
    // Instructions
    ctx.fillStyle = '#374151'
    ctx.font = '16px Arial'
    ctx.fillText('Scan to check-in', canvas.width / 2, 450)
    
    // Footer
    ctx.fillStyle = '#9ca3af'
    ctx.font = '14px Arial'
    ctx.fillText('Powered by Bookello', canvas.width / 2, canvas.height - 30)
    
    // Download
    const link = document.createElement('a')
    link.download = `checkin-poster-${hotelName}.png`
    link.href = canvas.toDataURL()
    link.click()
    
  } catch (error) {
    console.error('Error generating poster:', error)
    throw error
  }
}