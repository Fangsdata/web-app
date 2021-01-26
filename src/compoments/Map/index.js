import React from 'react';
import { Map, Marker, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { number } from 'prop-types';

class MapContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      zoom: 4,
    };
  }

  render() {
    const { zoom } = this.state;
    const { lat, lng } = this.props;

    const position = [lat, lng];
    // const customMarker = L.icon({ iconUrl: require('./place-24px.svg') });
    return (
      <Map center={position} zoom={zoom}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} />
      </Map>
    );
  }
}

MapContainer.propTypes = {
  lat: number.isRequired,
  lng: number.isRequired,
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
