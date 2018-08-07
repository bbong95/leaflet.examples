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

	//다음지도 좌표계 정의
	L.Proj.CRS.Daum = new L.Proj.CRS(
		'EPSG:5181',
    '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
    {
      resolutions: [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25],
	  //[-30000, -60000, 494288, 464288],
      origin: [-30000, -60000],
											// West					 // South							 // East						 // North
      //bounds: L.bounds([-30000-Math.pow(2,19)*2, -60000-Math.pow(2, 19)*2], [-30000+Math.pow(2,19)*3, -60000+Math.pow(2, 19)*3])

	  bounds: L.bounds([-30000-Math.pow(2,19)*4, -60000], [-30000+Math.pow(2,19)*5, -60000+Math.pow(2,19)*5])
    }          
 	);

	//네이버지도 좌표계 정의
	L.Proj.CRS.Naver = new L.Proj.CRS(
		'EPSG:5179',
    '+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
    {
      resolutions: [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25],
	  //[90112, 1192896, 1990673, 2761664],
      origin: [90112, 1192896],
      bounds: L.bounds([90112, 1192896], [1990673, 2761664])
    }
	);
  
	//vWorld 지도 좌표계 정의
	L.Proj.CRS.VWorld = L.CRS.EPSG3857;
	//[-20037508.34, -20037508.34, 20037508.34, 20037508.34],
	//resolutions: [156543.0339, 78271.517, 39135.7585, 19567.8793, 9783.93965, 4891.96983, 2445.98492, 1222.99246, 611.49623, 305.748115, 152.874058, 76.437029, 38.2185145, 19.1092573, 9.55462865, 4.77731433, 2.38865717, 1.19432859, 0.5971643, 0.29858215, 0.14929108]

	//Google Map 좌표계 정의
	L.Proj.CRS.Google = L.CRS.EPSG3857;

	//OSM 좌표계 정의
	L.Proj.CRS.OSM = L.CRS.EPSG3857;

	//T Map 좌표계 정의
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
		//다음지도 Tile URL
		DaumMap: {
			url: 'http://map{s}.daumcdn.net/map_2d/1807hsm/L{z}/{y}/{x}.png',
			crs: L.Proj.CRS.Daum,
			options: {
				maxZoom: 13, 
				minZoom: 0,
				zoomReverse: true, //다음지도는 레벨 13(小축척) -> 레벨 0(大축척)으로 줄어듦
				zoomOffset: 1,
				subdomains: '0123', //다음지도 Tile Map 서버 4EA : map0, map1, map2, map3
				continuousWorld: true,
				tms: true,
				attribution: 'Map data &copy; <a target="_blank" href="http://map.daum.net/" title="Daum 지도로 보시려면 클릭하세요." style="float: right; width: 38px; height: 17px; cursor: pointer;"><img src="http://t1.daumcdn.net/localimg/localimages/07/mapjsapi/m_bi.png" alt="Daum 지도로 이동" style="width: 37px; height: 18px; border: none;"></a>'
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
				RoadView: { //로드뷰)
					url: 'http://map{s}.daumcdn.net/map_roadviewline/7.00/L{z}/{y}/{x}.png' 
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
		//네이버지도 Tile URL
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
		//vWorld 지도 Tile URL
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
		//OSM Tile URL
		OSM: {
			url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
			crs: L.Proj.CRS.OSM,
			options: {
				maxZoom: 19, 
				minZoom: 0,
				continuousWorld: true,
				attribution: 'Map data &copy; <strong>OSM</strong>'
			},
			variants: {
				Street: {},
				/*Satellite: {
					//url: 'http://xdworld.vworld.kr:8080/2d/Satellite/201612/{z}/{x}/{y}.jpeg'
					url: 'http://xdworld.vworld.kr:8080/2d/Satellite/service/{z}/{x}/{y}.jpeg'
				},
				Hybrid: {
					//url: 'http://xdworld.vworld.kr:8080/2d/Hybrid/201512/{z}/{x}/{y}.png'
					url: 'http://xdworld.vworld.kr:8080/2d/Hybrid/service/{z}/{x}/{y}.png'
				},*/
				Gray: {
					url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'
				},
				Dark: {
					//url: 'http://xdworld.vworld.kr:8080/2d/midnight/201512/{z}/{x}/{y}.png'
					url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_nolabels/{z}/{x}/{y}.png'
				}
			}
		},
		//Google Map Tile URL
		GoogleMap: {
			url: 'https://mt{s}.google.com/vt/lyrs=m&hl=kr&x={x}&y={y}&z={z}',
			crs: L.Proj.CRS.Google,
			options: {
				maxZoom: 19, 
				minZoom: 0,
				subdomains: '0123',
				continuousWorld: true,
				attribution: 'Map data &copy; <a target="_blank" href="https://maps.google.com/maps?ll=36.1358642,128.0785804&amp;z=13&amp;t=m&amp;hl=ko-KR&amp;gl=US&amp;mapclient=apiv3" title="Google 지도에서 이 지역을 보려면 클릭하세요." ><img alt="" src="https://maps.gstatic.com/mapfiles/api-3/images/google4.png" draggable="false"></a>'
			},
			variants: {
				Street: {},
				Satellite: {
					url: 'https://mt{s}.google.com/vt/lyrs=s&hl=kr&x={x}&y={y}&z={z}'
				},
				Hybrid: {
					url: 'https://mt{s}.google.com/vt/lyrs=y&hl=kr&x={x}&y={y}&z={z}'
				},
				Terrain: {
					url: 'https://mt{s}.google.com/vt/lyrs=p&hl=kr&x={x}&y={y}&z={z}'
				},
				ARoad: {
					url: 'https://mt{s}.google.com/vt/lyrs=r&hl=kr&x={x}&y={y}&z={z}'
				}
			}
		},
		//T Map Tile URL
		TMap: {
			//TMap : -y 주의(y로 값을 주면 Tile이 위아래가 바뀌어 표시 되므로)
			url: 'http://topopentile{s}.tmap.co.kr/tms/1.0.0/hd_tile/{z}/{x}/{-y}.png',
			crs: L.Proj.CRS.TMap,
			options: {
				maxZoom: 18, 
				minZoom: 1,
				subdomains: '123',
				continuousWorld: false,
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

