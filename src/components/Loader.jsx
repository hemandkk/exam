import { Spinner } from "react-bootstrap";

export default function Loader({ loading }) {
  return (
    <>
    {loading && (
      <div className="d-flex mt-4">
        <Spinner animation="border" variant="primary" />
      </div>
    )}
    </>
  );
}
