var array_dist = [];

$('.btn').on("click", function() {
    var name = $('#name').val();
    var lat = $('#lat').val();
    var lon = $('#lon').val();
    var position = lat + "," + lon;
    window.localStorage.setItem(name, position);

});

navigator.geolocation.getCurrentPosition(onLocation);

function onLocation(position) {
    position = position.coords.latitude + ',' + position.coords.longitude
    console.log(position)
    for (i = 0; i < localStorage.length; i++) {
        var lat1 = window.localStorage.getItem(localStorage.key(i)).split(',')[0];
        var lon1 = window.localStorage.getItem(localStorage.key(i)).split(',')[1];
        var lat2 = position.split(',')[0];
        var lon2 = position.split(',')[1];
        array_dist.push(distance(lat1, lon1, lat2, lon2, 'K'))
    }

    var min_pos = array_dist.indexOf(Math.min.apply(null, array_dist))
    console.log("El cine más cercano es " + localStorage.key(min_pos))

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: new google.maps.LatLng(position.split(',')[0], position.split(',')[1]),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var infowindow = new google.maps.InfoWindow();

    for (var i = 0; i < localStorage.length; i++) {
        if (i !== min_pos) {
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(Number(localStorage[localStorage.key(i)].split(',')[0]),
                    Number(localStorage[localStorage.key(i)].split(',')[1])),
                map: map,
                icon: 'https://maps.google.com/mapfiles/kml/shapes/' + 'placemark_circle_highlight.png'
            });
        } else {
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(Number(localStorage[localStorage.key(min_pos)].split(',')[0]),
                    Number(localStorage[localStorage.key(min_pos)].split(',')[1])),
                map: map,
                icon: 'https://maps.google.com/mapfiles/kml/shapes/' + 'poi.png'
            });
        }

        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infowindow.setContent(localStorage.key(i));
                infowindow.open(map, marker);
            }
        })(marker, i));
    }

}

function distance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1 / 180
    var radlat2 = Math.PI * lat2 / 180
    var radlon1 = Math.PI * lon1 / 180
    var radlon2 = Math.PI * lon2 / 180
    var theta = lon1 - lon2
    var radtheta = Math.PI * theta / 180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.853159

    return dist
}