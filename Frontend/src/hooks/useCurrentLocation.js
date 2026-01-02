import { useState, useEffect } from "react";


const useCurrentLocation = () => {
    const [location, setLocation] = useState(null);

    useEffect(() => {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
        (position) => {
            setLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
            console.error("Error getting location:", error);
            // fallback to default location if user denies permission
            setLocation([6.03391, 116.11749]); // Example: UMS
        }
        );
    }, []);


    return location;
};

export default useCurrentLocation