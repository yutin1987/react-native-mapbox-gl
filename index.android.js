/* eslint import/no-unresolved: [2, { ignore: ['react', 'react-native'] }] */

import React, { PropTypes } from 'react';

import {
  View,
  NativeModules,
  requireNativeComponent,
  findNodeHandle,
} from 'react-native';

const { MapboxGLManager } = NativeModules;
const {
  mapStyles,
  userTrackingMode,
  userLocationVerticalAlignment,
  unknownResourceCount,
} = MapboxGLManager;

export { mapStyles, userTrackingMode, userLocationVerticalAlignment, unknownResourceCount };

export default class MapView extends React.Component {

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
    initialCenterCoordinate: PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
    }),
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

  static defaultProps = {
    initialCenterCoordinate: {
      latitude: 0,
      longitude: 0,
    },
    debugActive: false,
    direction: 0,
    rotateEnabled: true,
    scrollEnabled: true,
    showsUserLocation: false,
    styleURL: mapStyles.streets,
    userTrackingMode: userTrackingMode.none,
    zoomEnabled: true,
    zoomLevel: 0,
    tilt: 0,
    compassIsHidden: false,
    onRegionChange: () => {},
    onUserLocationChange: () => {},
    onOpenAnnotation: () => {},
    onLongPress: () => {},
  };

  componentWillMount() {
    const { initialCenterCoordinate } = this.props;
    this.centerCoordinate = initialCenterCoordinate;
  }

  onRegionChange = (event: Event) => {
    this.props.onRegionChange(event.nativeEvent.src);
  }

  onUserLocationChange = (event: Event) => {
    this.props.onUserLocationChange(event.nativeEvent.src);
  }

  onOpenAnnotation = (event: Event) => {
    this.props.onOpenAnnotation(event.nativeEvent.src);
  }

  onLongPress = (event: Event) => {
    this.props.onLongPress(event.nativeEvent.src);
  }

  setCamera(latitude, longitude, fromDistance, pitch, direction, duration = 1.0) {
    MapboxGLManager.setCameraAnimated(
      findNodeHandle(this),
      latitude,
      longitude,
      fromDistance,
      pitch,
      direction,
      duration
    );
  }

  setCenterCoordinate(latitude, longitude) {
    MapboxGLManager.setCenterCoordinateAnimated(
      findNodeHandle(this),
      parseFloat(Math.round(latitude * 1000000) / 1000000),
      parseFloat(Math.round(longitude * 1000000) / 1000000)
    );
  }

  setVisibleCoordinateBounds(
    latitudeSW,
    longitudeSW,
    latitudeNE,
    longitudeNE,
    paddingTop = 0,
    paddingRight = 0,
    paddingBottom = 0,
    paddingLeft = 0
  ) {
    MapboxGLManager.setVisibleCoordinateBounds(
      findNodeHandle(this),
      latitudeSW,
      longitudeSW,
      latitudeNE,
      longitudeNE,
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft
    );
  }

  getCenterCoordinateZoomLevel(callback) {
    MapboxGLManager.getCenterCoordinateZoomLevel(findNodeHandle(this), callback);
  }

  getDirection(callback) {
    MapboxGLManager.getDirection(findNodeHandle(this), callback);
  }
  getBounds(callback) {
    MapboxGLManager.getBounds(findNodeHandle(this), callback);
  }

  selectAnnotation(annotationId, animated = true) {
    MapboxGLManager.selectAnnotationAnimated(findNodeHandle(this), annotationId, animated);
  }

  centerCoordinate = {
    latitude: 0,
    longitude: 0,
  };

  render() {
    return (
      <MapboxGLView
        {...this.props}
        centerCoordinate={this.centerCoordinate}
        onRegionChange={this.onRegionChange}
        onUserLocationChange={this.onUserLocationChange}
        onOpenAnnotation={this.onOpenAnnotation}
        onLongPress={this.onLongPress}
      />
    );
  }
}

const MapboxGLView = requireNativeComponent('RCTMapbox', MapView);
