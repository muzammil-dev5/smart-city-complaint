import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Location = {
    latitude: number;
    longitude: number;
};

type LocationPickerProps = { value?: Location; onChange: (location: Location) => void; };
const defaultPosition: [number, number] = [24.8607, 67.0011];
const markerIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

const MapCenter = ({ position }: { position: [number, number]; }) => {
    const map = useMap();
    useEffect(() => { map.setView(position); }, [map, position]);
    return null;
};

const LocationMarker = ({ position, onChange }: { position: [number, number] | null; onChange: (location: Location) => void; }) => {
    useMapEvents({
        click(event) {
            const { lat, lng } = event.latlng;
            onChange({
                latitude: lat,
                longitude: lng
            });
        }
    });

    return position ? (
        <Marker
            position={position}
            icon={markerIcon}
        />
    ) : null;
};

const LocationPicker = ({ value, onChange }: LocationPickerProps) => {
    const position: [number, number] | null = value ? [value.latitude, value.longitude] : null;
    const center: [number, number] = position || defaultPosition;

    return (
        <MapContainer
            center={center}
            zoom={13}
            style={{ width: "100%", height: "350px" }}>
            <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapCenter position={center} />
            <LocationMarker
                position={position}
                onChange={onChange}
            />
        </MapContainer>
    );
};

export default LocationPicker;