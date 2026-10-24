import { useEffect, useState } from 'react';
import './admin.css';
import { API_BASE_URL } from '../../config/api.js';

const REQUESTS_API_URL = `${API_BASE_URL}/api/v1/fetch-credit`;
const UPDATE_CREDIT_URL = `${API_BASE_URL}/api/v1/update-credit`;
const EXPORT_CREDIT_URL = `${API_BASE_URL}/api/v1/export-credit`;
const loginUrl = `${API_BASE_URL}/api/v1/login-authenticate`;
const STATUSES = ['New', 'In-Progress', 'Done'];
const REQUEST_TYPES = [
    { value: 'individual', label: 'Individual' },
    { value: 'business', label: 'Business' },
    { value: 'loan', label: 'Loan' },
];
const PAGE_SIZE = 10;
const FIELDS = {
    fullName: 'Full name',
    email: 'Email',
    mobile: 'Mobile',
    type: 'Request type',
    businessName: 'Business name',
    gstin: 'GSTIN',
    pan: 'PAN',
    requirement: 'Requirement',
    status: 'Status',
    creationDate: 'Created',
    updateDate: 'Updated',
};

function normalizeStatus(value) {
    return String(value ?? '').trim().toLowerCase().replace(/[\s_]+/g, '-');
}

function formatStatus(value) {
    const normalizedStatus = normalizeStatus(value);
    return normalizedStatus === 'in-progress'
        ? 'In progress'
        : normalizedStatus
            ? normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1)
            : 'Unknown';
}

function formatFieldValue(value) {
    if (value === null || value === undefined || value === '') {
        return '—';
    }

    return String(value);
}

function getRequestType(request) {
    const type = String(request.type ?? '').trim();
    return type ? `${type.charAt(0).toUpperCase()}${type.slice(1)}` : 'Request';
}

function normalizeRequestType(value) {
    return String(value ?? '').trim().toLowerCase();
}

function getRequestKey(request, index) {
    return request.id ?? request.mobile ?? request.email ?? index;
}

function getErrorMessage(error, fallback) {
    return error instanceof Error ? error.message : fallback;
}

function getDownloadFilename(response, status, type) {
    const disposition = response.headers.get('content-disposition') ?? '';
    const match = disposition.match(/filename="?([^";]+)"?/i);
    const filename = match?.[1]?.split(/[\\/]/).pop();
    return filename || `credit-requests-${normalizeStatus(status)}-${type.toLowerCase()}.csv`;
}

function RequestCard({ request, updating, isUpdating, onUpdate }) {
    return (
        <article className="admin-record">
            <header className="admin-record-heading">
                <div>
                    <h4>{request.fullName || `${getRequestType(request)} request`}</h4>
                    <span className="admin-record-meta">{getRequestType(request)}</span>
                </div>
                <span className="admin-status-badge">{formatStatus(request.status)}</span>
            </header>

            <dl className="admin-record-details">
                {Object.entries(FIELDS)
                    .filter(([field]) => field in request)
                    .map(([field, label]) => (
                        <div className="admin-record-field" key={field}>
                            <dt>{label}</dt>
                            <dd>{formatFieldValue(request[field])}</dd>
                        </div>
                    ))}
            </dl>

            <div aria-label="Update request status" className="admin-record-actions">
                {STATUSES.filter(
                    (nextStatus) => normalizeStatus(nextStatus) !== normalizeStatus(request.status),
                ).map((nextStatus) => (
                    <button
                        disabled={updating || normalizeStatus(request.status) === 'done'}
                        key={nextStatus}
                        onClick={() => onUpdate(request, nextStatus)}
                        type="button"
                    >
                        {isUpdating ? 'Updating...' : `Set ${formatStatus(nextStatus)}`}
                    </button>
                ))}
            </div>
        </article>
    );
}

