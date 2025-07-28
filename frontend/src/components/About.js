import React from 'react';
import './About.css'; // Optional, for additional styles

function About() {
  return (
    <div className="about-container">
      <h1>About Our Online Examination System</h1>
      <p>
        Our Digital Examination Platform is a real-time, secure web application designed to streamline
        the online exam process for institutions and students. It features powerful role management,
        live monitoring, and smart exam automation.
      </p>

      <h2>🎯 Key Roles and Responsibilities</h2>
      <ul>
        <li><strong>Superadmin:</strong> Manages all admins, oversees system-wide settings, and ensures overall security and data integrity.</li>
        <li><strong>Admin:</strong> Creates and manages exams, questions, schedules, sends exam links via Gmail, and monitors candidates.</li>
        <li><strong>User (Candidate):</strong> Receives a unique exam link via email, logs in using register number, attends the exam with camera monitoring and strict time limits.</li>
      </ul>

      <h2>🔐 Secure Authentication</h2>
      <ul>
        <li>Email and password-based login for Superadmin and Admins.</li>
        <li>Register number-based login for Users (Candidates).</li>
        <li>JWT Token and bcrypt encryption ensure secure session management.</li>
      </ul>

      <h2>📸 Camera Monitoring</h2>
      <p>
        Before the exam begins, candidates must allow camera access. A live photo is captured for identity verification.
        The camera stays active during the exam for monitoring (with backend logging possible for violations).
      </p>

      <h2>🚫 Tab Shifting Detection</h2>
      <p>
        The system detects when a candidate leaves the exam tab (e.g., switches to another tab or window). If repeated,
        it auto-submits the exam or flags the attempt.
      </p>

      <h2>⏱️ Timer and Exam Flow</h2>
      <ul>
        <li>Each exam is timed using a countdown timer (e.g., 15 minutes).</li>
        <li>Once the timer hits zero or the user submits early, the exam is auto-evaluated.</li>
        <li>Supports Multiple Choice Questions (MCQs) with one correct option.</li>
      </ul>

      <h2>📄 Score Popup and PDF Download</h2>
      <p>
        After submission, candidates immediately see a score popup showing total score, category-wise breakdown, and
        exam date. They can also download the scorecard as a PDF (using jsPDF and html2canvas).
      </p>

      <h2>📨 Gmail Integration (Email Exam Links)</h2>
      <p>
        Admins can send automated emails using Gmail (via Nodemailer with App Password). These emails include:
        <ul>
          <li>User's exam details</li>
          <li>Unique exam link (generated using Ngrok)</li>
          <li>Exam time, date, and other instructions</li>
        </ul>
      </p>

      <h2>🌐 Ngrok Integration for Exam Access</h2>
      <p>
        Exams are hosted locally and exposed securely to the internet using Ngrok. Admins copy the Ngrok HTTPS link and send it to users via Gmail.
        This enables exam participation from anywhere without public server deployment.
      </p>

      <h2>📊 Admin Dashboard</h2>
      <ul>
        <li>Create/update/delete questions</li>
        <li>View exam results and download reports</li>
        <li>Track user activity and camera captures</li>
      </ul>

      <h2>🚀 Technologies Used</h2>
      <ul>
        <li><strong>Frontend:</strong> React.js, Tailwind CSS</li>
        <li><strong>Backend:</strong> Node.js, Express.js</li>
        <li><strong>Database:</strong> MySQL</li>
        <li><strong>Authentication:</strong> JWT, bcrypt</li>
        <li><strong>Email:</strong> Nodemailer with Gmail App Password</li>
        <li><strong>Camera & Monitoring:</strong> JavaScript MediaDevices API</li>
        <li><strong>PDF Download:</strong> jsPDF and html2canvas</li>
        <li><strong>Hosting:</strong> Ngrok for public exam access</li>
      </ul>

      <h2>💡 Our Mission</h2>
      <p>
        We aim to create a user-friendly, tamper-proof online exam platform for educational institutions,
        ensuring fairness, automation, and ease of administration.
      </p>

      <h2>🔗 Try It Now</h2>
      <p>
        Visit the <a href="/">Home</a> page to see current exam notifications or try a demo.
      </p>
    </div>
  );
}

export default About;
