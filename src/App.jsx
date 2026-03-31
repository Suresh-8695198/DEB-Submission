// src/App.jsx (Final Toast Notification Logic)
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
    
    // Validate form data
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      // 1. Send data to Vercel Node API
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      /**
       * ✅ SMART NOTIFICATION LOGIC
       */
      const msg = result.Message || result.Status || 'Sync Error';
      const isDuplicate = msg.toLowerCase().includes('already') || result.Flag === 3;
      const isSuccess = msg.toLowerCase().includes('success') || result.Flag === 1;

      if (isSuccess && !isDuplicate) {
        // GREEN: A brand new student was registered!
        showNotification(`✅ SUCCESS: ${msg}`, 'success');
        e.target.reset();
      } else if (isDuplicate) {
        // YELLOW: The student was already there!
        showNotification(`⚠️ DUPLICATE: ${msg}`, 'warning');
      } else {
        // RED: There was an actual problem (like AISHE Code mismatch)
        showNotification(`❌ FAILED: ${msg}`, 'error');
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
            <div className="form-group"><label>DEB Unique ID</label><input type="text" name="DEBuniqueID" placeholder="022604242032" required /></div>
            <div className="form-group"><label>Enrollment Number</label><input type="text" name="EnrollmentNumber" placeholder="C2PMH..." required /></div>
            <div className="form-group"><label>Aishe_Code (Must match API Key)</label><input type="text" name="Aishe_Code" defaultValue="U-0470" required /></div>
            <div className="form-group"><label>Admission Date</label><input type="text" name="AdmissionDate" placeholder="19-02-2026" required /></div>
            <div className="form-group"><label>Category</label><input type="text" name="Category" placeholder="MBC" required /></div>
            <div className="form-group"><label>Government Identifier</label><input type="text" name="GovernmentIdentifier" defaultValue="AADHAR Card" required /></div>
            <div className="form-group"><label>Govt Identifier Number</label><input type="text" name="GovernmentIdentifierNumber" placeholder="ID Number" required /></div>
            <div className="form-group"><label>University Name (UGC Code)</label><input type="text" name="UniversityName" defaultValue="U-0470" required /></div>
            <div className="form-group"><label>Course Name (DEB Code)</label><input type="text" name="CourseName" placeholder="ODL47003" required /></div>
            <div className="form-group"><label>Admission Details</label><input type="text" name="AdmissionDetails" defaultValue="NA" required /></div>
            <div className="form-group"><label>Locality</label><input type="text" name="Locality" defaultValue="Rural" required /></div>
            <div className="form-group"><label>Nationality</label><input type="text" name="Nationality" defaultValue="Indian" required /></div>
            <div className="form-group full-width"><label>Mode of Education</label><select name="ModeEducation" required><option value="Open and Distance Learning (ODL)">ODL</option><option value="Online Mode">Online Mode</option></select></div>
            <input type="hidden" name="CountryResidence" value="India" />
            <div className="form-group full-width"><button type="submit" className="submit-btn" disabled={loading}>{loading && <div className="spinner"></div>}<span>{loading ? 'TRANSMITTING...' : 'SEND DATA TO UGC'}</span></button></div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default App;
