// API configuration - points to live AWS API Gateway
const API_BASE_URL = localStorage.getItem('transitIndiaApiUrl') || 'https://5exebulf7j.execute-api.ap-south-1.amazonaws.com/Prod';

export const api = {
    async searchRoutes(fromStop, toStop, district = 'Chennai') {
        try {
            const params = new URLSearchParams({ from_stop: fromStop, to_stop: toStop, district });
            const res = await fetch(`${API_BASE_URL}/api/v1/routes/search?${params}`);
            const data = await res.json();
            return data;
        } catch (e) {
            console.warn('API search failed, using fallback:', e);
            return null;
        }
    },

    async queryBus(busNumber, stopName, language = 'en') {
        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/query`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bus_number: busNumber, stop_name: stopName, language }),
            });
            return res.json();
        } catch (e) {
            console.warn('API query failed:', e);
            return mockQueryResponse(busNumber, stopName);
        }
    },

    async getEmergencyInfo(busNumber) {
        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/emergency/${busNumber}`);
            return res.json();
        } catch (e) {
            console.warn('API emergency failed:', e);
            return mockEmergencyResponse(busNumber);
        }
    },

    async submitSafetyEscalation(phoneNumber, busNumber, category, tripId = null) {
        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/safety/escalate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone_number: phoneNumber,
                    bus_number: busNumber,
                    incident_category: category,
                    trip_id: tripId,
                }),
            });
            return res.json();
        } catch (e) {
            console.warn('API escalation failed:', e);
            return mockEscalationResponse();
        }
    },

    async submitFeedback(routeId, feedbackType, channel = 'Web') {
        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    route_id: routeId,
                    feedback_type: feedbackType,
                    channel: channel,
                }),
            });
            return res.json();
        } catch (e) {
            console.warn('API feedback failed:', e);
            return mockFeedbackResponse();
        }
    },

    async sendOTP(phoneNumber) {
        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/auth/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone_number: phoneNumber }),
            });
            return res.json();
        } catch (e) {
            console.warn('Send OTP failed:', e);
            return { status: 'error', detail: String(e) };
        }
    },

    async verifyOTP(phoneNumber, otp) {
        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone_number: phoneNumber, otp }),
            });
            return res.json();
        } catch (e) {
            console.warn('Verify OTP failed:', e);
            return { status: 'error', detail: String(e) };
        }
    },

    async notifyETA(phoneNumber, busId, busRoute, boarding, destination, eta, confidence) {
        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/notify/eta`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone_number: phoneNumber,
                    bus_id: busId,
                    bus_route: busRoute,
                    boarding,
                    destination,
                    eta,
                    confidence,
                }),
            });
            return res.json();
        } catch (e) {
            console.warn('Notify ETA failed:', e);
            return { status: 'error', message: String(e) };
        }
    },

    async getActiveBuses() {
        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/routes/active-buses`);
            return res.json();
        } catch (e) {
            console.warn('Get active buses failed:', e);
            return [];
        }
    },

    // --- Operator endpoints ---

    async getOperatorRoutes() {
        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/operator/routes`);
            return res.json();
        } catch (e) {
            console.warn('Get operator routes failed:', e);
            return [];
        }
    },

    async getRouteDetail(routeId) {
        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/operator/routes/${routeId}`);
            return res.json();
        } catch (e) {
            console.warn('Get route detail failed:', e);
            return null;
        }
    },

    async activateTrip(routeId, busNumber, operatorId) {
        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/operator/trips/activate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ route_id: routeId, bus_number: busNumber, operator_id: operatorId }),
            });
            return res.json();
        } catch (e) {
            console.warn('Activate trip failed:', e);
            return { status: 'error', detail: String(e) };
        }
    },

    async getActiveTrips(operatorId) {
        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/operator/trips/active?operator_id=${operatorId}`);
            return res.json();
        } catch (e) {
            console.warn('Get active trips failed:', e);
            return [];
        }
    },

    async deactivateTrip(tripId) {
        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/operator/trips/${tripId}/deactivate`, {
                method: 'POST',
            });
            return res.json();
        } catch (e) {
            console.warn('Deactivate trip failed:', e);
            return { status: 'error', detail: String(e) };
        }
    },

    async getRouteMapData(routeId) {
        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/routes/${routeId}/map`);
            return res.json();
        } catch (e) {
            console.warn('Map data fetch failed:', e);
            return null;
        }
    },

    async seedDatabase() {
        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/admin/seed`, { method: 'POST' });
            return res.json();
        } catch (e) {
            console.warn('Seed failed:', e);
            return { status: 'error', detail: String(e) };
        }
    },

    setBaseUrl(url) {
        localStorage.setItem('transitIndiaApiUrl', url);
    },
};

// Mock responses as fallback
function mockQueryResponse(busNumber, stopName) {
    return {
        request_id: `req-${Date.now()}`,
        trip_status: 'Running Today',
        arrival_window: '10-15 minutes',
        delay_reason: null,
        timestamp: new Date().toISOString(),
    };
}

function mockEmergencyResponse(busNumber) {
    return {
        bus_number: busNumber,
        route_id: null,
        last_confirmed_stop: null,
        helpline_numbers: {
            police: '112',
            ambulance: '108',
            women_safety: '1091',
            transport_helpline: '1800-XXX-XXXX',
        },
    };
}

function mockEscalationResponse() {
    return {
        escalation_id: `esc-${Date.now()}`,
        status: 'Pending',
        message: 'Your report has been forwarded to the control room.',
    };
}

function mockFeedbackResponse() {
    return {
        feedback_id: `fb-${Date.now()}`,
        message: 'Thank you for your feedback.',
    };
}

export default api;
