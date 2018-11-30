$(document).ready(() => {

  $('#button').on('click', function() {
    console.log('clicked');
    $.ajax({
      url: '/api_endpoint/123/?query_message=hello',
      method: 'post',
      data: {
        message: $('#movie').text().trim()
      },
      error(err) {
        console.log('Error:', err);
      },
      success(res) {
        console.log('success');
      }
    })
  });

  // $('#searchBtn').on('click',function(){
  //   event.preventDefault();
  //   console.log("Hey bros");
  //   console.log($('#searchBar').html());

  // });


});
