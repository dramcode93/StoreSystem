import Swal from "sweetalert2";

const SuccessAlert = ({ title, text }) => {
  return Swal.fire({
    icon: "success",
    title: title,
    text: text,
    showConfirmButton: false,
    timer: 1500,
  });
};

const DeleteAlert = ({ title, text, deleteClick }) => {
  return Swal.fire({
    title: title,
    text: text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      deleteClick();
    }
  });
};

const ErrorAlert = ({ title, text, deleteClick }) => {
  return Swal.fire({
    icon: "error",
    title: "Oops...",
    text: "Something went wrong!",
    footer: '<a href="#">Why do I have this issue?</a>',
  });
};
const MaxImgAlert = ({ title, text }) => {
  return Swal.fire({
    title: title,
    text: text,
    icon: "error",
  });
};
export { SuccessAlert, DeleteAlert, ErrorAlert, MaxImgAlert };
