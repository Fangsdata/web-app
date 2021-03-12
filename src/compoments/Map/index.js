import React from 'react';
import { Map, Marker, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { array, number } from 'prop-types';

class MapContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      zoom: 4,
    };
  }

  render() {
    const { zoom } = this.state;
    const { mapData } = this.props;

    // const customMarker = L.icon({ iconUrl: require('./place-24px.svg') });
    return (
      <Map center={mapData[0]} zoom={zoom}>
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}"
        />
        {mapData.map((position)=>(
          <Marker position={position} />
        ))}
      </Map>
    );
  }
}

MapContainer.propTypes = {
  mapData : array.isRequired
};


export default MapContainer;

/* eslint-disable */
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});
/* eslint-enable */
