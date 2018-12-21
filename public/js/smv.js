console.log("smv.js");

$('#ratBtn').on('click', function(event) {
    event.preventDefault();
    console.log('clicked');
    let rating = $("#ratVal").val();
    let movid = $("#mainbody").attr("mid");
    $.ajax({
      url: "../do_rating/?movie=" + movid + "&rating=" + rating,
      method: 'get',
      error(err) {
        console.log('Error:', err);
      },
      success: function(res) {
          console.log(res);
        if (res.success) $("#userrating").text(rating);
      }
    })
  });
