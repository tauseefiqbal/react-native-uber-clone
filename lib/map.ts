import { Driver, MarkerData } from "@/types/type";

const directionsAPI = process.env.EXPO_PUBLIC_DIRECTIONS_API_KEY;

const getRouteDurationSeconds = async ({
  originLatitude,
  originLongitude,
  destinationLatitude,
  destinationLongitude,
}: {
  originLatitude: number;
  originLongitude: number;
  destinationLatitude: number;
  destinationLongitude: number;
}) => {
  if (!directionsAPI) {
    return 0;
  }

  const routeRequest = {
    origin: {
      location: {
        latLng: {
          latitude: originLatitude,
          longitude: originLongitude,
        },
      },
    },
    destination: {
      location: {
        latLng: {
          latitude: destinationLatitude,
          longitude: destinationLongitude,
        },
      },
    },
    travelMode: "DRIVE",
    routingPreference: "TRAFFIC_AWARE_OPTIMAL",
    languageCode: "en-US",
  };

  try {
    const response = await fetch(
      "https://routes.googleapis.com/directions/v2:computeRoutes",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": directionsAPI,
          "X-Goog-FieldMask": "routes.duration",
        },
        body: JSON.stringify(routeRequest),
      },
    );

    if (!response.ok) {
      throw new Error(`Routes API error: ${response.status}`);
    }

    const data = await response.json();
    const durationValue = data.routes?.[0]?.duration ?? "0s";
    return Number.parseFloat(durationValue.replace(/s$/, "")) || 0;
  } catch (error) {
    console.warn(
      "Routes API failed, falling back to legacy directions API:",
      error,
    );

    const legacyResponse = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${originLatitude},${originLongitude}&destination=${destinationLatitude},${destinationLongitude}&key=${directionsAPI}`,
    );
    const legacyData = await legacyResponse.json();
    return legacyData.routes?.[0]?.legs?.[0]?.duration?.value ?? 0;
  }
};

export const generateMarkersFromData = ({
  data,
  userLatitude,
  userLongitude,
}: {
  data: Driver[];
  userLatitude: number;
  userLongitude: number;
}): MarkerData[] => {
  return data.map((driver) => {
    const latOffset = (Math.random() - 0.5) * 0.01; // Random offset between -0.005 and 0.005
    const lngOffset = (Math.random() - 0.5) * 0.01; // Random offset between -0.005 and 0.005

    return {
      latitude: userLatitude + latOffset,
      longitude: userLongitude + lngOffset,
      title: `${driver.first_name} ${driver.last_name}`,
      ...driver,
    };
  });
};

export const calculateRegion = ({
  userLatitude,
  userLongitude,
  destinationLatitude,
  destinationLongitude,
}: {
  userLatitude: number | null;
  userLongitude: number | null;
  destinationLatitude?: number | null;
  destinationLongitude?: number | null;
}) => {
  if (!userLatitude || !userLongitude) {
    return {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }

  if (!destinationLatitude || !destinationLongitude) {
    return {
      latitude: userLatitude,
      longitude: userLongitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }

  const minLat = Math.min(userLatitude, destinationLatitude);
  const maxLat = Math.max(userLatitude, destinationLatitude);
  const minLng = Math.min(userLongitude, destinationLongitude);
  const maxLng = Math.max(userLongitude, destinationLongitude);

  const latitudeDelta = (maxLat - minLat) * 1.3; // Adding some padding
  const longitudeDelta = (maxLng - minLng) * 1.3; // Adding some padding

  const latitude = (userLatitude + destinationLatitude) / 2;
  const longitude = (userLongitude + destinationLongitude) / 2;

  return {
    latitude,
    longitude,
    latitudeDelta,
    longitudeDelta,
  };
};

export const calculateDriverTimes = async ({
  markers,
  userLatitude,
  userLongitude,
  destinationLatitude,
  destinationLongitude,
}: {
  markers: MarkerData[];
  userLatitude: number | null;
  userLongitude: number | null;
  destinationLatitude: number | null;
  destinationLongitude: number | null;
}) => {
  if (
    !userLatitude ||
    !userLongitude ||
    !destinationLatitude ||
    !destinationLongitude
  )
    return;

  try {
    const timesPromises = markers.map(async (marker) => {
      const timeToUser = await getRouteDurationSeconds({
        originLatitude: marker.latitude,
        originLongitude: marker.longitude,
        destinationLatitude: userLatitude,
        destinationLongitude: userLongitude,
      });

      const timeToDestination = await getRouteDurationSeconds({
        originLatitude: userLatitude,
        originLongitude: userLongitude,
        destinationLatitude,
        destinationLongitude,
      });

      const totalTime = (timeToUser + timeToDestination) / 60;
      const price = (totalTime * 0.5).toFixed(2);

      return { ...marker, time: totalTime, price };
    });

    return await Promise.all(timesPromises);
  } catch (error) {
    console.error("Error calculating driver times:", error);
  }
};
