import { Toast, ToastContainer } from "react-bootstrap";

export default function ToastAlert({ show = true, setShow , message="", variant = "warning" }) {
  return (
    <ToastContainer position="top-end" className="mt-3">
      <Toast bg={variant} onClose={() => setShow()} show={show} delay={3000} autohide>
        <Toast.Body className="text-white">{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
