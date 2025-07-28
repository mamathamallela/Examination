import React, { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ScorePopup = ({ username, userid, score, categoryScores, questionPaper, onClose }) => {
  const [notificationText, setNotificationText] = useState('');
  const [userDetails, setUserDetails] = useState({});
  const [logo, setLogo] = useState('');
  const printableRef = useRef();

  useEffect(() => {
    fetchNotificationText(userid);
    fetchUserDetails(userid);
  }, [userid]);

  const fetchNotificationText = async (userId) => {
    try {
      const response = await fetch(`/api/users/notification/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch notification text');
      const data = await response.json();
      setNotificationText(data.notification_text);
      setLogo(data.uploadlogo);
    } catch (error) {
      console.error('Error fetching notification text:', error);
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      const response = await fetch(`/api/users/user-details/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user details');
      const data = await response.json();
      setUserDetails(data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US');
  };

  const getFormattedDateTime = () => {
    const currentDate = new Date();
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return currentDate.toLocaleDateString('en-US', options);
  };

  const getMessage = (score, username) => {
    if (score < 20) {
      return `${username}! Your score is below 20. You can improve!`;
    } else if (score >= 20 && score <= 35) {
      return `${username}! Your score is between 21 and 35. Good job!`;
    } else {
      return `Congratulations, ${username}! Your score is between 36 and 50. Excellent work!`;
    }
  };

  const totalMarks = questionPaper.reduce((total, category) => {
    const marksPerQuestion = 2;
    const categoryTotalMarks = category.questions.length * marksPerQuestion;
    return total + categoryTotalMarks;
  }, 0);

  const percentageScore = (score / totalMarks) * 100;

  const downloadScorePage = () => {
    const input = printableRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pdfWidth * 0.8;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const x = (pdfWidth - imgWidth) / 2;
      const y = 10;

      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      pdf.save(`ScoreCard_${userid}.pdf`);
      onClose();
    });
  };

  return (
    <div className="p-5 bg-white text-center">
      <div ref={printableRef} className="p-5 text-left">
        <div className="mb-6">
          <div className="flex flex-col items-center">
            <img src={logo} alt="Notification Logo" className="w-24 h-24 object-contain mb-4" />
            <h1 className="text-2xl font-bold text-center">
              {notificationText}
              <br />
              <span className="text-lg block mt-2">Memorandum Of Category wise Performance</span>
              <span className="text-md block mt-1 text-gray-600">Conducted by brightcomgroup</span>
            </h1>
          </div>
          <hr className="my-4 border-gray-300" />
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="space-y-2 text-lg">
              <p><strong>Register Number:</strong> {userid}</p>
              <p><strong>Username:</strong> {username}</p>
              <p><strong>Gender:</strong> {userDetails.gender}</p>
              <p><strong>Date of Birth:</strong> {formatDate(userDetails.birthDate)}</p>
            </div>
            <div>
              <img src={`Images/${userid}.png`} alt="User Avatar" className="w-24 h-24 object-cover rounded-full border border-gray-400" />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Category-wise Scores:</h2>
          <table className="w-full border border-gray-300 text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">Category</th>
                <th className="border px-3 py-2">Total Marks</th>
                <th className="border px-3 py-2">Score</th>
                <th className="border px-3 py-2">Grade</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(categoryScores).map(([category, catScore]) => {
                const totalCatMarks = questionPaper.find(cat => cat.category === category).questions.length * 2;
                let grade;
                if (catScore < totalCatMarks * 0.4) grade = 'D';
                else if (catScore < totalCatMarks * 0.6) grade = 'C';
                else if (catScore < totalCatMarks * 0.8) grade = 'B';
                else grade = 'A';

                return (
                  <tr key={category}>
                    <td className="border px-3 py-2">{category}</td>
                    <td className="border px-3 py-2">{totalCatMarks}</td>
                    <td className="border px-3 py-2">{catScore}</td>
                    <td className="border px-3 py-2">{grade}</td>
                  </tr>
                );
              })}
              <tr className="font-semibold bg-gray-50">
                <td className="border px-3 py-2">Total Marks:</td>
                <td className="border px-3 py-2">{totalMarks}</td>
                <td className="border px-3 py-2">{score}</td>
                <td className="border px-3 py-2">
                  {(() => {
                    let grade;
                    if (score < totalMarks * 0.4) grade = 'D';
                    else if (score < totalMarks * 0.6) grade = 'C';
                    else if (score < totalMarks * 0.8) grade = 'B';
                    else grade = 'A';
                    return grade;
                  })()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-lg">
          <p><strong>Percentage Score:</strong> {percentageScore.toFixed(2)}%</p>
        </div>

        <div className="mt-4 space-y-1">
          <p className="text-base">{getMessage(score, username)}</p>
          <p className="text-base">Your dedication and performance in {notificationText}.</p>
          <p className="text-base">Thank you for being a part of this examination. Your results are now available for download.</p>
        </div>

        <hr className="my-4 border-gray-300" />

        <div className="text-sm text-gray-500 text-center">
          <p>Conducted by BCG Digital Examinations</p>
          <p>Date and Time: {getFormattedDateTime()}</p>
        </div>
      </div>

      <button
        onClick={downloadScorePage}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Download Score Page
      </button>
    </div>
  );
};

export default ScorePopup;
