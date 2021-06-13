$(document).on("change", ".amount-field", function(){
  setcardframe()
})
$(document).on("click", ".amount-buttons", function(){
  setcardframe()
})
  $('.card-frame').ready(function(){
    setTimeout(()=>{

   
  },6000)
  })
  
function setcardframe(){
  var payButton = document.getElementById("pay-button");
  var form = document.getElementById("payment-form");
  Frames.init("pk_test_fb29c2d0-7f3b-4d33-930b-cc4657edbbe1");
  Frames.addEventHandler(
    Frames.Events.CARD_VALIDATION_CHANGED,
    function (event) {
      console.log("CARD_VALIDATION_CHANGED:%o", event);
      payButton.disabled =(!Frames.isCardValid() || $("#drive-amount-payment").val()=='')
    }
  );
    $(document).on("change", ".amount-field", function(){
      payButton.disabled =(!Frames.isCardValid() || $("#drive-amount-payment").val()=='')
  
    })
    $(document).on("click", ".amount-buttons", function(){
      payButton.disabled =(!Frames.isCardValid() || $("#drive-amount-payment").val()=='')
    })
  Frames.addEventHandler(
    Frames.Events.CARD_TOKENIZED,
    function (event) {
      var el = document.getElementById("success-payment-message")
      el.setAttribute('value', event.token);
      let drive_id= document.getElementById("drive-id-payment").getAttribute('value')
      let data = new FormData();
      data.append( 'token', event.token);
      data.append( 'amount',document.getElementById("drive-amount-payment").getAttribute('value'));
      data.append( 'drive_id', drive_id);
      $.ajax({
          url: 'https://devlabapi.filscare.com/v1/charityDrivePayment',
          type: 'post',
          processData: false,
          contentType: false,
          data: data,
      }).done(function (data){
          if(data.status==true)
          window.location.replace(location.origin+'/merchant/account/payment-success/'+data.transaction_id+'/'+drive_id)
          
          else
          window.location.replace(location.origin+'/merchant/account/payment-failed/'+data.transaction_id+'/'+drive_id)
  
      })
        
  }
  );
  
  form.addEventListener("submit", function (event) {
   payButton.disabled = true // disables pay button once submitted
    event.preventDefault();
    Frames.submitCard();
  });
}