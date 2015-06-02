
//Initially Load Vehicle List Page
$('#VehiclesPage').bind('pageinit', function(event) {
                     populateVehicleList();
                     });


// Generate Vehicle Object
function makeVehicleArray(link, info, price, thumbnail, vin) {
    
    var vehicle = new Array();
    vehicle['link'] = link;
    vehicle['info'] = info;
    vehicle['price'] = price;
    vehicle['thumbnail'] = thumbnail;
    vehicle['vin'] = vin;
    
    return vehicle;
}


//Generate Vehicle List Array
function getVehiclesList () {
    
    var car1 = makeVehicleArray("javascript:populateGallery(99999);", "2004 Nissan 350Z", "$12,000", "350z.jpg", "99999");
    var car2 = makeVehicleArray("javascript:populateGallery(99998);", "2001 Acura MDX", "$9,000", "mdx.jpg", "99998");
    var car3 = makeVehicleArray("javascript:populateGallery(99997);", "2012 Toyota Tacoma", "$24,000", "tacoma.jpg", "99997");
    var car4 = makeVehicleArray("javascript:populateGallery(99996);", "2006 Honda Accord", "$12,000", "accord.jpg", "99996");
    
    var vehicles = new Array();
    vehicles[0] = car1;
    vehicles[1] = car2;
    vehicles[2] = car3;
    vehicles[3] = car4;
    
    return vehicles;
    
}

// Dynamically create vehicle list view
function populateVehicleList () {
    
    var vehicles = getVehiclesList();
    
    for (i= 0; i < vehicles.length; i++) {
        
        var vehicle = vehicles[i];
        
        $("#vehicles").append("<li><a onClick='" + vehicle['link'] +"' data-transition='slide' href='#GallerySliderPage'>" + "<img src='img/" + vehicle['thumbnail'] +"'/>" + "<h3>" + vehicle['info'] + "</h3>" + "<p>" + vehicle['price'] + "</p></a></li>");
        
    }
    
    $('#vehicles').listview('refresh');
    
}


// Dynamically Populate Grid Gallery and create photoswipe object handler
populateGallery = function(vin){
    
    document.getElementById('PhotoList').innerHTML = '';
    
    var urlstr = "http://blnkr-carrier.herokuapp.com/api/v1/images/" + vin + "?access_token=1c67d1634ec0798226b17a58b3fcbeebd07e753391ef9ed892a0cd459b067a5d";
    
    $.ajax({
           type: 'GET',
           url: urlstr,
           dataType: 'json',
           success: function(response){ console.log(response);
           
           var Photos = "";
           
           $.each(response, function(key, value) {
                  
                  var path_small = value.path_small;
                  var path_full = value.path_full;
                  var file_name = value.file_name;
                  
                  Photos += '<li><a rel="external" href="' + path_full + '"><img src="' + path_small + '" alt="' + file_name + '"/></a></li>';

                  document.getElementById('PhotoList').innerHTML = Photos;
                  
                  });
           
           document.getElementById("currentVin").value = vin;
           
           // CREATE INSTANCES HERE
           var myPhotoSwipe = $(".gallery a").photoSwipe({
                                                         enableMouseWheel: false,
                                                         preventSlideshow: true,
                                                         })
           
           /********** UNSET INSTANCES HERE *****************/
           
           $(document).bind('pagebeforechange', function(e) {
                            if ($('.ps-carousel').length) {
                            $('body').removeClass('ps-active');
                            var photoSwipe = window.Code.PhotoSwipe;
                            var photoSwipeInstance = photoSwipe.getInstance($(myPhotoSwipe).attr('id'));
                            if (typeof photoSwipeInstance != "undefined" && photoSwipeInstance != null) {
                            photoSwipe.unsetActivateInstance(photoSwipeInstance);
                            photoSwipe.detatch(photoSwipeInstance);
                            }
                            }
                            });
           
           
           },
           error: function(error){ console.log('Error: '+error); }
           });
    
    
}


// Alternative Grid Gallery Handler
//populateGallery = function(vin){
//    
//    $('#imagesGrid').remove();
//    
//    $('<div id="imagesGrid" class="ui-grid-b" data-theme="a"></div>').appendTo("#galleryGrid");
//    
//    var urlstr = "http://blnkr-carrier.herokuapp.com/api/v1/images/" + vin + "?access_token=1c67d1634ec0798226b17a58b3fcbeebd07e753391ef9ed892a0cd459b067a5d";
//    
//    $.ajax({
//           type: 'GET',
//           url: urlstr,
//           dataType: 'json',
//           success: function(response){ console.log(response);
//           
//           row_count=1;
//           
//           $.each(response, function(key, value) {
//                  
//                  var path_small = value.path_small;
//                  
//                  switch(row_count) {
//                  case 1:
//                  row_block_id = 'a';
//                  row_count++;
//                  break;
//                  case 2:
//                  row_block_id = 'b';
//                  row_count++;
//                  break;
//                  case 3:
//                  row_block_id = 'c';
//                  row_count=1;
//                  break;
//                  
//                  }
//                  
//                  $("#imagesGrid").append('<div style="height: 105px;margin:0 auto; margin-left:auto; margin-right:auto; align:center; text-align:center;" class="ui-block-'+ row_block_id +'" data-theme="a"><img width="90" height="90" src="'+ path_small +'"></div>');
//                  
//                  
//                  });
//           
//           
//           },
//           error: function(error){ console.log('Error: '+error); }
//           });
//    
//    
//    
//}


// Launch Barcode Scanner and Handler Results
function scan () {
    console.log('scan(): init');
    // documentation said the syntax was this:
    // var scanner = window.PhoneGap.require("cordova/plugin/BarcodeScanner");
    // but playing with options, seems like it should be this:
    var scanner = window.cordova.require("com.phonegap.plugins.barcodescanner.BarcodeScanner");
    scanner.scan(
                 function (result) {
                 
                 if (result.text != '') {
                 setTimeout(function() {
                            alert("We got a VIN\n" +
                                  "Result: " + result.text);
                            }, 0);
                 
                 }
                 },
                 function (error) {
                 
                 setTimeout(function() {
                            alert("Scanning failed: " + error);
                            }, 0);
                 
                 }
                 );
}

