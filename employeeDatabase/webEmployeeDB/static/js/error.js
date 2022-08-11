let status = localStorage.getItem('error-status');
let description = localStorage.getItem('error-description');
let error_status = document.getElementById('error-status');
let error_description = document.getElementById('error-description');

error_status.innerText = 'Error ' + status;
error_description.innerText = description;