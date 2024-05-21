import * as React from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, Alert } from 'react-native';
import MapView, { Polyline, Marker, Region } from 'react-native-maps';
import { GooglePlacesAutocomplete, GooglePlaceDetail } from 'react-native-google-places-autocomplete';
import GooglePlacesInput from './GooglePlacesInput';
import * as Location from 'expo-location';
import Spinner from 'react-native-loading-spinner-overlay';
import { bbox as getBounds } from '@turf/turf';





type MarkerType = {
  latitude: number;
  longitude: number;
  title: string;
};

export default function App() {
  //initial render
  const [region, setRegion] = React.useState<Region>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [markers, setMarkers] = React.useState<(MarkerType | undefined)[]>([]);
  const [userLocation, setUserLocation] = React.useState<MarkerType | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const mapRef = React.useRef<MapView>(null);

//wait for location permissions
  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }
  //init user location
      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        title: 'You are here',
      });
      setIsLoading(false);
    })();
  }, []);

 

  const handleSelectLocation = (data: any, details: GooglePlaceDetail | null, type: 'from' | 'to') => {
    if (!details) return;
  
    const { lat, lng } = details.geometry.location;
    const newMarker: MarkerType = {
      latitude: lat,
      longitude: lng,
      title: data.description,
    };
  
    setMarkers((prevMarkers) => {
      if (type === 'from') {
        
        return [newMarker, prevMarkers[1]];
      } else {
        return [prevMarkers[0], newMarker];
      }
    });

    if (markers.length === 0 && mapRef.current) {
      // change map region to fit the new marker
      mapRef.current.fitToSuppliedMarkers(['from'], {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
      });
    }
  
    if (markers.length === 2 && mapRef.current) {
    
      mapRef.current.fitToSuppliedMarkers(['from', 'to'], {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
      });
    }
  };

 

  return (
    <View style={styles.container}>
       <Spinner
        visible={isLoading}
        textContent={'Seaats'}
        textStyle={styles.spinnerText}
        overlayColor={'#5e08c4'}
        color={'white'}
      />
    <MapView
  ref={mapRef}
  style={styles.map}
  region={region}
  onRegionChangeComplete={(region: any) => setRegion(region)
 }
>
  {userLocation && (
    <Marker
      coordinate={{ latitude: userLocation.latitude, longitude: userLocation.longitude }}
      title={userLocation.title}
      pinColor="#5e08c4" 
      
    />
  )}
  {markers.map((marker, index) => (
    marker && (
      <Marker
        key={index}
        coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
        title={marker.title}
        identifier={index === 0 ? 'from' : 'to'}
        pinColor="#5e08c4"
      />
    )
  ))}
  {markers[0] && markers[1] && (
    <Polyline
      coordinates={markers.map(marker => ({
        latitude: marker!.latitude,
        longitude: marker!.longitude,
      }))}
      strokeWidth={4}
      strokeColor="#2E1760" 
    />
  )}
</MapView>
      <View style={styles.autocompleteContainer}>
        <GooglePlacesInput
          placeholder="From"
          iconName="location-on"
          onPlaceSelected={(data, details) => handleSelectLocation(data, details, 'from')}
        />
        <GooglePlacesInput
          placeholder="To"
          iconName="flag"
          onPlaceSelected={(data, details) => handleSelectLocation(data, details, 'to')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  autocompleteContainer: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    padding: 10,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  spinnerText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
});