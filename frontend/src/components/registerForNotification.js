import React, { useState, useRef, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import "./employe.css";

const EmploymentApplicationForm = () => {
  const { notificationId, notificationText } = useParams();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState(new Date());
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [cityDistrict, setCityDistrict] = useState("");
  const [state, setState] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [resume, setResume] = useState(null);
  const [uploadPhoto, setUploadPhoto] = useState(null);
  const calendarRef = useRef();
  const [errors, setErrors] = useState({});

  const handleUploadPhotoChange = (e) => {
    const selectedFile = e.target.files[0];
    setUploadPhoto(selectedFile);
  };

  useEffect(() => {
    const handleDocumentClick = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        // Optional: Close calendar
      }
    };
    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, []);

  const handlePhoneNumberChange = (e) => {
    const inputValue = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhoneNumber(inputValue);
  };

  const handleZipcodeChange = (e) => {
    const inputValue = e.target.value.replace(/\D/g, "").slice(0, 6);
    setZipcode(inputValue);
  };

  const handleEmailChange = (e) => {
    const inputValue = e.target.value;
    setEmail(inputValue);
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue);
    setErrors({ ...errors, email: isValidEmail ? '' : "Please enter a valid email address" });
  };

  const handleResumeChange = (e) => {
    const selectedFile = e.target.files[0];
    setResume(selectedFile);
  };

  const validateForm = () => {
    const newErrors = {};

    if (phoneNumber.length !== 10) {
      newErrors.phoneNumber = "Phone number must be 10 digits.";
    }

    const today = new Date();
    const minDOB = new Date(today.setFullYear(today.getFullYear() - 5));
    if (birthDate > minDOB) {
      newErrors.birthDate = "You must be at least 5 years old.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (zipcode.length !== 6) {
      newErrors.zipcode = "PIN code must be 6 digits.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix form errors before submitting.");
      return;
    }

    const formattedBirthDate = birthDate.toISOString().split("T")[0];

    const formData = new FormData();
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("gender", gender);
    formData.append("birth_date", formattedBirthDate);
    formData.append("phone_number", phoneNumber);
    formData.append("email", email);
    formData.append("city_district", cityDistrict);
    formData.append("state", state);
    formData.append("zipcode", zipcode);
    formData.append("uploadresume", resume);
    formData.append("uploadphoto", uploadPhoto);
    formData.append("notificationId", notificationId);
    formData.append("notificationText", notificationText);

    try {
      const response = await fetch("/api/users/submit-form", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        toast.error(`Error: ${errorMessage}`);
        return;
      }

      toast.success("Form submitted successfully!");
      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Submission failed. Please try again.");
    }
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setGender("");
    setBirthDate(new Date());
    setPhoneNumber("");
    setEmail("");
    setCityDistrict("");
    setState("");
    setZipcode("");
    setResume(null);
    setUploadPhoto(null);
    setErrors({});
  };

  return (
    <div className="bg">
      <div className="centered-text">
        <img
          src="https://img.freepik.com/free-vector/young-girl-using-tablet-education_1308-77988.jpg"
          alt=""
          className="left-image"
        />
        <h3>Registration For {notificationText}:</h3>
      </div>

      <form onSubmit={handleSubmit} className="employment-form">
        <div className="form-row">
          <div className="form-field">
            <label>First Name ***</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label>Last Name ***</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label>Gender ***</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)} required>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-field">
            <label>Date of Birth ***</label>
            <DatePicker
              selected={birthDate}
              onChange={(date) => setBirthDate(date)}
              maxDate={new Date(new Date().setFullYear(new Date().getFullYear() - 5))}
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={100}
            />
            {errors.birthDate && <p className="error">{errors.birthDate}</p>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label>Phone Number ***</label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ marginRight: "4px" }}>+91</span>
              <input
                type="text"
                placeholder="10-digit mobile number"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                required
              />
            </div>
            {errors.phoneNumber && <p className="error">{errors.phoneNumber}</p>}
          </div>

          <div className="form-field">
            <label>Email ***</label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              required
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label>City/District ***</label>
            <input
              type="text"
              value={cityDistrict}
              onChange={(e) => setCityDistrict(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label>State ***</label>
            <select value={state} onChange={(e) => setState(e.target.value)} required>
              <option value="">Select State</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Arunachal Pradesh">Arunachal Pradesh</option>
              <option value="Assam">Assam</option>
              <option value="Bihar">Bihar</option>
              <option value="Chhattisgarh">Chhattisgarh</option>
              <option value="Goa">Goa</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Haryana">Haryana</option>
              <option value="Himachal Pradesh">Himachal Pradesh</option>
              <option value="Jharkhand">Jharkhand</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Kerala">Kerala</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Manipur">Manipur</option>
              <option value="Meghalaya">Meghalaya</option>
              <option value="Mizoram">Mizoram</option>
              <option value="Nagaland">Nagaland</option>
              <option value="Odisha">Odisha</option>
              <option value="Punjab">Punjab</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Sikkim">Sikkim</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Telangana">Telangana</option>
              <option value="Tripura">Tripura</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Uttarakhand">Uttarakhand</option>
              <option value="West Bengal">West Bengal</option>
              <option value="Delhi">Delhi</option>
              <option value="Puducherry">Puducherry</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label>PIN Code ***</label>
            <input
              type="text"
              value={zipcode}
              onChange={handleZipcodeChange}
              required
            />
            {errors.zipcode && <p className="error">{errors.zipcode}</p>}
          </div>

          <div className="form-field">
            <label>Upload Resume ***</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label>Upload Photo ***</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleUploadPhotoChange}
            />
          </div>

          <button type="submit" className="submit-button">
            Submit
          </button>
        </div>
      </form>

      <ToastContainer position="bottom-center" autoClose={5000} />
    </div>
  );
};

export default EmploymentApplicationForm;
