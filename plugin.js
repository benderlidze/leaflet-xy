const MyBoxClass = L.Class.extend({
  options: {
    width: 1,
    height: 1
  },
  initialize: function (name, options) {

    console.log(options);
    this.name = name;
    this.polygons = [];
    L.setOptions(this, options);

    const {
      x,
      y,
      imageUrl
    } = options
    var yx = L.latLng;
    var xy = function (x, y) {
      if (L.Util.isArray(x)) { // When doing xy([x, y]);
        return yx(x[1], x[0]);
      }
      return yx(y, x); // When doing xy(x, y);
    };

    var bounds = [xy(0, 0), xy(x, y)];
    var image = L.imageOverlay(imageUrl, bounds).addTo(map);
    map.setView(xy(x / 2, y / 2), -1);

  },

  uploadData: function (x, y, polygonsData) {
    polygonsData.forEach(i => {
      const p = i.points.split("- ").map(s => +s)
      if (p.length > 0) {
        const poly = _.chunk(p, 2)
          .map(a => a.reverse())
          .map(a => {
            return [y - a[0], a[1]]
          })
        const polygon = L.polygon(poly, {
          color: 'red',
          polygonId: i.polygonName,
          roomName: i.roomName
        })
        this.polygons.push(polygon)
      }
    });
  },

  isXYInsidePolygon: function (x, y, poly) {
    var inside = false;
    for (var ii = 0; ii < poly.getLatLngs().length; ii++) {
      var polyPoints = poly.getLatLngs()[ii];
      for (var i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
        var xi = polyPoints[i].lat,
          yi = polyPoints[i].lng;
        var xj = polyPoints[j].lat,
          yj = polyPoints[j].lng;

        var intersect = ((yi > y) != (yj > y)) &&
          (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
      }
    }
    return inside;
  },

  findByXY: function (x, y) {
    console.log("polygons", x, y, this.polygons);
    return this.polygons.filter(poly => {
      const inside = this.isXYInsidePolygon(x, y, poly);
      //console.log('inside', inside);
      if (inside) {
        return poly
      }
    })
  },
  
  findByID: function (id) {
    return this.polygons.filter(poly => {
      return poly.options.polygonId === id
    })
  }
});