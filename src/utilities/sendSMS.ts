export const sendSMS = async (number: string, message: string) => {
  const apiKey = process.env.BULKSMSBD_API_KEY
  const senderId = process.env.BULKSMSBD_SENDER_ID

  if (!apiKey || !senderId) {
    console.warn('BULKSMSBD credentials missing in .env. Skipping SMS.')
    return
  }

  // Format number (bulk SMS bd usually requires 880 prefix)
  let formattedNumber = number.replace(/\D/g, '') // remove non-digits
  if (formattedNumber.startsWith('01')) {
    formattedNumber = '88' + formattedNumber
  }

  try {
    const url = new URL('http://bulksmsbd.net/api/smsapi')
    url.searchParams.append('api_key', apiKey)
    url.searchParams.append('type', 'text')
    url.searchParams.append('number', formattedNumber)
    url.searchParams.append('senderid', senderId)
    url.searchParams.append('message', message)

    const res = await fetch(url.toString(), {
      method: 'GET'
    })

    const responseText = await res.text()
    console.log(`[BulkSMSBD] Response for ${formattedNumber}:`, responseText)
    return responseText
  } catch (error) {
    console.error('[BulkSMSBD] Error sending SMS:', error)
  }
}
