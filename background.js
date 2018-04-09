function loadKegiatan(){
		$.ajax({
			url: endpoint,
			type: 'GET',
			success: function (data) {
				if(data.next.length > 0){
					next_event = data.next[0]

					var message = {
						"nama": next_event.nama_kegiatan,
						"mulai": next_event.waktu_mulai_permohonan_peminjaman,
						"selesai": next_event.waktu_selesai_permohonan_peminjaman
					}

					sendMessage("ada-next", 'container-next', message);

					notify(message);

					setState('disabled');
				}
				else if(data.next.length === 0) {
					var message = {
						"nama": null,
						"mulai": null,
						"selesai": null
					}

					sendMessage("tidak-next", 'container-next', message);

					setState('enabled');
				}

				if(data.now.length > 0){
					event_now = data.now[0];

					var message = {
						"nama": event_now.nama_kegiatan,
						"mulai": event_now.waktu_mulai_permohonan_peminjaman,
						"selesai": event_now.waktu_selesai_permohonan_peminjaman
					}

					sendMessage("ada-now", 'container-now', message);

				}
			}
		});

		chrome.storage.local.get(['status'], function(result){
			console.log(result);
		});
}

function getEndPoint(){
	$.getJSON("endpoint.json", function (data) {
		$.each(data, function (index, value) {
			 endpoint = value;
		});
	});
}

function sendMessage(bool, target, kegiatan) {
	var views = chrome.extension.getViews({type: "popup"});

	if (bool === "ada-next") {
		var info_kegiatan = "<p style='text-align: center; margin-top: 4em;'><strong>"+kegiatan.nama+"</strong></p>";
		info_kegiatan += "<p style='text-align: center'>"+kegiatan.mulai+" sampai "+kegiatan.selesai+"</p>"
	}
	else{
		var info_kegiatan = "<p style='text-align:center;'>Belum ada, enjoy your time :)</p>";
	}

	if (bool === "ada-now") {
		var info_kegiatan = "<p style='text-align: center;'><strong>"+kegiatan.nama+"</strong></p>";
		info_kegiatan += "<p style='text-align: center'>"+kegiatan.mulai+" sampai "+kegiatan.selesai+"</p>"
	}

	if (views.length !== 0) {
		views[0].document.getElementById(target).innerHTML = info_kegiatan;
	}
}

function notify(kegiatan){
	chrome.storage.local.get(['status'], function(result){
		if(result.status === "enabled"){

			var notification = new Notification("Kegiatan Berikutnya", {
				icon: 'icon.png',
				body: kegiatan.nama + " akan segera dimulai pada pukul "+kegiatan.mulai+". Segera sterilkan laboratorium.",
				requireInteraction: true
			});

			notification.create;

			setState('disabled');
		}
	});
}

function setState(state){
	chrome.storage.local.set({'status': state}, function() {
		console.log('state is '+state);
	});
}

var initialize = (function() {
    var executed = false;
    return function() {
        if (!executed) {
            executed = true;
            setState('enabled');
        }
    };
})();

initialize();

var endpoint;
getEndPoint();
setInterval(loadKegiatan, 3000);
