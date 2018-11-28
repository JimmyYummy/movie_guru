$(document).ready(() => {
  $('#facebook-login').on('click', function(event) {
    event.preventDefault();
    window.location.href = '/auth/facebook';
  });
});
