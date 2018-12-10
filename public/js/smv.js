console.log("smv.js");

$('#ratBtn').on('click', function(event) {
    event.preventDefault();
    console.log('clicked');
    $.ajax({
      url: window.location.href + '/?movie_rating=' + $("#ratVal").val(),
      method: 'get',
      error(err) {
        console.log('Error:', err);
      },
      success(res) {
        console.log('success');
      }
    })
  });
