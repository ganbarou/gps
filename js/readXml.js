// git test
// ドキュメントが読み込まれたら次の処理を実行．
$(function() {

	var map;
	var urls = ["./data1.xml","./data2.xml"]

	// 重心の位置を求めるために使う変数を用意
	var sum_lats = 0; // 数値は初期値にゼロを設定しないと加算時にNaN．
	var sum_lons = 0;

	// 経度，緯度を格納する配列を準備．
	var latlngArray1 = [];
	var latlngArray2 = [];

function calcDistance(lat1,lng1,lat2,lng2) {
	var r = 6378.137; // 地球の半径
	
	

	// 緯度差と経度差をラジアンに変換
	var latRad = Math.abs(lat1 - lat2) * Math.PI / 180;
	var lngRad = Math.abs(lng1 - lng2) * Math.PI / 180;

	// 南北と東西の距離を計算
	var distNs = r * latRad;
	var distEw = r * lngRad * Math.cos(lat1 * Math.PI / 180);

	// 2点間の距離を求めてKmで返す
	return Math.sqrt(Math.pow(distNs, 2) + Math.pow(distEw, 2));
}
	// xmlファイルの読み込み
	$.ajax({
		url: urls[0],
		type: "GET",
		dataType:'xml',
		timeout:1000,
		async: false, // 非同期オプションを無効にして同期リクエストを行い，Ajaxで読み込んだ値のスコープをグローバルに．
		error:function(){
            alert("ロード失敗1");
        },
		success: function(res) { //resに全ての情報が埋め込まれている．responseの略．
			// xmlの内容をパース(構文解析．人が書いた仕様に則っていないコードを仕様に合わせて後々使える状態にすること．今回はタグごとに取り出す)する
			// console.log(res.responseText) //undefined
			// xml = $.parseXML(res.responseText); //responsTextにリクエストの結果が入っているはず．なんでnullに？？
			// console.log(xml);

		  	// trkptタグを抽出して配列に埋め込む
 			var trkseg1 = res.getElementsByTagName("trkpt"); // Elements! sがないと，not Functionエラー，

			for(var i = 0; i < trkseg1.length; i++){
				var lat = parseFloat(trkseg1[i].getAttribute("lat"));// parseFloatをつけないと文字列連結．typeof()で確認．
				var lon = parseFloat(trkseg1[i].getAttribute("lon"));
				sum_lats += lat;
				sum_lons += lon;
				latlngArray1[i] = [lat,lon];
			}
	 	}
	});

	// MarkerをAjaxの外に出し，ajaxはxmlの読み込みのためだけに使うのがポイント．
	$.ajax({
		url: urls[1],
		type: "GET",
		dataType:'xml',
		timeout:1000,
		async: false,
		error:function(){
            alert("ロード失敗2");
        },
		success: function(res) {

			var timeArray = new Array();
			timeArray[0]=0;
			
			var time1= new Array();

 			var trkseg1 = res.getElementsByTagName("trkpt");
 			var timeArray = res.getElementsByTagName("time");
 			

			for(var i = 0; i < trkseg1.length; i++){
				var lat = parseFloat(trkseg1[i].getAttribute("lat"));
				var lon = parseFloat(trkseg1[i].getAttribute("lon"));
				sum_lats += lat;
				sum_lons += lon;
				latlngArray2[i] = [lat,lon];
			
				time1[i]=timeArray[i].innerHTML;
				console.log("time="+time1[i]);
			}
	 	}
	});

	// 重心の計算
	var data_number = latlngArray1.length + latlngArray2.length;
	var lats_center = sum_lats/data_number;
	var lons_center = sum_lons/data_number;
	var latlng_center = new google.maps.LatLng(lats_center,lons_center);

	// Google mapのオプションを設定．
	var mapOptions = {
		zoom: 10,
		center: latlng_center,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	// div要素内にマップを作成するために，Googleマップオブジェクトを追加，
	map = new google.maps.Map(document.getElementById('map'), mapOptions);



	var kyori=[];
	var ieiru;
	ieiru=1;
	var sotoiru;
	sotoiru=1;
		//マーカー作成
	for(var i = 0; i < latlngArray2.length; i++){
		var lat1 = latlngArray1[i][0];
		var lon1 = latlngArray1[i][1];
		var lat2 = latlngArray2[i][0];
		var lon2 = latlngArray2[i][1];

		kyori[i]=calcDistance(lat1,lon1,lat2,lon2);
	console.log("kyori["+i+"]="+kyori[i]);

	if (kyori[i]<0.03)
		{ieiru++;
		sotoiru=0;}
 	else
		{sotoiru++;
		 ieiru=0;}


	console.log("ieiru="+ieiru);
	console.log("sotoiru="+sotoiru);


	


		if(ieiru>30){
			var latlng = new google.maps.LatLng(lat1, lon1);
			var marker = new google.maps.Marker({map: map, position: latlng, icon:"https://maps.google.com/mapfiles/ms/icons/red-dot.png",zetIndex:10});
		}else if (sotoiru>30){
			var latlng = new google.maps.LatLng(lat1, lon1);
			var marker = new google.maps.Marker({map: map, position: latlng, icon:"https://maps.google.com/mapfiles/ms/icons/blue-dot.png",zetIndex:10});
		alert('JavaScriptのアラート');
	}
		else;
	}

	// // 以下は個別データ．

	// // 青データ(latlangArray2) 赤データを先に記述すると思い通りのプロットにならない．．．
	// for(var i = 0; i < latlngArray2.length; i++){
	// 	var lat = latlngArray2[i][0];
	// 	var lon = latlngArray2[i][1];
	// 	var latlng = new google.maps.LatLng(lat, lon);
	// 	var marker = new google.maps.Marker({map: map, position: latlng, icon:"https://maps.google.com/mapfiles/ms/icons/blue-dot.png",zetIndex:0});
	// }

	// // 赤データ(latlangArray1)
	// for(var i = 0; i < latlngArray1.length; i++){
	// 	var lat = latlngArray1[i][0];
	// 	var lon = latlngArray1[i][1];
	// 	var latlng = new google.maps.LatLng(lat, lon);
	// 	var marker = new google.maps.Marker({map: map, position: latlng, icon:"https://maps.google.com/mapfiles/ms/icons/red-dot.png",zetIndex:10});
	// }


});
