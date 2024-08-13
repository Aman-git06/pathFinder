var map = L.map('map').setView([28.6129, 77.2295], 11);
		var mapLink = "<a href='http://openstreetmap.org'>OpenStreetMap</a>";
		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			attribution: 'Leaflet &copy; ' + mapLink + ', contribution',
			maxZoom: 18
		}).addTo(map);

		var taxiIcon = L.icon({
			iconUrl: '/people.png',
			iconSize: [70, 70]
		});

		var marker = L.marker([28.6129, 77.2295], { icon: taxiIcon }).addTo(map);

		function geocodeLocation(location, callback) {
			var apiKey = 'apikey'; 
			var url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${apiKey}`;

			fetch(url)
				.then(response => response.json())
				.then(data => {
					if (data.results && data.results.length > 0) {
						var latLng = data.results[0].geometry;
						callback(L.latLng(latLng.lat, latLng.lng));
					} else {
						alert('Location not found');
					}
				})
				.catch(error => {
					console.error('Error:', error);
					alert('Failed to geocode location');
				});
		}

		function calculateRoute() {
			var startLocation = document.getElementById('startLocation').value;
			var endLocation = document.getElementById('endLocation').value;

			if (!startLocation || !endLocation) {
				alert('Please enter valid locations.');
				return;
			}

			geocodeLocation(startLocation, function (startLatLng) {
				geocodeLocation(endLocation, function (endLatLng) {
					L.Routing.control({
						waypoints: [
							startLatLng,
							endLatLng
						]
					}).on('routesfound', function (e) {
						var routes = e.routes;
						console.log(routes);

						e.routes[0].coordinates.forEach(function (coord, index) {
							setTimeout(function () {
								marker.setLatLng([coord.lat, coord.lng]);
							}, 100 * index);
						});
					}).addTo(map);
				});
			});
		}