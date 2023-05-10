//DATA TABLE
$(document).ready(function () {
  //GLOBAL DATA TABLE
  ("use strict");
  $("#data-datatable").DataTable({
    language: {
      paginate: {
        previous: "<i class='mdi mdi-chevron-left'>",
        next: "<i class='mdi mdi-chevron-right'>",
      },
      info: "Showing agents _START_ to _END_ of _TOTAL_",
      lengthMenu:
        '<select class=\'form-select form-select-sm ms-1 me-1\'><option value="20">20</option><option value="50">50</option><option value="100">100</option><option value="-1">All</option></select>',
    },
    pageLength: 20,
    select: { style: "multi" },
    order: [[1, "desc"]],
    drawCallback: function () {
      $(".dataTables_paginate > .pagination").addClass("pagination-rounded"),
        $("#data-datatable_length label").addClass("form-label"),
        document
          .querySelector(".dataTables_wrapper .row")
          .querySelectorAll(".col-md-12")
          .forEach(function (e) {
            e.classList.add("col-sm-6"), e.classList.remove("col-sm-12"), e.classList.remove("col-md-6");
          });
    },
  });
});

//Delete function
function delete_data(endpoints, _id) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        type: "POST",
        url: endpoints + _id,
        dataType: "json",
        data: null,
        success: function (result) {
          //remove row in table
          if (result.status) {
            var table = $("#data-datatable").DataTable();
            table
              .row($(`#${_id}`))
              .remove()
              .draw();
          }
          //show alert message
          const Toast = sweetAlertMixinConfig();
          Toast.fire({
            icon: result.icon,
            title: result.message,
          });
        },
      }).fail(function (res) {
        errorSweetAlert();
      });
    }
  });
}

//SWEET ALERT CONFIG
function errorSweetAlert() {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: "Something went wrong!",
  });
}

function sweetAlertMixinConfig() {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });
  return Toast;
}
