// src/App.jsx
import React, { useState } from 'react';
import './App.css';

function App() {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '', style: '' });

  const showNotification = (msg, style) => {
    setToast({ show: true, msg, style });
    setTimeout(() => setToast({ show: false, msg: '', style: '' }), 5000);
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

      // 2. Parse results carefully
      const result = await response.json();

      // 3. Official UGC Response Flags
      if (result.Flag === 1) {
        showNotification('✅ SUCCESS: Data Submitted to UGC Portal!', 'success');
        e.target.reset();
      } else if (result.Flag === 3) {
        showNotification('⚠️ DUPLICATE: Record already exists.', 'warning');
      } else {
        // Fallback for cases where UGC returns Flag=0 or error messages
        showNotification(`❌ FAILED: ${result.Message || 'UGC Portal Rejected Submission'}`, 'error');
      }
    } catch (err) {
      // 4. Client-side fetch failed (network level)
      showNotification('❌ CONNECTION ERROR: Please try again or check your Vercel logs.', 'error');
      console.error(err);
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
          <button className="close-btn" type="button" onClick={() => window.location.reload()}>&times;</button>
        </header>

        <div className="form-body">
          <form onSubmit={handleSubmit} className="form-grid">
            
            <div className="form-group">
              <label>DEB Unique ID</label>
              <input type="text" name="DEBuniqueID" placeholder="022604242032" required autoComplete="off" />
            </div>

            <div className="form-group">
              <label>Enrollment Number</label>
              <input type="text" name="EnrollmentNumber" placeholder="C26PMH21500001" required autoComplete="off" />
            </div>

            <div className="form-group">
              <label>Course Name (DEB Code)</label>
              <input type="text" name="CourseName" placeholder="ODL47003" required autoComplete="off" />
            </div>

            <div className="form-group">
              <label>Admission Date</label>
              <input type="text" name="AdmissionDate" placeholder="19-02-2026" required autoComplete="off" />
            </div>

            <div className="form-group">
              <label>Category</label>
              <input type="text" name="Category" placeholder="MBC" required autoComplete="off" />
            </div>

            <div className="form-group">
              <label>Government Identifier</label>
              <input type="text" name="GovernmentIdentifier" placeholder="AADHAR Card" required autoComplete="off" />
            </div>

            <div className="form-group">
              <label>Govt Identifier Number</label>
              <input type="text" name="GovernmentIdentifierNumber" placeholder="655882365116" required autoComplete="off" />
            </div>

            <div className="form-group">
              <label>University Name</label>
              <input type="text" name="UniversityName" defaultValue="U-0470" required readOnly={false} />
            </div>

            <div className="form-group">
              <label>Admission Details</label>
              <input type="text" name="AdmissionDetails" defaultValue="NA" required />
            </div>

            <div className="form-group">
              <label>Mode of Education</label>
              <select name="ModeEducation" required>
                <option value="Open and Distance Learning (ODL)">Open and Distance Learning (ODL)</option>
                <option value="Online Mode">Online Mode</option>
              </select>
            </div>

            <div className="form-group">
              <label>Locality</label>
              <input type="text" name="Locality" placeholder="Rural" required />
            </div>

            <div className="form-group">
              <label>Nationality</label>
              <input type="text" name="Nationality" defaultValue="Indian" required />
            </div>
            
            {/* Essential Backend-only Fields */}
            <input type="hidden" name="Aishe_Code" value="U-0470" />
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
