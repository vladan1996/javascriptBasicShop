document.getElementById('mycart').innerHTML = getCookie('cart_items');

let xhttp = new XMLHttpRequest();

xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    let object = JSON.parse(this.responseText);
    let productsEl = document.getElementById("products");
    let html = "";
    for (let i = 0; i < object.length; i++) {
      html +=
        "<div class='col-md-4 card-items'>" +
        "<div class='card'>" +
        "<img src='" +
        object[i].product_image +
        "' alt='slika'/>" +
        " <div class='card-body'>" +
        "<h5 class='card-title'>" +
        object[i].product_name +
        "</h5>" +
        "<p class='card-text'>$" +
        object[i].product_price +
        "</p>" +
        "<button class='btn btn-primary' onclick='addToCart(this)' data-product_id = '"+object[i].id +"' >Add to card</button>" +
        "<button class='btn btn-info' onClick='seeMore(this)' data-product_id = '"+object[i].id +"' data-bs-toggle='modal' data-bs-target='#seeMoreModal'>See more</button>" +
        "</div>" +
        "</div>" +
        "</div>";
    }

    productsEl.innerHTML = html;
  }
};

xhttp.open("GET", "https://60b60d5bfe923b0017c85358.mockapi.io/products", true);
xhttp.send();

function seeMore(el) {
  let id = el.getAttribute("data-product_id");

  let xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      let object  = JSON.parse(this.responseText);

      document.getElementById('productDetails').innerHTML = "<p>"+ object.product_description+ "</p>"+
                                                                      "<p><b>Material</b> : "+object.product_material+"</p>"+
                                                                       "<p><b>Price</b> :$"+object.product_price+"</p>";
    }
  };

  xhttp.open("GET", "https://60b60d5bfe923b0017c85358.mockapi.io/products/" +id, true);
  xhttp.send();

}

let itemAlreadyAdded = false;
let totalPrice = 0;

function addToCart(element) {
  let id = element.getAttribute("data-product_id");

  if(!itemAlreadyAdded){
  document.getElementById('mycart').innerHTML = "<div class='row'> "+
                                                            "<div class='col-md-9'><h3>Your cart items</h3></div>"+
                                                          "<div class='col-md-3'><b>Total: $</b><span id='totalPrice'></span></div>"+
                                                          "</div>"
    itemAlreadyAdded = true ;
  }
  let xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      let object  = JSON.parse(this.responseText);
      document.getElementById('mycart').innerHTML += "<div class='row cart-items' id='cart-item-"+object.id+"'>"+
                                                                "<div class='col-md-4'>"+ object.product_name+"</div>"+
                                                                "<div class='col-md-3'><b>Material:</b> "+ object.product_material+"</div>"+
                                                                "<div class='col-md-2'><b>Price:</b> $"+ object.product_price+"</div>"+
                                                                  "<div class='col-md-2'><button onclick='removeFromCart(this)' data-product_id = '"+object.id +"' data-product_price='"+object.product_price+"' type='button' class='btn btn-danger'>Remove from Cart</button></div>"+

                                                              "</div>";
        totalPrice += parseFloat(object.product_price);
        document.getElementById('totalPrice').innerText = totalPrice;
        setCookie('cart_items',document.getElementById('mycart').innerHTML, 5)
    }
  };

  xhttp.open("GET", "https://60b60d5bfe923b0017c85358.mockapi.io/products/" +id, true);
  xhttp.send();

}

function removeFromCart(elem){
  let id = elem.getAttribute('data-product_id');

  document.getElementById('cart-item-'+id).remove();
  let total = parseInt(document.getElementById('totalPrice').innerText);
  total = total - parseInt(elem.getAttribute('data-product_price'))
  document.getElementById('totalPrice').innerText = total;
  totalPrice = total;

  setCookie('cart_items',document.getElementById('mycart').innerHTML,5);

}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}