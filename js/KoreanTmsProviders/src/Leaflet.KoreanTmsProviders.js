(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['leaflet'], factory);
	} else if (typeof modules === 'object' && module.exports) {
		// define a Common JS module that relies on 'leaflet'
		module.exports = factory(require('leaflet'));
	} else {
		// Assume Leaflet is loaded into global object L already
		factory(L);
	}
}(this, function (L) {
	'use strict';

	L.Proj.CRS.Daum = new L.Proj.CRS(
		'EPSG:5181',
    '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
    {
      resolutions: [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25],
      origin: [-30000, -60000],
											// West					 // South							 // East						 // North
      //bounds: L.bounds([-30000-Math.pow(2,19)*2, -60000-Math.pow(2, 19)*2], [-30000+Math.pow(2,19)*3, -60000+Math.pow(2, 19)*3])

	  bounds: L.bounds([-30000-Math.pow(2,19)*4, -60000], [-30000+Math.pow(2,19)*5, -60000+Math.pow(2,19)*5])
    }          
 	);

	L.Proj.CRS.Naver = new L.Proj.CRS(
		'EPSG:5179',
    '+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
    {
      resolutions: [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25],
      origin: [90112, 1192896],
      bounds: L.bounds([90112, 1192896], [1990673, 2761664])
    }
	);
  
	L.Proj.CRS.VWorld = L.CRS.EPSG3857;

	L.Proj.CRS.TMap = L.CRS.EPSG3857;

	L.TileLayer.KoreaProvider = L.TileLayer.extend({

		initialize: function (arg, options) {

			var providers = L.TileLayer.KoreaProvider.providers;

			var parts = arg.split('.');

			var providerName = parts[0];
			var variantName = parts[1];

			if (!providers[providerName]) {
				throw 'No such provider (' + providerName + ')';
			}

			var provider = {
				url: providers[providerName].url,
				crs: providers[providerName].crs,
				options: providers[providerName].options
			};

			// overwrite values in provider from variant.
			if (variantName && 'variants' in providers[providerName]) {
				if (!(variantName in providers[providerName].variants)) {
					throw 'No such variant of ' + providerName + ' (' + variantName + ')';
				}
				var variant = providers[providerName].variants[variantName];
				var variantOptions;
				if (typeof variant === 'string') {
					variantOptions = {
						variant: variant
					};
				} else {
					variantOptions = variant.options;
				}
				provider = {
					url: variant.url || provider.url,
					crs: variant.crs || provider.crs,					
					options: L.Util.extend({}, provider.options, variantOptions)
				};
			} else if (typeof provider.url === 'function') {
				provider.url = provider.url(parts.splice(1).join('.'));
			}

			var forceHTTP = window.location.protocol === 'file:' || provider.options.forceHTTP;
			if (provider.url.indexOf('//') === 0 && forceHTTP) {
				provider.url = 'http:' + provider.url;
			}

			// If retina option is set
			if (provider.options.retina) {
				// Check retina screen
				if (options.detectRetina && L.Browser.retina) {
					// The retina option will be active now
					// But we need to prevent Leaflet retina mode
					options.detectRetina = false;
				} else {
					// No retina, remove option
					provider.options.retina = '';
				}
			}

			// replace attribution placeholders with their values from toplevel provider attribution,
			// recursively
			var attributionReplacer = function (attr) {
				if (attr.indexOf('{attribution.') === -1) {
					return attr;
				}
				return attr.replace(/\{attribution.(\w*)\}/,
					function (match, attributionName) {
						return attributionReplacer(providers[attributionName].options.attribution);
					}
				);
			};
			provider.options.attribution = attributionReplacer(provider.options.attribution);

			// Compute final options combining provider options with any user overrides
			var layerOpts = L.Util.extend({}, provider.options, options);
			L.TileLayer.prototype.initialize.call(this, provider.url, layerOpts);
		}
	});

	/**
	 * Definition of providers.
	 * see http://leafletjs.com/reference.html#tilelayer for options in the options map.
	 */

	//jshint maxlen:220
	L.TileLayer.KoreaProvider.providers = {
		DaumMap: {
			url: 'http://map{s}.daumcdn.net/map_2d/1807hsm/L{z}/{y}/{x}.png',
			crs: L.Proj.CRS.Daum,
			options: {
				maxZoom: 13, 
				minZoom: 0,
				zoomReverse: true, //다음지도는 레벨 13(小축척) -> 레벨 0(大축척)으로 줄어듦
				zoomOffset: 1,
				subdomains: '0123',
				continuousWorld: true,
				tms: true,
				attribution: 'Map data &copy; <a href="http://map.daum.net//"><strong>Daum Map</strong></a>'
			},
			variants: {
				Street: {}, //일반지도(Standard Road Map)
				/*Satellite: { //사용하지 않음(위성지도는 SkyView로 사용)
					url: 'http://s{s}.maps.daum-img.net/L{z}/{y}/{x}.jpg'
				},*/
				Cadastral: { //지적편집도(Cadastral)
					url: 'http://map{s}.daumcdn.net/map_usedistrict/1807hsm/L{z}/{y}/{x}.png'
				},
				BBoundary: { //법정동경계지도
					url: 'http://boundary.map.daum.net/mapserver/db/BBOUN_L/L{z}/{y}/{x}.png'
				},
				HBoundary: { //행정동경계지도
					url: 'http://boundary.map.daum.net/mapserver/db/HBOUN_L/L{z}/{y}/{x}.png'
				},
				Physical: { //지형도(Terrain Map)
					url: 'http://map{s}.daumcdn.net/map_shaded_relief/3.00/L{z}/{y}/{x}.png' 
				},				
				Hybrid: { //위성지도+라벨 중첩지도(Hybrid)
					url: 'http://map{s}.daumcdn.net/map_hybrid/1807hsm/L{z}/{y}/{x}.png'								 
				},
				SkyView: { //위성지도(Satellite Only) : Daum Map에서는 스카이뷰로 사용됨
					url: 'http://map{s}.daumcdn.net/map_skyview/L{z}/{y}/{x}.jpg?v=160114' 
				},
				Bicycle: { //자전거도로지도(Bicycle)
					url: 'http://map{s}.daumcdn.net/map_bicycle/2d/6.00/L{z}/{y}/{x}.png' 
				},
				Traffic: { //교통상황지도(Traffic)
					url: 'http://r{s}.maps.daum-img.net/mapserver/file/realtimeroad/L{z}/{y}/{x}.png' 
				},
				FineDust: { //미세먼지지도
					url: 'http://airinfo.map.kakao.com/mapserver/file/airinfo_pm10/T/L{z}/{y}/{x}.png'
				},
				YellowDust: { //황사지도
					url: 'http://airinfo.map.kakao.com/mapserver/file/airinfo_ysnd/T/L{z}/{y}/{x}.png'
				},
				NO2: { //이산화질소지도
					url: 'http://airinfo.map.kakao.com/mapserver/file/airinfo_no2/T/L{z}/{y}/{x}.png'
				},
				SO2: { //아황산가스지도
					url: 'http://airinfo.map.kakao.com/mapserver/file/airinfo_so2/T/L{z}/{y}/{x}.png'
				},
				CAI: { //통합대기지수지도
					url: 'http://airinfo.map.kakao.com/mapserver/file/airinfo_khai/T/L{z}/{y}/{x}.png'
				},
				PM25: { //초미세먼지지도
					url: 'http://airinfo.map.kakao.com/mapserver/file/airinfo_pm25/T/L{z}/{y}/{x}.png'
				},
				O3: { //오존지도
					url: 'http://airinfo.map.kakao.com/mapserver/file/airinfo_o3/T/L{z}/{y}/{x}.png'
				},
				CO: { //일산화탄소지도
					url: 'http://airinfo.map.kakao.com/mapserver/file/airinfo_co/T/L{z}/{y}/{x}.png'
				}
			}
		},
		NaverMap: {
			url: 'https://simg.pstatic.net/onetile/get/195/0/0/{z}/{x}/{y}/bl_vc_bg/ol_vc_an',
			crs: L.Proj.CRS.Naver, 
			options: {
				maxZoom: 13, 
				minZoom: 0,
				zoomOffset: 1,
				subdomains: '1234',
				continuousWorld: true,
				tms: true,
				attribution: 'Map data &copy; <a href="https://map.naver.com/"><strong>Naver Map</strong></a>'
			},
			variants: {
				Street: {}, //일반지도(Standard Road Map)
				Satellite: { //위성지도(Satellite Only)
					url: 'https://simg.pstatic.net/onetile/get/195/0/1/{z}/{x}/{y}/bl_st_bg'					
				}, 
				Cadastral: { //지적편집도(Cadastral)
					url: 'https://simg.pstatic.net/onetile/get/195/0/0/{z}/{x}/{y}/empty/ol_lp_cn'
				},
				Physical: { //지형도(Terrain Map)
					url: 'https://simg.pstatic.net/onetile/get/195/0/0/{z}/{x}/{y}/bl_tn_bg/ol_vc_bg/ol_vc_an'
				},
				Hybrid: { //위성지도+라벨 중첩지도(Hybrid)
					url: 'https://simg.pstatic.net/onetile/get/195/0/0/{z}/{x}/{y}/empty/ol_st_rd/ol_st_an'
				},
				Bicycle: { //자전거도로지도(Bicycle)
					url: 'https://simg.pstatic.net/onetile/get/195/0/0/{z}/{x}/{y}/empty/ol_bc_hb'
				},
				Traffic: { //교통상황지도(Traffic)
					url: 'https://simg.pstatic.net/onetile/get/195/201973/0/{z}/{x}/{y}/empty/ol_tr_rt/ol_vc_an'
				},
				StreetView: { //거리뷰지도(Street View)
					url: 'https://simg.pstatic.net/onetile/get/195/0/0/{z}/{x}/{y}/empty/ol_pn_rd/ol_vc_an?dv=1807.003'
				}
			}
		},
		VWorld: {
			//url: 'http://xdworld.vworld.kr:8080/2d/Base/201612/{z}/{x}/{y}.png', 
			//url: 'http://xdworld.vworld.kr:8080/2d/Base/201710/{z}/{x}/{y}.png',
			url: 'http://xdworld.vworld.kr:8080/2d/Base/service/{z}/{x}/{y}.png',
			crs: L.Proj.CRS.VWorld,
			options: {
				maxZoom: 19, 
				minZoom: 6,
				continuousWorld: true,
				attribution: 'Map data &copy; <strong>VWorld</strong>'
			},
			variants: {
				Street: {},
				Satellite: {
					//url: 'http://xdworld.vworld.kr:8080/2d/Satellite/201612/{z}/{x}/{y}.jpeg'
					url: 'http://xdworld.vworld.kr:8080/2d/Satellite/service/{z}/{x}/{y}.jpeg'
				},
				Hybrid: {
					//url: 'http://xdworld.vworld.kr:8080/2d/Hybrid/201512/{z}/{x}/{y}.png'
					url: 'http://xdworld.vworld.kr:8080/2d/Hybrid/service/{z}/{x}/{y}.png'
				},
				Gray: {
					//url: 'http://xdworld.vworld.kr:8080/2d/gray/201512/{z}/{x}/{y}.png'
					url: 'http://xdworld.vworld.kr:8080/2d/gray/service/{z}/{x}/{y}.png'
				},
				Midnight: {
					//url: 'http://xdworld.vworld.kr:8080/2d/midnight/201512/{z}/{x}/{y}.png'
					url: 'http://xdworld.vworld.kr:8080/2d/midnight/service/{z}/{x}/{y}.png'
				}
			}
		},
		TMap: {
			//url: 'http://xdworld.vworld.kr:8080/2d/Base/201612/{z}/{x}/{y}.png', 
			//url: 'http://xdworld.vworld.kr:8080/2d/Base/201710/{z}/{x}/{y}.png',
			url: 'http://topopentile2.tmap.co.kr/tms/1.0.0/hd_tile/{z}/{y}/{x}.png',
			crs: L.Proj.CRS.TMap,
			options: {
				maxZoom: 18, 
				minZoom: 0,
				continuousWorld: true,
				attribution: 'Map data &copy; <strong>TMap</strong>'
			},
			variants: {
				Street: {},
				Satellite: {
					//url: 'http://xdworld.vworld.kr:8080/2d/Satellite/201612/{z}/{x}/{y}.jpeg'
					url: 'http://xdworld.vworld.kr:8080/2d/Satellite/service/{z}/{x}/{y}.jpeg'
				},
				Hybrid: {
					//url: 'http://xdworld.vworld.kr:8080/2d/Hybrid/201512/{z}/{x}/{y}.png'
					url: 'http://xdworld.vworld.kr:8080/2d/Hybrid/service/{z}/{x}/{y}.png'
				},
				Gray: {
					//url: 'http://xdworld.vworld.kr:8080/2d/gray/201512/{z}/{x}/{y}.png'
					url: 'http://xdworld.vworld.kr:8080/2d/gray/service/{z}/{x}/{y}.png'
				},
				Midnight: {
					//url: 'http://xdworld.vworld.kr:8080/2d/midnight/201512/{z}/{x}/{y}.png'
					url: 'http://xdworld.vworld.kr:8080/2d/midnight/service/{z}/{x}/{y}.png'
				}
			}
		}
	};

	L.tileLayer.koreaProvider = function (provider, options) {
		return new L.TileLayer.KoreaProvider(provider, options);
	};

	return L;
}));

