import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

const TrainerRegister = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    area_of_expertise: [],
    audience: [],
    city: "",
    state: "",
    country: "India",
    bio: "",
    linkedin: "",
    instagram: "",
    website: "",
    blog: "",
    cv: null,
  });

  const [education, setEducation] = useState([{ name: "", agency: "", eligibility_date: "", certificate: null }]);
  const [clients, setClients] = useState([{ client_name: "", year: "" }]);
  const [testimonials, setTestimonials] = useState([{ testimonial_text: "", author_name: "", author_email: "" }]);
  const [message, setMessage] = useState("");

  const expertiseOptions = ["Teamwork", "Leadership", "Conflict Management", "Communication", "Decision Making"];
  const audienceOptions = ["Students", "Corporate", "Youth Groups", "NGOs"];

  const toggleSelection = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleNestedChange = (setFn, index, field, value) => {
    setFn((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const addField = (setFn, newItem) => setFn((prev) => [...prev, newItem]);
  const removeField = (setFn, index) => setFn((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (Array.isArray(value)) data.append(key, JSON.stringify(value));
      else data.append(key, value);
    });

    data.append("education", JSON.stringify(education));
    data.append("past_clients", JSON.stringify(clients));
    data.append("testimonials", JSON.stringify(testimonials));

    try {
      const res = await axios.post("http://127.0.0.1:8001/api/trainers/register/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("✅ Trainer registered successfully!");
      e.target.reset();
    } catch (err) {
      console.error(err.response?.data);
      setMessage("❌ Registration failed! Check fields again.");
    }
  };

  return (
    <div className="bg-gradient-header w-100 py-5">
      <div className="container">
        <div className="card p-5 shadow-lg" style={{ borderRadius: "16px" }}>
          <h3 className="text-center text-teal mb-4 fw-bold">Trainer Registration</h3>
          {message && <div className="alert alert-info text-center">{message}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Full Name <span style={{ color: "red" }}>*</span></label>
                <input className="form-control" name="name" required onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Email <span style={{ color: "red" }}>*</span></label>
                <input type="email" className="form-control" name="email" required onChange={handleChange} />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Contact <span style={{ color: "red" }}>*</span></label>
                <input className="form-control" name="contact" required onChange={handleChange} />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">CV Upload</label>
                <input type="file" className="form-control" name="cv" onChange={handleChange} />
              </div>

              <div className="col-12 mt-3">
                <label className="form-label fw-semibold">Area of Expertise</label>
                <div className="d-flex flex-wrap gap-2">
                  {expertiseOptions.map((opt) => (
                    <span
                      key={opt}
                      className={`badge rounded-pill ${
                        form.area_of_expertise.includes(opt)
                          ? "bg-teal text-white"
                          : "bg-light text-dark border"
                      }`}
                      style={{ cursor: "pointer" }}
                      onClick={() => toggleSelection("area_of_expertise", opt)}
                    >
                      {opt}
                    </span>
                  ))}
                </div>
              </div>

              <div className="col-12 mt-3">
                <label className="form-label fw-semibold">Target Audience</label>
                <div className="d-flex flex-wrap gap-2">
                  {audienceOptions.map((opt) => (
                    <span
                      key={opt}
                      className={`badge rounded-pill ${
                        form.audience.includes(opt)
                          ? "bg-success text-white"
                          : "bg-light text-dark border"
                      }`}
                      style={{ cursor: "pointer" }}
                      onClick={() => toggleSelection("audience", opt)}
                    >
                      {opt}
                    </span>
                  ))}
                </div>
              </div>

              <div className="col-12 mt-3">
                <label className="form-label fw-semibold">Bio</label>
                <textarea className="form-control" name="bio" rows="3" onChange={handleChange}></textarea>
              </div>

              {/* EDUCATION */}
              <h5 className="mt-4 text-teal fw-semibold">Education</h5>
              {education.map((edu, i) => (
                <div className="row g-2 align-items-center" key={i}>
                  <div className="col-md-4">
                    <input placeholder="Name" className="form-control"
                      value={edu.name} onChange={(e) => handleNestedChange(setEducation, i, "name", e.target.value)} />
                  </div>
                  <div className="col-md-4">
                    <input placeholder="Agency" className="form-control"
                      value={edu.agency} onChange={(e) => handleNestedChange(setEducation, i, "agency", e.target.value)} />
                  </div>
                  <div className="col-md-3">
                    <input type="date" className="form-control"
                      value={edu.eligibility_date} onChange={(e) => handleNestedChange(setEducation, i, "eligibility_date", e.target.value)} />
                  </div>
                  <div className="col-md-1 text-center">
                    <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => removeField(setEducation, i)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              ))}
              <button type="button" className="btn btn-outline-primary btn-sm mt-2"
                onClick={() => addField(setEducation, { name: "", agency: "", eligibility_date: "", certificate: null })}>
                <FontAwesomeIcon icon={faPlus} /> Add Education
              </button>

              {/* CLIENTS */}
              <h5 className="mt-4 text-teal fw-semibold">Past Clients</h5>
              {clients.map((c, i) => (
                <div className="row g-2 align-items-center" key={i}>
                  <div className="col-md-6">
                    <input placeholder="Client Name" className="form-control"
                      value={c.client_name} onChange={(e) => handleNestedChange(setClients, i, "client_name", e.target.value)} />
                  </div>
                  <div className="col-md-5">
                    <input placeholder="Year" className="form-control"
                      value={c.year} onChange={(e) => handleNestedChange(setClients, i, "year", e.target.value)} />
                  </div>
                  <div className="col-md-1 text-center">
                    <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => removeField(setClients, i)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              ))}
              <button type="button" className="btn btn-outline-primary btn-sm mt-2"
                onClick={() => addField(setClients, { client_name: "", year: "" })}>
                <FontAwesomeIcon icon={faPlus} /> Add Client
              </button>

              {/* TESTIMONIALS */}
              <h5 className="mt-4 text-teal fw-semibold">Testimonials</h5>
              {testimonials.map((t, i) => (
                <div className="row g-2 align-items-center" key={i}>
                  <div className="col-md-4">
                    <input placeholder="Author Name" className="form-control"
                      value={t.author_name} onChange={(e) => handleNestedChange(setTestimonials, i, "author_name", e.target.value)} />
                  </div>
                  <div className="col-md-4">
                    <input placeholder="Author Email" className="form-control"
                      value={t.author_email} onChange={(e) => handleNestedChange(setTestimonials, i, "author_email", e.target.value)} />
                  </div>
                  <div className="col-md-3">
                    <input placeholder="Testimonial" className="form-control"
                      value={t.testimonial_text} onChange={(e) => handleNestedChange(setTestimonials, i, "testimonial_text", e.target.value)} />
                  </div>
                  <div className="col-md-1 text-center">
                    <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => removeField(setTestimonials, i)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              ))}
              <button type="button" className="btn btn-outline-primary btn-sm mt-2"
                onClick={() => addField(setTestimonials, { testimonial_text: "", author_name: "", author_email: "" })}>
                <FontAwesomeIcon icon={faPlus} /> Add Testimonial
              </button>
            </div>

            <div className="text-center mt-5">
              <button type="submit" className="btn btn-success px-5 py-2 shadow-sm">
                Submit Registration
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TrainerRegister;