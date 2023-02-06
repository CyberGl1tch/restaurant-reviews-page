
//Caclulated distance in km
export function calculateDistanceBetweenPoints(source, destination) {
        return google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(source.lat, source.long),
            new google.maps.LatLng(destination.lat, destination.long)
        );
}