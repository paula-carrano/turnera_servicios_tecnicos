import { useCallback, useEffect, useState } from "react";
import RequestFormScreen from "./screens/request-form/RequestFormScreen.jsx";
import RequestListScreen from "./screens/request-list/RequestListScreen.jsx";
import {
  createServiceRequest,
  getServiceRequest,
  listServiceRequests,
  updateServiceRequest,
} from "./services/serviceRequestApi.js";

export default function App() {
  const [screen, setScreen] = useState("list");
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setRequests(await listServiceRequests());
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const openCreate = () => {
    setSelectedRequest(null);
    setScreen("form");
  };

  const openEdit = async (id) => {
    setError("");
    try {
      setSelectedRequest(await getServiceRequest(id));
      setScreen("form");
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const saveRequest = async (values) => {
    if (selectedRequest) {
      await updateServiceRequest(selectedRequest.id, values);
    } else {
      await createServiceRequest(values);
    }
    setScreen("list");
    setSelectedRequest(null);
    await loadRequests();
  };

  if (screen === "form") {
    return (
      <RequestFormScreen
        request={selectedRequest}
        onSave={saveRequest}
        onCancel={() => setScreen("list")}
      />
    );
  }

  return (
    <RequestListScreen
      requests={requests}
      loading={loading}
      error={error}
      onRetry={loadRequests}
      onCreate={openCreate}
      onEdit={openEdit}
    />
  );
}
