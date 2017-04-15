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
            alert("ロード失敗1");
        },
		success: function(res) { 
 			var trkseg1 = res.getElementsByTagName("trkpt");	
			for(var i = 0; i < trkseg1.length; i++){
				var lat = parseFloat(trkseg1[i].getAttribute("lat"));
				var lon = parseFloat(trkseg1[i].getAttribute("lon"));
				sum_lats += lat; 
				sum_lons += lon;
				latlngArray2[i] = [lat,lon];
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
		zoom: 14,
		center: latlng_center,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	// div要素内にマップを作成するために，Googleマップオブジェクトを追加，
	map = new google.maps.Map(document.getElementById('map'), mapOptions);

	for(var i = 0; i < latlngArray2.length; i++){
		var lat1 = latlngArray1[i][0];
		var lon1 = latlngArray1[i][1];
		var lat2 = latlngArray2[i][0];
		var lon2 = latlngArray2[i][1];

		if(lat1 == lat2){
			var latlng = new google.maps.LatLng(lat1, lon1); 
			var marker = new google.maps.Marker({map: map, position: latlng, icon:"https://maps.google.com/mapfiles/ms/icons/red-dot.png",zetIndex:10});
		}else{
			var latlng = new google.maps.LatLng(lat1, lon1); 
			var marker = new google.maps.Marker({map: map, position: latlng, icon:"https://maps.google.com/mapfiles/ms/icons/red-dot.png",zetIndex:0});
			var latlng = new google.maps.LatLng(lat1, lon1); 
			var marker = new google.maps.Marker({map: map, position: latlng, icon:"https://maps.google.com/mapfiles/ms/icons/blue-dot.png",zetIndex:10});
		}
	}

	// // 以下は個別データ．
	// // 青データ(latlangArray2) 赤データを先に記述すると思い通りのプロットにならない..
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



