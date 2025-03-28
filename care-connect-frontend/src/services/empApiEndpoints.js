import { API_BASE_URL } from "../api/apiConfig";

export async function fetchPatients() {
  try {
    const url = `${API_BASE_URL}/patients`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    if (error.name === "AbortError") {
      //console.log("Fetch aborted");
    } else {
      console.error("Error fetching patients", error);
    }
    throw error;
  }
}
export async function addPatient(bodyToSend) {
  try {
    const url = `${API_BASE_URL}/patients`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyToSend),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    if (error.name === "AbortError") {
      //console.log("Fetch aborted");
    } else {
      console.error("Error adding patient", error);
    }
    throw error;
  }
}

export async function editPatient(bodyToSend, id) {
  try {
    const url = `${API_BASE_URL}/patients/${id}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyToSend),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    if (error.name === "AbortError") {
      //console.log("Fetch aborted");
    } else {
      console.error("Error adding patient", error);
    }
    throw error;
  }
}

export async function deletePatient(id) {
  try {
    const url = `${API_BASE_URL}/patients/${id}`;

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    if (error.name === "AbortError") {
      //console.log("Fetch aborted");
    } else {
      console.error("Error deleting patient", error);
    }
    throw error;
  }
}
export async function addPatientVitals(vitalsData) {
  try {
    const url = `${API_BASE_URL}/vitals`;    

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(vitalsData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    if (error.name === "AbortError") {
      //console.log("Fetch aborted");
    } else {
      console.error("Error adding vitals", error);
    }
    throw error;
  }
}
export async function fetchPatientLastVitals(patientId) {
  try {
    const url = `${API_BASE_URL}/vitals/last/${patientId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    if (error.name === "AbortError") {
      //console.log("Fetch aborted");
    } else {
      console.error("Error fetching patient data", error);
    }
    throw error;
  }
}
