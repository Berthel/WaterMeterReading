export async function uploadMeterImage(formData: FormData) {
  const response = await fetch(
    process.env.NEXT_PUBLIC_WEBHOOK_UPLOAD_URL!,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }

  const contentType = response.headers.get("content-type");
  let data;

  try {
    if (contentType?.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = JSON.parse(text);
    }
  } catch (parseError) {
    throw new Error("Invalid response format from server");
  }

  if (data.error) {
    throw new Error(data.error);
  }

  if (data.message && !data.Reading) {
    throw new Error(data.message);
  }

  if (!data.Reading) {
    throw new Error("No meter reading detected in the image");
  }

  return data.Reading.toString();
}

export async function submitMeterReading(reading: string, isAutomaticReading: boolean) {
  const response = await fetch(
    process.env.NEXT_PUBLIC_WEBHOOK_SUBMIT_URL!,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reading,
        isAutomaticReading,
        timestamp: new Date().toISOString(),
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to submit reading");
  }

  return response;
}