var productId,checkoutId,quantity;


var getParams = function (url) {
  // Src: https://gomakethings.com/getting-all-query-string-values-from-a-url-with-vanilla-js/
	var params = {};
	var parser = document.createElement('a');
	parser.href = url;
	var query = parser.search.substring(1);
	var vars = query.split('&');
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		params[pair[0]] = decodeURIComponent(pair[1]);
	}
	return params;
};

checkoutId = getParams(window.location.href)["checkoutId"];

  $(".button-primary").click(function(){
    $('.product').removeClass('selected');
    $(this).parent().closest('.product').toggleClass('selected');
    productId = $(this).data('product');
    // console.log(productId);

    $.post("/add_line_item/"+productId+"/1/+"+checkoutId,
    {'checkoutId' : checkoutId, 'quantity' : 1},
    function(data, status){
      alert("Data: " + data + "\nStatus: " + status);
    });

 });
