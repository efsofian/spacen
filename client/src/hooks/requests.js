const API_URL = "http://localhost:8000/v1";

async function httpGetPlanets() {
  const resp = await fetch(`${API_URL}/planets`);
  return await resp.json();
}

async function httpGetLaunches() {
  const resp = await fetch(`${API_URL}/launches`);
  const fetchedLaunches = await resp.json();
  return fetchedLaunches.sort((a, b) => {
    return a.flightNumber - b.flightNumber;
  });
}

async function httpSubmitLaunch(launch) {
  try {
    return await fetch(`${API_URL}/launches`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(launch),
    });
  } catch (e) {
    return {
      ok: false,
    };
  }
}

async function httpAbortLaunch(id) {
  try {
    return await fetch(`${API_URL}/launches/${id}`, {
      method: "delete",
    });
  } catch (e) {
    return {
      ok: false,
    };
  }
}
export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
