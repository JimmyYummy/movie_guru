$(document).ready(() => {
  // JavaScript for disabling form submissions if there are invalid fields
  (function disableSubmission() {
    window.addEventListener('load', () => {
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      const forms = document.getElementsByClassName('needs-validation');
      // Loop over them and prevent submission
      const validation = Array.prototype.filter.call(forms, (form) => {
        form.addEventListener('submit', (event) => {
          if (!$('#inputUsername').val()) {
            $('#inputUsername').focus();
          } else if (!$('#inputPassword').val()) {
            $('#inputPassword').focus();
          }
          if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
          }
          form.classList.add('was-validated');
        }, false);
      });
    }, false);
  }());

  $('#facebook-login').on('click', function(event) {
    event.preventDefault();
    window.location.href = '/auth/facebook';
  });
});