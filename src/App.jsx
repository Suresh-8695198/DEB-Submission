// src/App.jsx (Restored Fields + Sync Fix)
import React, { useState } from 'react';
import './App.css';

function App() {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '', style: '' });

  const showNotification = (msg, style) => {
    setToast({ show: true, msg, style });
    setTimeout(() => setToast({ show: false, msg: '', style: '' }), 8000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Clean and validate form data
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      // 1. Call our improved Vercel Node.js Serverless API
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.Flag === 1) {
        showNotification('✅ SUCCESS: Data Submitted to UGC Portal!', 'success');
        e.target.reset();
      } else if (result.Flag === 3) {
        showNotification('⚠️ DUPLICATE: Record already exists.', 'warning');
      } else {
        // Fallback for cases where UGC returns Flag=0 or error messages
        const errMsg = result.Message || result.details || 'Aishe_Code mismatch. Check key.';
        showNotification(`❌ FAILED: ${errMsg}`, 'error');
      }
    } catch (err) {
      showNotification('❌ CONNECTION ERROR', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="portal-overlay">
      {toast.show && <div className={`status-toast toast-${toast.style}`}>{toast.msg}</div>}

      <main className="portal-modal">
        <header className="portal-header">
          <h2>UGC Admission Details Submission</h2>
        </header>

        <div className="form-body">
          <form onSubmit={handleSubmit} className="form-grid">
            
            <div className="form-group">
              <label>DEB Unique ID</label>
              <input type="text" name="DEBuniqueID" placeholder="022604242032" required />
            </div>

            <div className="form-group">
              <label>Enrollment Number</label>
              <input type="text" name="EnrollmentNumber" placeholder="C26PMH21500001" required />
            </div>

            <div className="form-group">
              <label>Course Name (DEB Code)</label>
              <input type="text" name="CourseName" placeholder="ODL47003" required />
            </div>

            <div className="form-group">
              <label>Admission Date</label>
              <input type="text" name="AdmissionDate" placeholder="19-02-2026" required />
            </div>

            <div className="form-group">
              <label>Category</label>
              <input type="text" name="Category" placeholder="MBC" required />
            </div>

            <div className="form-group">
              <label>Government Identifier</label>
              <input type="text" name="GovernmentIdentifier" defaultValue="AADHAR Card" required />
            </div>

            <div className="form-group">
              <label>Govt Identifier Number</label>
              <input type="text" name="GovernmentIdentifierNumber" placeholder="ID Number" required />
            </div>

            <div className="form-group">
              <label>University Name (UGC Code)</label>
              <input type="text" name="UniversityName" defaultValue="U-0470" required />
            </div>

            <div className="form-group">
              <label>Aishe_Code (Must match API Key)</label>
              <input type="text" name="Aishe_Code" defaultValue="U-0470" required />
            </div>

            <div className="form-group">
              <label>Admission Details</label>
              <input type="text" name="AdmissionDetails" defaultValue="NA" required />
            </div>

            <div className="form-group">
              <label>Locality</label>
              <input type="text" name="Locality" defaultValue="Rural" required />
            </div>

            <div className="form-group">
              <label>Nationality</label>
              <input type="text" name="Nationality" defaultValue="Indian" required />
            </div>

            <div className="form-group full-width">
              <label>Mode of Education</label>
              <select name="ModeEducation" required>
                <option value="Open and Distance Learning (ODL)">Open and Distance Learning (ODL)</option>
                <option value="Online Mode">Online Mode</option>
              </select>
            </div>
            
            <input type="hidden" name="CountryResidence" value="India" />

            <div className="form-group full-width">
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading && <div className="spinner"></div>}
                <span>{loading ? 'TRANSMITTING...' : 'SEND DATA TO UGC'}</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default App;
