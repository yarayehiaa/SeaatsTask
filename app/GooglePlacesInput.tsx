import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { GooglePlaceDetail, GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Icon from 'react-native-vector-icons/MaterialIcons';




//input from index.tsx
type GooglePlacesInputProps = {
  placeholder: string;
  onPlaceSelected: (data: any, details: GooglePlaceDetail | null) => void;
  iconName: string;
};



const GooglePlacesInput: React.FC<GooglePlacesInputProps> = ({ placeholder, onPlaceSelected, iconName }) => {
  return (
    <View style={styles.inputRow}>
      <View style={styles.iconLeftContainer}>
        <Icon name={iconName} size={24} color="#5e08c4" />
      </View>
      <GooglePlacesAutocomplete
        placeholder={placeholder}
        fetchDetails
        onPress={onPlaceSelected}
        query={{
          //privated key to enhance security
          key: process.env.EXPO_PUBLIC_API_KEY,
          language: 'en',
          components: 'country:eg',
        }}
        styles={{
          textInputContainer: styles.inputContainer,
          textInput: styles.textInput,
          listView: styles.listView,
          row: styles.row,
          description: styles.description,
          predefinedPlacesDescription: styles.predefinedPlacesDescription,
          separator: styles.separator,
          poweredContainer: styles.poweredContainer,
          powered: styles.powered,
        }}
        filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']}
        renderRow={(data) => (
          <View style={styles.row}>
            <Icon name="place" size={24} color="#5e08c4" style={styles.suggestionIcon} />
            <View style={{flex:1, flexWrap:'wrap',flexDirection:'column'}}>
            <Text style={styles.description}>{data.structured_formatting.main_text}</Text>
            </View>
          </View>
        )}
        onFail={(error) => console.error(error)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    paddingVertical: 5,
  },
  iconLeftContainer: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderRightWidth: 1,
    borderRightColor: '#5e08c4',
  },
  inputContainer: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    flex: 1,
  },
  textInput: {
    height: 40,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    borderColor: 'transparent',
  },
  listView: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    marginTop: 10,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#5e08c4',
  },
  row: {
    backgroundColor: '#f8f8f8',
    padding: 10,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#f8f8f8',
    alignItems: 'center',
    flex: 1,
    
    
     // Ensure the row itself wraps
  },
  description: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    
    
    
  },
  predefinedPlacesDescription: {
    color: '#1faadb',
    flex: 1,
    flexWrap: 'wrap'
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  poweredContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 5,
  },
  powered: {
    color: '#999',
  },
  suggestionIcon: {
    marginRight: 10,
  },
});

export default GooglePlacesInput;
