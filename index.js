var map = new kakao.maps.Map(document.getElementById('map'), {
  center: new kakao.maps.LatLng(37.539490, 126.997375),
  level: 4
});
getCount().then(({count}) => {
  if (count <= MAX_RECENT_COMMENTS) {
    document.getElementById('guestbook-button').style.display = 'none';
  }
});
renderGuestbook(getDataRecent);
document.getElementById('submit-form-button').addEventListener('click', () => {
  submitForm();
});

var coll = document.getElementsByName('accounts');
var i;
for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
}
