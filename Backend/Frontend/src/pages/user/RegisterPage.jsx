import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // ✅ Added Link for navigation
import "../../css/RegistrationPage.css";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const[showPassword,setShowPassword]=useState(false)
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/register", {
        name,
        email,
        password,
        gender,
        address,
        contact,
        role: "user",
      });

      localStorage.setItem("token", res.data.token);
      setMessage("✅ Registration successful!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      if (error.response?.data?.errors) {
        setMessage("❌ " + Object.values(error.response.data.errors).join(", "));
      } else if (error.response?.data?.message) {
        setMessage("❌ " + error.response.data.message);
      } else {
        setMessage("❌ Registration failed");
      }
    }
  };

  return (
    <div className="register-container">
     <h1 className="brand-title">FitSync</h1>
     <h2 className="brand-subtitle">Registration</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <div className="password-wrapper">
        <input
          type={showPassword?"text":"password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <span 
        className="toggle-password"
        onClick={()=>setShowPassword(!showPassword)}>
          {showPassword ? "🙈" : "👁"}
        </span>
        </div>
        

        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <br />

        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <br />

        <input
          type="text"
          placeholder="Contact Number"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          required
        />
        <br />

        <button type="submit">Register</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default RegisterPage;
