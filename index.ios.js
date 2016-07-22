/* eslint import/no-unresolved: [2, { ignore: ['react', 'react-native'] }] */

import React, { PropTypes } from 'react';

import {
  NativeModules,
  NativeAppEventEmitter,
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

export function setAccessToken(token: string) {
  MapboxGLManager.setAccessToken(token);
}

// Offline
export function addOfflinePack(options, callback = () => {}) {
  MapboxGLManager.addPackForRegion(options, callback);
}

export function getOfflinePacks(callback) {
  MapboxGLManager.getPacks(callback);
}

export function removeOfflinePack(packName, callback = () => {}) {
  MapboxGLManager.removePack(packName, callback);
}

export function addOfflinePackProgressListener(handler) {
  NativeAppEventEmitter.addListener('MapboxOfflineProgressDidChange', handler);
}

export function addOfflineMaxAllowedTilesListener(handler) {
  NativeAppEventEmitter.addListener('MapboxOfflineMaxAllowedTiles', handler);
}

export function addOfflineErrorListener(handler) {
  NativeAppEventEmitter.addListener('MapboxOfflineError', handler);
}

export default class MapView extends React.Component {

  static propTypes = {
    showsUserLocation: PropTypes.bool,
    rotateEnabled: PropTypes.bool,
    scrollEnabled: PropTypes.bool,
    zoomEnabled: PropTypes.bool,
    accessToken: PropTypes.string.isRequired,
    zoomLevel: PropTypes.number,
    direction: PropTypes.number,
    styleURL: PropTypes.string,
    clipsToBounds: PropTypes.bool,
    debugActive: PropTypes.bool,
    userTrackingMode: PropTypes.number,
    attributionButton: PropTypes.bool,
    initialCenterCoordinate: PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
    }),
    centerCoordinate: PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
    }),
    annotations: PropTypes.arrayOf(PropTypes.shape({
      coordinates: PropTypes.array.isRequired,
      title: PropTypes.string,
      subtitle: PropTypes.string,
      fillAlpha: PropTypes.number,
      fillColor: PropTypes.string,
      strokeAlpha: PropTypes.number,
      strokeColor: PropTypes.string,
      strokeWidth: PropTypes.number,
      id: PropTypes.string,
      type: PropTypes.string.isRequired,
      rightCalloutAccessory: PropTypes.object({
        height: PropTypes.number,
        width: PropTypes.number,
        url: PropTypes.string,
      }),
      annotationImage: PropTypes.object({
        height: PropTypes.number,
        width: PropTypes.number,
        url: PropTypes.string,
      }),
    })),
    attributionButtonIsHidden: PropTypes.bool,
    logoIsHidden: PropTypes.bool,
    compassIsHidden: PropTypes.bool,
    onRegionChange: PropTypes.func,
    onRegionWillChange: PropTypes.func,
    onOpenAnnotation: PropTypes.func,
    onUpdateUserLocation: PropTypes.func,
    onRightAnnotationTapped: PropTypes.func,
    onFinishLoadingMap: PropTypes.func,
    onStartLoadingMap: PropTypes.func,
    onLocateUserFailed: PropTypes.func,
    onLongPress: PropTypes.func,
    onTap: PropTypes.func,
    contentInset: PropTypes.array,
    userLocationVerticalAlignment: PropTypes.number,
    onOfflineProgressDidChange: PropTypes.func,
    onOfflineMaxAllowedMapboxTiles: PropTypes.func,
    onOfflineDidRecieveError: PropTypes.func,
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
    attributionButtonIsHidden: false,
    logoIsHidden: false,
    compassIsHidden: false,
    onRegionChange: () => {},
    onRegionWillChange: () => {},
    onOpenAnnotation: () => {},
    onRightAnnotationTapped: () => {},
    onUpdateUserLocation: () => {},
    onLongPress: () => {},
    onTap: () => {},
    onFinishLoadingMap: () => {},
    onStartLoadingMap: () => {},
    onLocateUserFailed: () => {},
    onOfflineProgressDidChange: () => {},
    onOfflineMaxAllowedMapboxTiles: () => {},
    onOfflineDidRecieveError: () => {},
  };

  componentWillMount() {
    const { initialCenterCoordinate } = this.props;
    this.centerCoordinate = initialCenterCoordinate;
  }

  onRegionChange = (event: Event) => {
    this.props.onRegionChange(event.nativeEvent.src);
  };

  onRegionWillChange = (event: Event) => {
    this.props.onRegionWillChange(event.nativeEvent.src);
  };

  onOpenAnnotation = (event: Event) => {
    this.props.onOpenAnnotation(event.nativeEvent.src);
  };

  onRightAnnotationTapped = (event: Event) => {
    this.props.onRightAnnotationTapped(event.nativeEvent.src);
  };

  onUpdateUserLocation = (event: Event) => {
    this.props.onUpdateUserLocation(event.nativeEvent.src);
  };

  onLongPress = (event: Event) => {
    this.props.onLongPress(event.nativeEvent.src);
  };

  onTap = (event: Event) => {
    this.props.onTap(event.nativeEvent.src);
  };

  onFinishLoadingMap = (event: Event) => {
    this.props.onFinishLoadingMap(event.nativeEvent.src);
  };

  onStartLoadingMap = (event: Event) => {
    this.props.onStartLoadingMap(event.nativeEvent.src);
  };

  onLocateUserFailed = (event: Event) => {
    this.props.onLocateUserFailed(event.nativeEvent.src);
  };

  onOfflineProgressDidChange = (event: Event) => {
    this.props.onOfflineProgressDidChange(event.nativeEvent.src);
  };

  onOfflineMaxAllowedMapboxTiles = (event: Event) => {
    this.props.onOfflineMaxAllowedMapboxTiles(event.nativeEvent.src);
  };

  onOfflineDidRecieveError = (event: Event) => {
    this.props.onOfflineDidRecieveError(event.nativeEvent.src);
  };

  onNativeComponentMount = (ref) => {
    if (this.native === ref) { return; }
    this.native = ref;
  };

  setNativeProps(nativeProps) {
    if (this.native) this.native.setNativeProps(nativeProps);
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

  native = null;

  render() {
    return (
      <MapboxGLView
        {...this.props}
        ref={this.onNativeComponentMount}
        centerCoordinate={this.centerCoordinate}
        onRegionChange={this.onRegionChange}
        onRegionWillChange={this.onRegionWillChange}
        onOpenAnnotation={this.onOpenAnnotation}
        onRightAnnotationTapped={this.onRightAnnotationTapped}
        onUpdateUserLocation={this.onUpdateUserLocation}
        onLongPress={this.onLongPress}
        onTap={this.onTap}
        onFinishLoadingMap={this.onFinishLoadingMap}
        onStartLoadingMap={this.onStartLoadingMap}
        onLocateUserFailed={this.onLocateUserFailed}
        onOfflineProgressDidChange={this.onOfflineProgressDidChange}
        onOfflineMaxAllowedMapboxTiles={this.onOfflineMaxAllowedMapboxTiles}
        onOfflineDidRecieveError={this.onOfflineDidRecieveError}
      />
    );
  }
}

const MapboxGLView = requireNativeComponent('RCTMapboxGL', MapView);
