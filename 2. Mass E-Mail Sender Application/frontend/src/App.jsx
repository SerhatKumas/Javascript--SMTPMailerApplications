import { useState } from 'react';
import { Mail, Users, FileText, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import './index.css';

const DEFAULT_SUBJECT = 'Newsletter Subscription';

const DEFAULT_BODY = `Dear Subscriber,

Thank you for subscribing to our newsletter.

Best regards,

Admin Name
Company Name
Website: example.com
Email: info@example.com`;

function App() {
    const [formData, setFormData] = useState({
        sender: 'email1@example.com',
        recipients: '',
        subject: DEFAULT_SUBJECT,
        body: DEFAULT_BODY
    });


    const [activeTab, setActiveTab] = useState('compose');
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [sendReport, setSendReport] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 5000);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.recipients || !formData.subject || !formData.body) {
            showToast('Please fill in all required fields.', 'error');
            return;
        }

        setSendReport(null);
        setIsLoading(true);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

            const payload = {
                ...formData,
                body: formData.body.replace(/\n/g, '<br />')
            };

            const response = await fetch(`${apiUrl}/api/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                showToast(data.message || 'Emails sent successfully!');
                setSendReport({
                    successCount: data.sentEmails ? data.sentEmails.length : 0,
                    sentEmails: data.sentEmails || [],
                    failed: data.failed || []
                });
                setFormData(prev => ({ ...prev, recipients: '', subject: DEFAULT_SUBJECT, body: DEFAULT_BODY }));
            } else {
                showToast(data.error || 'Failed to send emails.', 'error');
                if (data.details) {
                    console.error('Send errors:', data.details);
                }
            }
        } catch (error) {
            console.error('Submission error:', error);
            showToast('A network error occurred. Please make sure the backend is running.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <div className="view-container dashboard-view">
                        <header className="view-header">
                            <h2>Dashboard Overview</h2>
                            <p className="subtitle">Welcome to your Mass Mailer command center.</p>
                        </header>

                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon-wrapper blue">
                                    <Send size={24} />
                                </div>
                                <div className="stat-info">
                                    <h3>Total Sent</h3>
                                    <p className="stat-value">1,248</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon-wrapper green">
                                    <CheckCircle2 size={24} />
                                </div>
                                <div className="stat-info">
                                    <h3>Delivery Rate</h3>
                                    <p className="stat-value">99.2%</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon-wrapper purple">
                                    <Users size={24} />
                                </div>
                                <div className="stat-info">
                                    <h3>Active Campaigns</h3>
                                    <p className="stat-value">3</p>
                                </div>
                            </div>
                        </div>

                        <div className="recent-activity-card">
                            <h3>Recent Activity (Placeholder)</h3>
                            <div className="activity-placeholder">
                                <p>Tracking will appear here as you send campaigns.</p>
                            </div>
                        </div>
                    </div>
                );
            case 'compose':
                return (
                    <div className="view-container">
                        <header className="view-header">
                            <h2>Compose Message</h2>
                            <p className="subtitle">Draft and send beautiful emails to your network.</p>
                        </header>

                        {sendReport && (
                            <div className="report-card" style={{ padding: '15px', backgroundColor: '#ecfdf5', border: '1px solid #10b981', borderRadius: '8px', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                    <h3 style={{ color: '#047857', margin: 0 }}>Campaign Report</h3>
                                    <button onClick={() => setSendReport(null)} style={{ background: 'none', border: 'none', color: '#047857', cursor: 'pointer', fontSize: '18px' }} title="Close">&times;</button>
                                </div>
                                <p style={{ color: '#065f46', marginBottom: '8px' }}><strong>Successfully sent to {sendReport.successCount} recipients:</strong></p>
                                <div style={{ maxHeight: '150px', overflowY: 'auto', backgroundColor: '#ffffff', padding: '10px', borderRadius: '6px', border: '1px solid #a7f3d0', fontSize: '14px', color: '#374151' }}>
                                    {sendReport.sentEmails.length > 0 ? sendReport.sentEmails.join(', ') : 'None'}
                                </div>
                                {sendReport.failed && sendReport.failed.length > 0 && (
                                    <div style={{ marginTop: '15px' }}>
                                        <p style={{ color: '#991b1b', marginBottom: '8px' }}><strong>Failed to send to:</strong></p>
                                        <div style={{ maxHeight: '150px', overflowY: 'auto', backgroundColor: '#fef2f2', padding: '10px', borderRadius: '6px', border: '1px solid #fecaca', fontSize: '14px', color: '#7f1d1d' }}>
                                            {sendReport.failed.map((f, i) => (
                                                <div key={i} style={{ marginBottom: '4px' }}><strong>{f.email}</strong>: {f.error}</div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="form-card">
                            <form onSubmit={handleSubmit}>
                                <div className="form-row split">
                                    <div className="form-group flex-1">
                                        <label htmlFor="sender">
                                            <Mail className="icon" size={18} />
                                            Sender Identity
                                        </label>
                                        <select
                                            id="sender"
                                            name="sender"
                                            value={formData.sender}
                                            onChange={handleChange}
                                        >
                                            <option value="email1@example.com">email1@example.com</option>
                                            <option value="email2@example.com">email2@example.com</option>
                                            <option value="email3@example.com">email3@example.com</option>
                                        </select>
                                    </div>

                                    <div className="form-group flex-2">
                                        <label htmlFor="subject">
                                            <FileText className="icon" size={18} />
                                            Subject Line
                                        </label>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            placeholder="Catchy email subject..."
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="recipients">
                                        <Users className="icon" size={18} />
                                        Mailing List
                                    </label>
                                    <textarea
                                        id="recipients"
                                        name="recipients"
                                        value={formData.recipients}
                                        onChange={handleChange}
                                        placeholder="Enter target email addresses separated by commas or newlines..."
                                        className="textarea-recipients"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="body">
                                        <FileText className="icon" size={18} />
                                        Email Content
                                    </label>
                                    <textarea
                                        id="body"
                                        name="body"
                                        value={formData.body}
                                        onChange={handleChange}
                                        placeholder="Compose your message here..."
                                        className="textarea-body"
                                    />
                                </div>

                                <div className="form-actions">
                                    <button type="submit" className="btn-submit" disabled={isLoading}>
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="spinner" size={20} />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <Send size={20} />
                                                Launch Campaign
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                );
            case 'history':
                return (
                    <div className="view-container">
                        <header className="view-header">
                            <h2>Sent History</h2>
                            <p className="subtitle">Review your past communications.</p>
                        </header>
                        <div className="empty-state">
                            <FileText size={48} className="empty-icon text-muted" />
                            <h3>No history captured yet</h3>
                            <p>History log features are planned for a future update.</p>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="sidebar-brand">
                    <div className="brand-logo">MM</div>
                    <div className="brand-text">
                        <h1>Mass Mailer</h1>
                        <span>Mailer Platform</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <button
                        className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        <div className="nav-icon"><AlertCircle size={20} /></div>
                        <span>Dashboard</span>
                    </button>

                    <button
                        className={`nav-item ${activeTab === 'compose' ? 'active' : ''}`}
                        onClick={() => setActiveTab('compose')}
                    >
                        <div className="nav-icon"><Mail size={20} /></div>
                        <span>Compose</span>
                    </button>

                    <button
                        className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
                        onClick={() => setActiveTab('history')}
                    >
                        <div className="nav-icon"><FileText size={20} /></div>
                        <span>History (Beta)</span>
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <div className="profile-badge">
                        <img src="https://ui-avatars.com/api/?name=Admin&background=3b82f6&color=fff" alt="Profile" />
                        <div class="profile-info">
                            <span class="profile-name">Admin</span>
                            <span class="profile-role">Administrator</span>
                        </div>
                    </div>
                </div>
            </aside>

            <main className="main-content">
                <div className="content-wrapper">
                    {renderContent()}
                </div>
            </main>

            {toast && (
                <div className="toast-container">
                    <div className={`toast ${toast.type}`}>
                        {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                        <span>{toast.message}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
