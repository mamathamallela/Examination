import React from 'react';
import './Contact.css';


const Contact = () => {
  const [result, setResult] = React.useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending...");
    const formData = new FormData(event.target);

    // ✅ Replace with your actual Web3Forms access key
    formData.append("access_key", "3e723910-c33b-4f30-b46c-331791582364");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      setResult("Form Submitted Successfully ✅");
      event.target.reset();
    } else {
      console.log("Error:", data);
      setResult(data.message);
    }
  };

  return (
    
    <div>
        
      <div className="navbar-with-bg">
             </div>
      <div className="contactUS-container">
        <div className="contact-image"></div>
        <div className="contact-form shadow-effect">
          <h1>Contact Me</h1>          
            <form onSubmit={onSubmit}>
            <input type="text" name="name" placeholder="Your Name" required />
            <input type="email" name="email" placeholder="Your Email" required />
            <input type="text" name="Mobile Number" placeholder="Your Mobile Number" required />
            <textarea name="message" rows="4" placeholder="Your Message" required />
            <button type="submit">Send Message</button>
          </form>
          <p>{result}</p>
        </div>
      </div>
  
    </div>
  );
};

export default Contact;
