$(document).ready(function() {
  var qrcode = new QRCode(document.getElementById("qrcode"), {
    width: 220,
    height: 220
  });

  function makeCode(value) {
    qrcode.makeCode(value);
  }

  var tenantId = GetQueryString("tenantId");
  var detail = null;
  var jishu = 0;

  // 获取详情
  var getDetail = function(tenantId) {
    if (!tenantId) {
      alert('没有商户tenantId');
      return;
    }
    $.ajax({
      url: "http://wx-mini.rtmap.com/wxapp-scan-coupon/front/activity/setting",
      type: "POST",
      contentType: "application/json",
      dataType: "json",
      // traditional:true,
      data: JSON.stringify({
        tenantId: tenantId,
        action: 1
      }),
      success: function(res) {
        if (res.status == 200) {
          $(".body").css({"background-image" : "url("+res.data.scanBanner+")"})
          detail = res.data;
          console.log(++jishu);
          let url = 'http://res.rtmap.com/air/coupon/scan?tenantId=' + tenantId + '&timestamp=' + '1543908925540-30' || detail.timestamp;
          console.log(url);
          makeCode((url));
          loop();
        } else {
          alert(res.message);
        }
      }
    });
  }
  
  // 轮询 
  function loop () {
    if (tenantId && detail && detail.changeTime) {
      setTimeout(function() {
        getDetail(tenantId);
      }, detail.changeTime * 1000);
    }
  };

  // 初始化
  var init = function() {
    getDetail(tenantId);
  }

  init();
  
});
