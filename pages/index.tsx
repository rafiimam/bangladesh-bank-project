import { useState } from 'react';
import styles from '../styles/Home.module.css'; // Import CSS module

const Home = () => {
    const [branchCode, setBranchCode] = useState('');
    const [subBranchCode, setSubBranchCode] = useState('');
    const [renownedPlace, setRenownedPlace] = useState('');
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [submitted, setSubmitted] = useState(false); // State to track submission
    const [locationError, setLocationError] = useState<string>(''); // State for error message

    const getCurrentLocation = () => {
        setLocationError(''); // Clear previous error messages
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                setLatitude(lat);
                setLongitude(lng);
                setLocationError(''); // Clear any error message on success
            }, (error) => {
                console.error('Error obtaining location:', error);
                setLocationError('Unable to retrieve your location. Please try again.');
            });
        } else {
            setLocationError('Geolocation is not supported by this browser.');
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const data = {
            branchCode,
            subBranchCode,
            renownedPlace,
            latitude,
            longitude,
        };

        const response = await fetch('/api/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            setSubmitted(true); // Set submitted to true on successful submission
            // Reset form fields but keep latitude and longitude
            setBranchCode('');
            setSubBranchCode('');
            setRenownedPlace('');
        } else {
            alert('Error submitting data');
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Branch Information</h1>
            {submitted ? (
                <div className={styles.successMessage}>
                    <h2>Data Saved Successfully!</h2>
                    <p>Thank you for your submission.</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                    <label className={styles.label}>
                        Branch Code:
                        <input
                            type="text"
                            value={branchCode}
                            onChange={(e) => setBranchCode(e.target.value)}
                            className={styles.input}
                        />
                    </label>
                    <br />

                    <label className={styles.label}>
                        Sub Branch Code:
                        <input
                            type="text"
                            value={subBranchCode}
                            onChange={(e) => setSubBranchCode(e.target.value)}
                            className={styles.input}
                        />
                    </label>
                    <br />

                    <label className={styles.label}>
                        Renowned Place:
                        <input
                            type="text"
                            value={renownedPlace}
                            onChange={(e) => setRenownedPlace(e.target.value)}
                            className={styles.input}
                        />
                    </label>
                    <br />

                    <button type="button" onClick={getCurrentLocation} className={styles.button}>
                        Get Current Location
                    </button>
                    <br />

                    {latitude !== null && longitude !== null ? (
                        <div className={styles.locationDisplay}>
                            <h3>Coordinates:</h3>
                            <p>Latitude: {latitude}</p>
                            <p>Longitude: {longitude}</p>
                        </div>
                    ) : (
                        <div className={styles.errorMessage}>
                            {locationError && <p>{locationError}</p>}
                        </div>
                    )}

                    <input type="hidden" value={latitude ?? ''} />
                    <input type="hidden" value={longitude ?? ''} />

                    <button type="submit" className={styles.submitButton} disabled={latitude === null || longitude === null}>
                        Submit
                    </button>
                </form>
            )}
        </div>
    );
};

export default Home;
