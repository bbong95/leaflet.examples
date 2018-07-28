---
---

var map, featureList;
var hubSearch = publicSearch = communitySearch = socialSearch = npoSearch = townSearch = altSearch = coSearch = [];

$(window).resize(function() {
  sizeLayerControl();
});

$(document).on("click", ".feature-row", function(e) {
  $(document).off("mouseout", ".feature-row", clearHighlight);
  sidebarClick(parseInt($(this).attr("id"), 10));
});

if ( !("ontouchstart" in window) ) {
  $(document).on("mouseover", ".feature-row", function(e) {
    highlight.clearLayers().addLayer(L.circleMarker([$(this).attr("lat"), $(this).attr("lng")], highlightStyle));
  });
}

$(document).on("mouseout", ".feature-row", clearHighlight);

$("#about-btn").click(function() {
  $("#aboutModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#legend-btn").click(function() {
  $("#legendModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#login-btn").click(function() {
  $("#loginModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#list-btn").click(function() {
  animateSidebar();
  return false;
});

$("#nav-btn").click(function() {
  $(".navbar-collapse").collapse("toggle");
  return false;
});

$("#sidebar-toggle-btn").click(function() {
  animateSidebar();
  return false;
});

$("#sidebar-hide-btn").click(function() {
  animateSidebar();
  return false;
});

function animateSidebar() {
  $("#sidebar").animate({
    width: "toggle"
  }, 350, function() {
    map.invalidateSize();
  });
}

function sizeLayerControl() {
  $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
}

function clearHighlight() {
  highlight.clearLayers();
}

function sidebarClick(id) {
  var layer = markerClusters.getLayer(id);
  map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 17);
  layer.fire("click");
  /* Hide sidebar and go to the map on small screens */
  if (document.body.clientWidth <= 767) {
    $("#sidebar").hide();
    map.invalidateSize();
  }
}

function syncSidebar() {
  /* Empty sidebar features */
  $("#feature-list tbody").empty();
  /* Loop through layers and add only features which are in the map bounds */
  hubs.eachLayer(function (layer) {
    if (map.hasLayer(hubLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="{{ "ex/assets/img/1-hubs.png" | relative_url }}"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  publics.eachLayer(function (layer) {
    if (map.hasLayer(publicLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="{{ "ex/assets/img/2-publics.png" | relative_url }}"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  community.eachLayer(function (layer) {
    if (map.hasLayer(communityLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="{{ "ex/assets/img/3-community.png" | relative_url }}"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  social.eachLayer(function (layer) {
    if (map.hasLayer(socialLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="{{ "ex/assets/img/4-social.png" | relative_url }}"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  npo.eachLayer(function (layer) {
    if (map.hasLayer(npoLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="{{ "ex/assets/img/5-npo.png" | relative_url }}"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  town.eachLayer(function (layer) {
    if (map.hasLayer(townLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="{{ "ex/assets/img/6-town.png" | relative_url }}"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  alt.eachLayer(function (layer) {
    if (map.hasLayer(altLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="{{ "ex/assets/img/7-alt.png" | relative_url }}"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  co.eachLayer(function (layer) {
    if (map.hasLayer(coLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="{{ "ex/assets/img/8-co.png" | relative_url }}"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  /* Update list.js featureList */
  featureList = new List("features", {
    valueNames: ["feature-name"]
  });
  featureList.sort("feature-name", {
    order: "asc"
  });
}

/* Overlay Layers */
var highlight = L.geoJson(null);
var highlightStyle = {
  stroke: false,
  fillColor: "#00FFFF",
  fillOpacity: 0.7,
  radius: 10
};

var epdong = L.geoJson(null, {
  style: function (feature) {
    return {
      color: "purple",
      weight: 2,
      fill: false,
      opacity: 1,
      clickable: false
    };
  }
});
$.getJSON("data/ep-dong.geojson", function (data) {
  epdong.addData(data);
});

$("#full-extent-btn").click(function() {
  map.fitBounds(epdong.getBounds());
  $(".navbar-collapse.in").collapse("hide");
  return false;
});


/* Single marker cluster layer to hold all clusters */
var markerClusters = new L.MarkerClusterGroup({
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true,
  disableClusteringAtZoom: 16
});

/* Empty layer placeholder to add to layer control for listening when to add/remove theaters to markerClusters layer */
var hubLayer = L.geoJson(null);
var hubs = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "{{ "ex/assets/img/1-hubs.png" | relative_url }}",
        iconSize: [48, 48],
        iconAnchor: [12, 28],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.NAME,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>제목</th><td>" + feature.properties.NAME + "</td></tr>" + "<tr><th>전화번호</th><td>" + feature.properties.TEL + "</td></tr>" + "<tr><th>주소</th><td>" + feature.properties.ADDRESS1 + "</td></tr>" + "<tr><th>웹사이트</th><td><a class='url-break' href='" + feature.properties.URL + "' target='_blank'>" + feature.properties.URL + "</a></td></tr>" + "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.NAME);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="{{ "ex/assets/img/1-hubs.png" | relative_url }}"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      hubSearch.push({
        name: layer.feature.properties.NAME,
        address: layer.feature.properties.ADDRESS1,
        source: "hubs",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/1-hub-estate.geojson", function (data) {
  hubs.addData(data);
  map.addLayer(hubLayer);
});


var publicLayer = L.geoJson(null);
var publics = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "{{ "ex/assets/img/2-publics.png" | relative_url }}",
        iconSize: [48, 48],
        iconAnchor: [12, 28],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.NAME,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>제목</th><td>" + feature.properties.NAME + "</td></tr>" + "<tr><th>전화번호</th><td>" + feature.properties.TEL + "</td></tr>" + "<tr><th>주소</th><td>" + feature.properties.ADDRESS1 + "</td></tr>" + "<tr><th>웹사이트</th><td><a class='url-break' href='" + feature.properties.URL + "' target='_blank'>" + feature.properties.URL + "</a></td></tr>" + "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.NAME);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="{{ "ex/assets/img/2-publics.png" | relative_url }}"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      publicSearch.push({
        name: layer.feature.properties.NAME,
        address: layer.feature.properties.ADRESS1,
        source: "publics",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/2-public-institutions.geojson", function (data) {
  publics.addData(data);
  map.addLayer(publicLayer);
});

var communityLayer = L.geoJson(null);
var community = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "{{ "ex/assets/img/3-community.png" | relative_url }}",
        iconSize: [48, 48],
        iconAnchor: [12, 28],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.NAME,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>제목</th><td>" + feature.properties.NAME + "</td></tr>" + "<tr><th>전화번호</th><td>" + feature.properties.TEL + "</td></tr>" + "<tr><th>주소</th><td>" + feature.properties.ADDRESS1 + "</td></tr>" + "<tr><th>웹사이트</th><td><a class='url-break' href='" + feature.properties.URL + "' target='_blank'>" + feature.properties.URL + "</a></td></tr>" + "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.NAME);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="{{ "ex/assets/img/3-community.png" | relative_url }}"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      communitySearch.push({
        name: layer.feature.properties.NAME,
        address: layer.feature.properties.ADRESS1,
        source: "community",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/3-community.geojson", function (data) {
  community.addData(data);
  map.addLayer(communityLayer);
});


var socialLayer = L.geoJson(null);
var social = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "{{ "ex/assets/img/4-social.png" | relative_url }}",
        iconSize: [48, 48],
        iconAnchor: [12, 28],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.NAME,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>제목</th><td>" + feature.properties.NAME + "</td></tr>" + "<tr><th>전화번호</th><td>" + feature.properties.TEL + "</td></tr>" + "<tr><th>주소</th><td>" + feature.properties.ADDRESS1 + "</td></tr>" + "<tr><th>웹사이트</th><td><a class='url-break' href='" + feature.properties.URL + "' target='_blank'>" + feature.properties.URL + "</a></td></tr>" + "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.NAME);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="{{ "ex/assets/img/4-social.png" | relative_url }}"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      socialSearch.push({
        name: layer.feature.properties.NAME,
        address: layer.feature.properties.ADRESS1,
        source: "social",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/4-social-economy.geojson", function (data) {
  social.addData(data);
  map.addLayer(socialLayer);
});


var npoLayer = L.geoJson(null);
var npo = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "{{ "ex/assets/img/5-npo.png" | relative_url }}",
        iconSize: [48, 48],
        iconAnchor: [12, 28],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.NAME,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>제목</th><td>" + feature.properties.NAME + "</td></tr>" + "<tr><th>전화번호</th><td>" + feature.properties.TEL + "</td></tr>" + "<tr><th>주소</th><td>" + feature.properties.ADDRESS1 + "</td></tr>" + "<tr><th>웹사이트</th><td><a class='url-break' href='" + feature.properties.URL + "' target='_blank'>" + feature.properties.URL + "</a></td></tr>" + "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.NAME);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="{{ "ex/assets/img/5-npo.png" | relative_url }}"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      npoSearch.push({
        name: layer.feature.properties.NAME,
        address: layer.feature.properties.ADRESS1,
        source: "npo",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/5-npo-culture.geojson", function (data) {
  npo.addData(data);
  map.addLayer(npoLayer);
});


var townLayer = L.geoJson(null);
var town = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "{{ "ex/assets/img/6-town.png" | relative_url }}",
        iconSize: [48, 48],
        iconAnchor: [12, 28],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.NAME,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>제목</th><td>" + feature.properties.NAME + "</td></tr>" + "<tr><th>전화번호</th><td>" + feature.properties.TEL + "</td></tr>" + "<tr><th>주소</th><td>" + feature.properties.ADDRESS1 + "</td></tr>" + "<tr><th>웹사이트</th><td><a class='url-break' href='" + feature.properties.URL + "' target='_blank'>" + feature.properties.URL + "</a></td></tr>" + "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.NAME);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="{{ "ex/assets/img/6-town.png" | relative_url }}"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      townSearch.push({
        name: layer.feature.properties.NAME,
        address: layer.feature.properties.ADRESS1,
        source: "town",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/6-town.geojson", function (data) {
  town.addData(data);
  map.addLayer(townLayer);
});


var altLayer = L.geoJson(null);
var alt = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "{{ "ex/assets/img/7-alt.png" | relative_url }}",
        iconSize: [48, 48],
        iconAnchor: [12, 28],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.NAME,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>제목</th><td>" + feature.properties.NAME + "</td></tr>" + "<tr><th>전화번호</th><td>" + feature.properties.TEL + "</td></tr>" + "<tr><th>주소</th><td>" + feature.properties.ADDRESS1 + "</td></tr>" + "<tr><th>웹사이트</th><td><a class='url-break' href='" + feature.properties.URL + "' target='_blank'>" + feature.properties.URL + "</a></td></tr>" + "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.NAME);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="{{ "ex/assets/img/7-alt.png" | relative_url }}"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      altSearch.push({
        name: layer.feature.properties.NAME,
        address: layer.feature.properties.ADRESS1,
        source: "alt",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/7-alt-regidential.geojson", function (data) {
  alt.addData(data);
  map.addLayer(altLayer);
});


var coLayer = L.geoJson(null);
var co = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "{{ "ex/assets/img/8-co.png" | relative_url }}",
        iconSize: [48, 48],
        iconAnchor: [12, 28],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.NAME,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>제목</th><td>" + feature.properties.NAME + "</td></tr>" + "<tr><th>전화번호</th><td>" + feature.properties.TEL + "</td></tr>" + "<tr><th>주소</th><td>" + feature.properties.ADDRESS1 + "</td></tr>" + "<tr><th>웹사이트</th><td><a class='url-break' href='" + feature.properties.URL + "' target='_blank'>" + feature.properties.URL + "</a></td></tr>" + "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.NAME);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="{{ "ex/assets/img/8-co.png" | relative_url }}"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      coSearch.push({
        name: layer.feature.properties.NAME,
        address: layer.feature.properties.ADRESS1,
        source: "co",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/8-co-parenting-library.geojson", function (data) {
  co.addData(data);
  map.addLayer(coLayer);
});




map = L.map("map", {
  zoom: 21,
  center: [126.929263, 37.611895],
  crs: L.Proj.CRS.TMS.Naver,
  layers: [epdong, markerClusters, highlight],
  layers: [epdong],
  zoomControl: false,
  attributionControl: false
});

var baseLayers = {
  '네이버 지도': L.Proj.TileLayer.TMS.provider('NaverMap.Street').addTo(map)
};

/* Layer control listeners that allow for a single markerClusters layer */
map.on("overlayadd", function(e) {
  if (e.layer === hubLayer) {
    markerClusters.addLayer(hubs);
  }
  if (e.layer === publicLayer) {
    markerClusters.addLayer(publics);
  }
  if (e.layer === communityLayer) {
    markerClusters.addLayer(community);
  }
  if (e.layer === socialLayer) {
    markerClusters.addLayer(social);
  }
  if (e.layer === npoLayer) {
    markerClusters.addLayer(npo);
  }
  if (e.layer === townLayer) {
    markerClusters.addLayer(town);
  }
  if (e.layer === altLayer) {
    markerClusters.addLayer(alt);
  }
  if (e.layer === coLayer) {
    markerClusters.addLayer(co);
  }
  map.addLayer(markerClusters);
  syncSidebar();
});

map.on("overlayremove", function(e) {
  if (e.layer === hubLayer) {
    markerClusters.removeLayer(hubs);
  }
  if (e.layer === publicLayer) {
    markerClusters.removeLayer(publics);
  }
  if (e.layer === communityLayer) {
    markerClusters.removeLayer(community);
  }
  if (e.layer === socialLayer) {
    markerClusters.removeLayer(social);
  }
  if (e.layer === npoLayer) {
    markerClusters.removeLayer(npo);
  }
  if (e.layer === townLayer) {
    markerClusters.removeLayer(town);
  }
  if (e.layer === altLayer) {
    markerClusters.removeLayer(alt);
  }
  if (e.layer === coLayer) {
    markerClusters.removeLayer(co);
  }
  syncSidebar();
});

/* Filter sidebar feature list to only show features in current map bounds */
map.on("moveend", function (e) {
  syncSidebar();
});

/* Clear feature highlight when map is clicked */
map.on("click", function(e) {
  highlight.clearLayers();
});

/* Attribution control */
function updateAttribution(e) {
  $.each(map._layers, function(index, layer) {
    if (layer.getAttribution) {
      $("#attribution").html((layer.getAttribution()));
    }
  });
}
map.on("layeradd", updateAttribution);
map.on("layerremove", updateAttribution);

var attributionControl = L.control({
  position: "bottomright"
});
attributionControl.onAdd = function (map) {
  var div = L.DomUtil.create("div", "leaflet-control-attribution");
  div.innerHTML = "<span class='hidden-xs'>개발: <a href='http://codeforep.org'>코드포은평</a> | </span><a href='#' onclick='$(\"#attributionModal\").modal(\"show\"); return false;'>Attribution</a>";
  return div;
};
map.addControl(attributionControl);

var zoomControl = L.control.zoom({
  position: "bottomright"
}).addTo(map);

/* GPS enabled geolocation control set to follow the user's location */
var locateControl = L.control.locate({
  position: "bottomright",
  drawCircle: true,
  follow: true,
  setView: true,
  keepCurrentZoomLevel: true,
  markerStyle: {
    weight: 1,
    opacity: 0.8,
    fillOpacity: 0.8
  },
  circleStyle: {
    weight: 1,
    clickable: false
  },
  icon: "fa fa-location-arrow",
  metric: false,
  strings: {
    title: "My location",
    popup: "You are within {distance} {unit} from this point",
    outsideMapBoundsMsg: "You seem located outside the boundaries of the map"
  },
  locateOptions: {
    maxZoom: 18,
    watch: true,
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 10000
  }
}).addTo(map);

/* Larger screens get expanded layer control and visible sidebar */
if (document.body.clientWidth <= 767) {
  var isCollapsed = true;
} else {
  var isCollapsed = false;
}

var groupedOverlays = {
  "분야": {
    "<img src='{{ "ex/assets/img/1-hubs.png" | relative_url }}' width='24' height='24'>&nbsp;&nbsp;1. 허브,단지": hubLayer,
    "<img src='{{ "ex/assets/img/2-publics.png" | relative_url }}' width='24' height='24'>&nbsp;&nbsp;2. 공공기관": publicLayer,
    "<img src='{{ "ex/assets/img/3-community.png" | relative_url }}' width='24' height='24'>&nbsp;&nbsp;3. 커뮤니티": communityLayer,
    "<img src='{{ "ex/assets/img/4-social.png" | relative_url }}' width='24' height='24'>&nbsp;&nbsp;4. 사회적 경제조직": socialLayer,
    "<img src='{{ "ex/assets/img/5-npo.png" | relative_url }}' width='24' height='24'>&nbsp;&nbsp;5. NPO,문화예술단체": npoLayer,
    "<img src='{{ "ex/assets/img/6-town.png" | relative_url }}' width='24' height='24'>&nbsp;&nbsp;6. 마을공동체": townLayer,
    "<img src='{{ "ex/assets/img/7-alt.png" | relative_url }}' width='24' height='24'>&nbsp;&nbsp;7. 대안주거공간": altLayer,
    "<img src='{{ "ex/assets/img/8-co.png" | relative_url }}' width='24' height='24'>&nbsp;&nbsp;8. 공동육아,작은도서관": coLayer
  }
};

//you can still add your own afterwards with
var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, {
  collapsed: isCollapsed
}).addTo(map);

/* Highlight search box text on click */
$("#searchbox").click(function () {
  $(this).select();
});

/* Prevent hitting enter from refreshing the page */
$("#searchbox").keypress(function (e) {
  if (e.which == 13) {
    e.preventDefault();
  }
});

$("#featureModal").on("hidden.bs.modal", function (e) {
  $(document).on("mouseout", ".feature-row", clearHighlight);
});

/* Typeahead search functionality */
$(document).one("ajaxStop", function () {
  $("#loading").hide();
  sizeLayerControl();
  /* Fit map to epdong bounds */
  map.fitBounds(epdong.getBounds());
  featureList = new List("features", {valueNames: ["feature-name"]});
  featureList.sort("feature-name", {order:"asc"});

  var hubsBH = new Bloodhound({
    name: "hubs",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: hubSearch,
    limit: 10
  });

  var publicsBH = new Bloodhound({
    name: "publics",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: publicSearch,
    limit: 10
  });

  var communityBH = new Bloodhound({
    name: "community",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: communitySearch,
    limit: 10
  });

  var socialBH = new Bloodhound({
    name: "social",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: socialSearch,
    limit: 10
  });

  var npoBH = new Bloodhound({
    name: "npo",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: socialSearch,
    limit: 10
  });

  var townBH = new Bloodhound({
    name: "town",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: socialSearch,
    limit: 10
  });

  var altBH = new Bloodhound({
    name: "alt",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: socialSearch,
    limit: 10
  });

  var coBH = new Bloodhound({
    name: "co",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: socialSearch,
    limit: 10
  });

  var geonamesBH = new Bloodhound({
    name: "GeoNames",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
      url: "http://api.geonames.org/searchJSON?username=bootleaf&featureClass=P&maxRows=5&countryCode=KR&name_startsWith=%QUERY",
      filter: function (data) {
        return $.map(data.geonames, function (result) {
          return {
            name: result.name + ", " + result.adminCode1,
            lat: result.lat,
            lng: result.lng,
            source: "GeoNames"
          };
        });
      },
      ajax: {
        beforeSend: function (jqXhr, settings) {
          settings.url += "&east=" + map.getBounds().getEast() + "&west=" + map.getBounds().getWest() + "&north=" + map.getBounds().getNorth() + "&south=" + map.getBounds().getSouth();
          $("#searchicon").removeClass("fa-search").addClass("fa-refresh fa-spin");
        },
        complete: function (jqXHR, status) {
          $('#searchicon').removeClass("fa-refresh fa-spin").addClass("fa-search");
        }
      }
    },
    limit: 10
  });
  hubsBH.initialize();
  publicsBH.initialize();
  communityBH.initialize();
  socialBH.initialize();
  npoBH.initialize();
  townBH.initialize();
  altBH.initialize();
  coBH.initialize();
  geonamesBH.initialize();

  /* instantiate the typeahead UI */
  $("#searchbox").typeahead({
    minLength: 1,
    highlight: true,
    hint: false
  }, {
    name: "hubs",
    displayKey: "name",
    source: hubsBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='{{ "ex/assets/img/1-hubs.png" | relative_url }}' width='24' height='24'>허브,단지</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  }, {
    name: "publics",
    displayKey: "name",
    source: publicsBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='{{ "ex/assets/img/2-publics.png" | relative_url }}' width='24' height='24'>&nbsp;공공기관</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  }, {
    name: "community",
    displayKey: "name",
    source: communityBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='{{ "ex/assets/img/3-community.png" | relative_url }}' width='24' height='24'>&nbsp;커뮤니티</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  }, {
    name: "social",
    displayKey: "name",
    source: socialBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='{{ "ex/assets/img/4-social.png" | relative_url }}' width='24' height='24'>&nbsp;사회적 경제조직</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  },  {
    name: "npo",
    displayKey: "name",
    source: npoBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='{{ "ex/assets/img/5-npo.png" | relative_url }}' width='24' height='24'>&nbsp;NPO,문화예술단체</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  },  {
    name: "town",
    displayKey: "name",
    source: townBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='{{ "ex/assets/img/6-town.png" | relative_url }}' width='24' height='24'>&nbsp;마을공동체</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  },  {
    name: "alt",
    displayKey: "name",
    source: altBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='{{ "ex/assets/img/7-alt.png" | relative_url }}' width='24' height='24'>&nbsp;대안주거공간</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  },  {
    name: "co",
    displayKey: "name",
    source: coBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='{{ "ex/assets/img/8-co.png" | relative_url }}' width='24' height='24'>&nbsp;공동육아,작은도서관</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  }, {
    name: "GeoNames",
    displayKey: "name",
    source: geonamesBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='{{ "ex/assets/img/globe.png'" | relative_url }} width='24' height='24'>&nbsp;GeoNames</h4>"
    }
  }).on("typeahead:selected", function (obj, datum) {
    if (datum.source === "hubs") {
      if (!map.hasLayer(hubLayer)) {
        map.addLayer(hubLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "publics") {
      if (!map.hasLayer(publicLayer)) {
        map.addLayer(publicLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "community") {
      if (!map.hasLayer(communityLayer)) {
        map.addLayer(communityLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "social") {
      if (!map.hasLayer(socialLayer)) {
        map.addLayer(socialLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "npo") {
      if (!map.hasLayer(npoLayer)) {
        map.addLayer(npoLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "town") {
      if (!map.hasLayer(townLayer)) {
        map.addLayer(townLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "alt") {
      if (!map.hasLayer(altLayer)) {
        map.addLayer(altLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "co") {
      if (!map.hasLayer(coLayer)) {
        map.addLayer(coLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "GeoNames") {
      map.setView([datum.lat, datum.lng], 14);
    }
    if ($(".navbar-collapse").height() > 50) {
      $(".navbar-collapse").collapse("hide");
    }
  }).on("typeahead:opened", function () {
    $(".navbar-collapse.in").css("max-height", $(document).height() - $(".navbar-header").height());
    $(".navbar-collapse.in").css("height", $(document).height() - $(".navbar-header").height());
  }).on("typeahead:closed", function () {
    $(".navbar-collapse.in").css("max-height", "");
    $(".navbar-collapse.in").css("height", "");
  });
  $(".twitter-typeahead").css("position", "static");
  $(".twitter-typeahead").css("display", "block");
});

// Leaflet patch to make layer control scrollable on touch browsers
var container = $(".leaflet-control-layers")[0];
if (!L.Browser.touch) {
  L.DomEvent
  .disableClickPropagation(container)
  .disableScrollPropagation(container);
} else {
  L.DomEvent.disableClickPropagation(container);
}
