export async function submitContactForm(data) {
  console.log('[Axen Contact Service] Submitting lead payload:', data);

  const apiUrl = import.meta.env.VITE_CONTACT_API_URL;
  if (apiUrl && apiUrl !== 'https://api.example.com/contact') {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Submission failed with status: ${response.status}`);
    }

    return await response.json();
  }

  await new Promise((resolve) => setTimeout(resolve, 900));

  return {
    success: true,
    message: 'Thank you! We will get back to you within 5 hours.',
    receivedAt: new Date().toISOString(),
  };
}

export default submitContactForm;
