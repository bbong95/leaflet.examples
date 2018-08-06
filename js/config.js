var dataUrl = 'data/test.csv';
var maxZoom = 20;
var fieldSeparator = '|';
var baseUrl = 'https://mt{s}.google.com/vt/lyrs=m&hl=kr&x={x}&y={y}&z={z}';
var baseAttribution = 'Map data &copy; <a target="_blank" href="https://maps.google.com/maps?ll=36.1358642,128.0785804&amp;z=13&amp;t=m&amp;hl=ko-KR&amp;gl=US&amp;mapclient=apiv3" title="Google 지도에서 이 지역을 보려면 클릭하세요." ><img alt="" src="https://maps.gstatic.com/mapfiles/api-3/images/google4.png" draggable="false"></a>';
var subdomains = '0123';
var clusterOptions = {showCoverageOnHover: false, maxClusterRadius: 50};
var labelColumn = "상호";
var opacity = 1.0;