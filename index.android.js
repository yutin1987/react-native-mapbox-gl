import React, { PropTypes, Component } from 'react';
import {
  NativeModules,
  requireNativeComponent,
  View,
} from 'react-native';
import _ from 'lodash';

const { MapboxGLManager } = NativeModules;

class MapView extends Component {

  static propTypes = {
    accessToken: PropTypes.string.isRequired,
    attributionButtonIsHidden: PropTypes.bool,
    logoIsHidden: PropTypes.bool,
    annotations: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string,
      subtitle: PropTypes.string,
      coordinates: PropTypes.array.isRequired,
      alpha: PropTypes.number,
      fillColor: PropTypes.string,
      strokeColor: PropTypes.string,
      strokeWidth: PropTypes.number,
    })),
    centerCoordinate: PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
    }),
    centerCoordinateZoom: PropTypes.shape(),
    debugActive: PropTypes.bool,
    direction: PropTypes.number,
    rotateEnabled: PropTypes.bool,
    scrollEnabled: PropTypes.bool,
    showsUserLocation: PropTypes.bool,
    styleURL: PropTypes.string,
    userTrackingMode: PropTypes.number,
    zoomEnabled: PropTypes.bool,
    zoomLevel: PropTypes.number,
    tilt: PropTypes.number,
    compassIsHidden: PropTypes.bool,
    onRegionChange: PropTypes.func,
    onOpenAnnotation: PropTypes.func,
    onLongPress: PropTypes.func,
    onUserLocationChange: PropTypes.func,
    ...View.propTypes,
  }

  defaultProps = {
    centerCoordinate: {
      latitude: 0,
      longitude: 0,
    },
    debugActive: false,
    direction: 0,
    rotateEnabled: true,
    scrollEnabled: true,
    showsUserLocation: false,
    styleURL: MapboxGLManager.mapStyles.streets,
    userTrackingMode: MapboxGLManager.userTrackingMode.none,
    zoomEnabled: true,
    zoomLevel: 0,
    tilt: 0,
    compassIsHidden: false,
  }

  onRegionChange = (event: Event) => {
    if (this.isMove === false) {
      this.isMove = true;

      if (this.props.onRegionWillChange) this.props.onRegionWillChange(event.nativeEvent.src);
    }

    this.onRegionChangeDebounce(event.nativeEvent.src);
  }

  onRegionWillChange = (event: Event) => {
    // To Do
  }

  onUserLocationChange = (event: Event) => {
    if (this.props.onUserLocationChange) this.props.onUserLocationChange(event.nativeEvent.src);
  }

  onOpenAnnotation = (event: Event) => {
    if (this.props.onOpenAnnotation) this.props.onOpenAnnotation(event.nativeEvent.src);
  }

  onLongPress = (event: Event) => {
    if (this.props.onLongPress) this.props.onLongPress(event.nativeEvent.src);
  }

  onRegionChangeDebounce = _.debounce((src) => {
    this.isMove = false;

    if (this.props.onRegionChange) this.props.onRegionChange(src);
  }, 500);

  isMove = false;

  render() {
    return (
      <MapboxGLView
        {...this.props}
        onRegionChange={this.onRegionChange}
        onRegionWillChange={this.onRegionWillChange}
        onUserLocationChange={this.onUserLocationChange}
        onOpenAnnotation={this.onOpenAnnotation}
        onLongPress={this.onLongPress}
      />
    );
  }
}

const MapboxGLView = requireNativeComponent('RCTMapbox', MapView);

module.exports = MapView;