function Admin() {
    const [password, setPassword] = useState('');
    const [authenticated, setAuthenticated] = useState(false);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [updatingMobile, setUpdatingMobile] = useState('');
    const [exportingType, setExportingType] = useState('');
    const [error, setError] = useState('');
    const [exportError, setExportError] = useState('');
    const [status, setStatus] = useState('New');
    const [page, setPage] = useState(0);
    const [refresh, setRefresh] = useState(0);
    const [loginError, setLoginError] = useState('');

    useEffect(() => {
        if (!authenticated) return;

        const controller = new AbortController();

        async function loadRequests() {
            setLoading(true);
            setError('');
            setRequests([]);

            try {
                const params = new URLSearchParams({
                    page: String(page),
                    size: String(PAGE_SIZE),
                    fieldName: 'status',
                    value: status,
                });
                const url = `${REQUESTS_API_URL}?${params}`;
                const response = await fetch(url, { signal: controller.signal });

                if (!response.ok) {
                    throw new Error(`Request failed (${response.status})`);
                }

                const data = await response.json();
                if (!Array.isArray(data)) {
                    throw new Error('The API response must be a list of requests.');
                }

                setRequests(data);
            } catch (requestError) {
                if (controller.signal.aborted) return;

                setRequests([]);
                setError(getErrorMessage(requestError, 'Could not load requests.'));
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        loadRequests();
        return () => controller.abort();
    }, [authenticated, page, refresh, status]);

    async function updateRequestStatus(request, nextStatus) {
        setUpdatingMobile(request.mobile);
        setError('');

        try {
            const response = await fetch(
                `${UPDATE_CREDIT_URL}/${encodeURIComponent(request.mobile)}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        status: nextStatus,
                        type: request.type
                    }),
                },
            );

            if (!response.ok) {
                throw new Error(`Status update failed (${response.status})`);
            }

            setPage(0);
            setRefresh((count) => count + 1);
        } catch (requestError) {
            setError(getErrorMessage(requestError, 'Could not update the request status.'));
        } finally {
            setUpdatingMobile('');
        }
    }

    async function exportRequests(type) {
        setExportingType(type);
        setExportError('');

        try {
            const response = await fetch(EXPORT_CREDIT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status, type }),
            });

            if (!response.ok) {
                throw new Error(`CSV export failed (${response.status})`);
            }

            const csv = await response.blob();
            const downloadUrl = URL.createObjectURL(csv);
            const downloadLink = document.createElement('a');
            downloadLink.href = downloadUrl;
            downloadLink.download = getDownloadFilename(response, status, type);
            document.body.appendChild(downloadLink);
            downloadLink.click();
            downloadLink.remove();
            window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
        } catch (exportRequestError) {
            setExportError(getErrorMessage(exportRequestError, 'Could not download the CSV file.'));
        } finally {
            setExportingType('');
        }
    }

    async function login(event) {
        event.preventDefault();
        try {
            const response = await fetch(loginUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    password: password
                })
            });

            if (!response.ok) {
                throw new Error(`Login failed (${response.status})`);
            }

            const data = await response.json();
            if (data.status === true) {
                setAuthenticated(true);
                setLoginError('');
            } else {
                setLoginError('Incorrect password. Please try again.');
            }
        } catch (error) {
            setLoginError(getErrorMessage(error, 'Could not log in. Please try again.'));
        }
    }

    if (!authenticated) {
        return (
            <main className="admin-page">
                <form className="admin-login" onSubmit={login}>
                    <h1>Admin login</h1>
                    <label htmlFor="admin-password">Password</label>
                    <input
                        id="admin-password"
                        onChange={(event) => setPassword(event.target.value)}
                        required
                        type="password"
                        value={password}
                    />
                    {loginError && <p className="admin-error" role="alert">{loginError}</p>}
                    <button type="submit">Login</button>
                </form>
            </main>
        );
    }

    const requestsByType = REQUEST_TYPES.map((type) => ({
        ...type,
        requests: requests.filter(
            (request) => normalizeRequestType(request.type) === type.value,
        ),
    }));
    const categorizedRequests = requestsByType.reduce(
        (total, section) => total + section.requests.length,
        0,
    );
    const otherRequests = requests.filter(
        (request) => !REQUEST_TYPES.some(
            (type) => normalizeRequestType(request.type) === type.value,
        ),
    );

    return (
        <main className="admin-page">
            <header className="admin-header">
                <h1>Credit improvement requests</h1>
                <button
                    disabled={loading || updatingMobile !== ''}
                    onClick={() => setRefresh((count) => count + 1)}
                    type="button"
                >
                    {loading ? 'Loading...' : 'Refresh'}
                </button>
            </header>

            <nav aria-label="Filter requests by status" className="admin-status-tabs">
                {STATUSES.map((requestStatus) => (
                    <button
                        aria-pressed={status === requestStatus}
                        className="admin-status-tab"
                        key={requestStatus}
                        onClick={() => {
                            setStatus(requestStatus);
                            setPage(0);
                        }}
                        type="button"
                    >
                        {requestStatus === 'In-Progress' ? 'In progress' : requestStatus}
                    </button>
                ))}
            </nav>

            {error && <p className="admin-error" role="alert">{error}</p>}
            {exportError && <p className="admin-error" role="alert">{exportError}</p>}
            {loading && <p className="admin-message">Loading requests...</p>}
            {!loading && !error && requests.length === 0 && (
                <p className="admin-message">No data found.</p>
            )}

            {!loading && !error && requests.length > 0 && (
                <>
                    <section aria-label={`${formatStatus(status)} requests`} className="admin-status-panel">
                        <h2>{formatStatus(status)} requests</h2>
                        <div className="admin-type-grid">
                            {requestsByType.map((section) => (
                                <section className="admin-type-panel" key={section.value}>
                                    <div className="admin-type-heading">
                                        <h3>{section.label} requests</h3>
                                        <button
                                            className="admin-export-button"
                                            disabled={exportingType !== ''}
                                            onClick={() => exportRequests(section.label)}
                                            type="button"
                                        >
                                            {exportingType === section.label ? 'Downloading...' : 'Download CSV'}
                                        </button>
                                    </div>
                                    {section.requests.length === 0 ? (
                                        <p className="admin-message">
                                            No {section.label.toLowerCase()} requests on this page.
                                        </p>
                                    ) : (
                                        <div className="admin-records">
                                            {section.requests.map((request, index) => (
                                                <RequestCard
                                                    key={`${getRequestKey(request, index)}-${index}`}
                                                    request={request}
                                                    updating={updatingMobile !== ''}
                                                    isUpdating={updatingMobile === request.mobile}
                                                    onUpdate={updateRequestStatus}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </section>
                            ))}
                        </div>

                        {categorizedRequests < requests.length && (
                            <section className="admin-type-panel admin-other-panel">
                                <h3>Other requests</h3>
                                <div className="admin-records">
                                    {otherRequests.map((request, index) => (
                                        <RequestCard
                                            key={`${getRequestKey(request, index)}-${index}`}
                                            request={request}
                                            updating={updatingMobile !== ''}
                                            isUpdating={updatingMobile === request.mobile}
                                            onUpdate={updateRequestStatus}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}
                    </section>

                    {(page > 0 || requests.length === PAGE_SIZE) && (
                        <nav aria-label="Request pages" className="admin-pagination">
                            <button
                                disabled={loading || page === 0}
                                onClick={() => setPage(page - 1)}
                                type="button"
                            >
                                Previous
                            </button>
                            <span>Page {page + 1}</span>
                            <button
                                disabled={loading || requests.length < PAGE_SIZE}
                                onClick={() => setPage(page + 1)}
                                type="button"
                            >
                                Next
                            </button>
                        </nav>
                    )}
                </>
            )}
        </main>
    );
}

export default Admin;
