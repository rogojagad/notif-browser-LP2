function loadKegiatan(){
    $.ajax({
      url: "http://reservasi.lp2.if.its.ac.id/feeder/Laboratorium%20Pemrograman%202",
      type: 'GET',
      success: function (data) {
        if(data.now.length > 0){
          next_event = data.now[0]

          var message = {
            "nama": next_event.nama_kegiatan,
            "mulai": next_event.waktu_mulai_permohonan_peminjaman,
            "selesai": next_event.waktu_selesai_permohonan_peminjaman
          }

          makeNotification(message);
          sendMessage(message);
        }
      }
    });
}

setInterval(loadKegiatan, 1000);

function sendMessage(kegiatan) {
  var views = chrome.extension.getViews({type: "popup"});

  var info_kegiatan = "<p style='text-align: center; margin-top: 4em;'><strong>"+kegiatan.nama+"</strong></p>";
  info_kegiatan += "<p style='text-align: center'>"+kegiatan.mulai+" sampai "+kegiatan.selesai+"</p>"

  views[0].document.getElementById('container').innerHTML = info_kegiatan;
}

function makeNotification(kegiatan){
  var option = {
    type: "basic",
    title: "Kegiatan Berikutnya",
    message: kegiatan.nama + " akan dimulai pukul " + kegiatan.mulai + ". Segera sterilkan lab.",
    iconUrl: "icon.png"
  }

  chrome.notifications.create(option, callback);
}

function callback(){
  console.log("Done");
}
