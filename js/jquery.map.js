var Location;
$(function () {

    'use strict';

    Location = function ( obj ) {

        //private properties
        var _self = this,
            _obj = obj,
            _lat = _obj.attr( 'data-lat' ),
            _lng = _obj.attr( 'data-lng' ),
            _myLatLng = {lat: parseFloat( _lat ), lng: parseFloat( _lng )},
            _wherePopup = $( '.where__popup' ),
            _where__labels = $( '.where__labels' ),
            _map = null,
            _scroll = null,
            _window = $( window ),
            delta = 3.3,
            deltaY = 1.4,
            markerZoom = 10;

        _self.markers = [];
        _self.bounds = [];

        //private methods
        var _addEvents = function () {

                $(_where__labels).on( 'click', '.label', function () {
                    var location_id = $( this ).data( 'id' );

                    if ( location_id > 0 ) {
                        _hideAllInfo();
                        _checkPlacemerk( location_id );
                    }
                });

            },
            _checkPlacemerk = function ( id ) {
                var place = _findPlacemark( id );
                if ( place !== false ) {
                    if ( _window.width() >= 767 ) {
                        _map.panTo({
                            lat: place.getPosition().lat(),
                            lng: place.getPosition().lng() - delta / markerZoom
                        });
                    } else {
                        _map.panTo({
                            lat: place.getPosition().lat() - deltaY / markerZoom,
                            lng: place.getPosition().lng()
                        });
                    }
                    _map.setZoom( markerZoom );
                    place.info.open(_map, place);
                }
            },
            _findPlacemark = function ( id ) {
                for ( var i = 0; i < _self.markers.length; i++ ) {
                    if ( _self.markers[ i ].id == id ) {
                        return _self.markers[ i ];
                    }
                }
                return false;
            },
            _getLocations = function ( map, data, container ) {

                _self.data = data || JSON.parse( _obj.attr( 'data-map' ) ).locations;

                $.each( _self.data, function ( i ) {

                    var curLatLng = new google.maps.LatLng( this.coordinates[ 0 ], this.coordinates[ 1 ] );
                    _self.bounds.extend( curLatLng );
                    var place = new google.maps.Marker({
                        position: curLatLng,
                        map: map,
                        icon: {
                            url: this.icon,
                            size: new google.maps.Size( 40, 47 ),
                            origin: new google.maps.Point( 0, 0 ),
                            anchor: new google.maps.Point( 20, 59 )
                        },
                        title: this.title
                    });

                    place.id = this.id;
                    place.color = this.color;
                    place.desc = this.description;
                    if (data !== null) {
                        place._new = true;
                    }
                    place.info = new google.maps.InfoWindow( {
                        content: this.description
                    });

                    _showAllLocations( this );
                    container.push( place );
                    _setInfoWindow( i, place );

                });
                map.fitBounds( _self.bounds );
            },
            _hideAllInfo = function () {
                for ( var i = 0; i < _self.markers.length; i++ ) {
                    _self.markers[ i ].info.close();
                }
            },
            _initMap = function () {

                _map = new google.maps.Map( _obj[ 0 ], {
                    zoom: 10,
                    center: _myLatLng,
                    scrollwheel: false,
                    draggable: true
                });

                _self.bounds = new google.maps.LatLngBounds();
                    _getLocations( _map, null, _self.markers );
            },
            _initScroll = function () {
                if ( _scroll == null )
                    _scroll = _wherePopup.find( '.where__layout' ).niceScroll( {
                        cursorcolor: "#ebebeb",
                        cursoropacitymin: "1",
                        cursorborderradius: "0",
                        cursorborder: "none",
                        cursorwidth: "4",
                        enablemousewheel: true
                    });

            },
            _setInfoWindow = function ( index, place ) {
                google.maps.event.addListener( place, 'click', function (e) {
                    _checkPlacemerk( place.id );
                    place.info.open( _map, place );
                    return false;
                });
            },
            _showAllLocations = function ( data ) {
                var listLocations = '';
                listLocations += '<span class="label label_big" style="color: ' + data.color + '" data-id="' + data.id + '">' + data.title + '</span>';
                _where__labels.append( listLocations );
            },
            _init = function () {
                _initMap();
                _addEvents();
                _initScroll();
            };

        _init();
    };


});

var initMap = function () {
    new Location( $( '#map' ) );
};


