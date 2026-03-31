// src/App.jsx
import React, { useState } from 'react';
import './App.css';

function App() {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '', style: '' });

  // 1. SHOW NOTIFICATION
  const showNotification = (msg, style) => {
    setToast({ show: true, msg, style });
    setTimeout(() => setToast({ show: false, msg: '', style: '' }), 6000);
  };

  // 2. HANDLE FORM SUBMISSION
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Capture data directly from the form
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      // 3. SEND TO OUR VERCEL SERVERLESS FUNCTION
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error('API Sync Failure');

      const result = await response.json();

      // UGC Response Logic (Flag 1=Success, 3=Duplicate, etc)
      if (result.Flag === 1) {
        showNotification('✅ SUCCESS: Data sync with UGC portal successful!', 'success');
        e.target.reset();
      } else if (result.Flag === 3) {
        showNotification('⚠️ DUPLICATE: Record already exists in UGC database.', 'warning');
      } else {
        showNotification(`❌ FAILED: ${result.Message || 'Verification failed'}`, 'error');
      }

    } catch (err) {
      showNotification('❌ NETWORK ERROR: Please check your Vercel logs or connection.', 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="portal-wrapper">
      {toast.show && (
        <div className={`status-toast toast-${toast.style}`}>
          {toast.msg}
        </div>
      )}

      <main className="portal-container">
        <header className="portal-header">
          <h1>UGC DEB PORTAL DATA SYNC</h1>
          <p>Institutional Admission Synchronization System (Powered by Node.js & React)</p>
        </header>

        <form onSubmit={handleSubmit} className="form-grid">
          
          <div className="form-group">
            <label>DEB Unique ID</label>
            <input type="text" name="DEBuniqueID" placeholder="022604248267" required />
          </div>

          <div className="form-group">
            <label>AISHE Code</label>
            <input type="text" name="Aishe_Code" placeholder="U-0470" required />
          </div>

          <div className="form-group">
            <label>Enrollment No.</label>
            <input type="text" name="EnrollmentNumber" placeholder="C26PEN..." required />
          </div>

          <div className="form-group">
            <label>Course Code</label>
            <input type="text" name="CourseName" placeholder="ODL47002" required />
          </div>

          <div className="form-group">
            <label>Admission Date</label>
            <input type="text" name="AdmissionDate" placeholder="DD-MM-YYYY" required />
          </div>

          <div className="form-group">
            <label>Education Mode</label>
            <select name="ModeEducation" required>
              <option value="">-- Choose Mode --</option>
              <option value="Open and Distance Learning (ODL)">ODL</option>
              <option value="Online Mode">Online</option>
            </select>
          </div>

          <div className="form-group">
            <label>Category</label>
            <select name="Category" required>
              <option value="">Select Category</option>
              <option value="General">General</option>
              <option value="OBC">OBC</option>
              <option value="SC">SC / ST</option>
            </select>
          </div>

          <div className="form-group">
            <label>ID Document</label>
            <select name="GovernmentIdentifier" required>
              <option value="AADHAR Card">Aadhaar Card (UIDAI)</option>
              <option value="PAN Card">PAN Card</option>
              <option value="Passport">Passport</option>
            </select>
          </div>

          <div className="form-group">
            <label>Document ID No.</label>
            <input type="text" name="GovernmentIdentifierNumber" placeholder="ID Number" required />
          </div>

          <div className="form-group">
            <label>Locality</label>
            <select name="Locality" required>
              <option value="RURAL">Rural Area</option>
              <option value="URBAN">Urban Area</option>
            </select>
          </div>

          <div className="form-group full-width">
            <label>University Identification</label>
            <input type="text" name="UniversityName" placeholder="University ID or Name Code" required />
          </div>

          <input type="hidden" name="Nationality" value="Indian" />
          <input type="hidden" name="CountryResidence" value="India" />
          <input type="hidden" name="AdmissionDetails" value="Automated Portal Submission" />

          <div className="form-group full-width">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading && <div className="spinner"></div>}
              <span>{loading ? 'TRANSMITTING...' : 'SYNC TO UGC CLOUD'}</span>
            </button>
          </div>

        </form>
      </main>
    </div>
  );
}

export default App;
