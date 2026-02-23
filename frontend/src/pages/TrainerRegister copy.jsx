import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faPaperclip } from "@fortawesome/free-solid-svg-icons";

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
  const [loading, setLoading] = useState(false);

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
    
    // Handle simple fields
    const simpleFields = ['name', 'email', 'contact', 'city', 'state', 'country', 'bio', 'linkedin', 'instagram', 'website', 'blog'];
    simpleFields.forEach(field => {
      if (form[field] !== null && form[field] !== undefined) {
        data.append(field, form[field]);
      }
    });

    // Handle file uploads
    if (form.cv) {
      data.append('cv', form.cv);
    }

    // Handle array fields - append each item individually
    form.area_of_expertise.forEach(item => {
      data.append('area_of_expertise', item);
    });

    form.audience.forEach(item => {
      data.append('audience', item);
    });

    // Handle nested objects - use the format DRF expects
    education.forEach((edu, index) => {
      if (edu.name || edu.agency || edu.eligibility_date) {
        data.append(`education[${index}].name`, edu.name || '');
        data.append(`education[${index}].agency`, edu.agency || '');
        data.append(`education[${index}].eligibility_date`, edu.eligibility_date || '');
        if (edu.certificate) {
          data.append(`education[${index}].certificate`, edu.certificate);
        }
      }
    });

    clients.forEach((client, index) => {
      if (client.client_name || client.year) {
        data.append(`past_clients[${index}].client_name`, client.client_name || '');
        data.append(`past_clients[${index}].year`, client.year || '');
      }
    });

    testimonials.forEach((testimonial, index) => {
      if (testimonial.testimonial_text || testimonial.author_name || testimonial.author_email) {
        data.append(`testimonials[${index}].testimonial_text`, testimonial.testimonial_text || '');
        data.append(`testimonials[${index}].author_name`, testimonial.author_name || '');
        data.append(`testimonials[${index}].author_email`, testimonial.author_email || '');
      }
    });

    console.log('Submitting data...');
    for (let [key, value] of data.entries()) {
      console.log(key, value);
    }

    try {
      const res = await axios.post("http://127.0.0.1:8001/api/trainers/register/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Trainer registered successfully!");
      
      // Reset form state
      setForm({
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
      setEducation([{ name: "", agency: "", eligibility_date: "", certificate: null }]);
      setClients([{ client_name: "", year: "" }]);
      setTestimonials([{ testimonial_text: "", author_name: "", author_email: "" }]);
    } catch (err) {
      console.error("Registration error:", err.response?.data);
      setMessage("Registration failed! Check fields again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-5 bg-light" style={{ minHeight: "100vh" }}>
        <div className="card shadow-lg p-5 mx-3" style={{ borderRadius: "16px" }}>
            <h3 className="text-center text-teal mb-4">Trainer Registration</h3>

        {message && <div className="alert alert-info">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Full Name <span style={{ color: "red" }}>*</span></label>
              <input className="form-control" name="name" required onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Email <span style={{ color: "red" }}>*</span></label>
              <input type="email" className="form-control" name="email" required onChange={handleChange} />
            </div>

            <div className="col-md-6">
              <label className="form-label">Contact <span style={{ color: "red" }}>*</span></label>
              <input className="form-control" name="contact" required onChange={handleChange} />
            </div>

            <div className="col-md-6">
              <label className="form-label">CV Upload</label>
              <input type="file" className="form-control" name="cv" onChange={handleChange} />
            </div>

            <div className="col-12">
              <label className="form-label">Area of Expertise</label>
              <div className="d-flex flex-wrap gap-2">
                {expertiseOptions.map((opt) => (
                  <span
                    key={opt}
                    className={`badge rounded-pill ${form.area_of_expertise.includes(opt) ? "bg-primary" : "bg-light text-dark border"}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => toggleSelection("area_of_expertise", opt)}
                  >
                    {opt}
                  </span>
                ))}
              </div>
            </div>

            <div className="col-12">
              <label className="form-label">Target Audience</label>
              <div className="d-flex flex-wrap gap-2">
                {audienceOptions.map((opt) => (
                  <span
                    key={opt}
                    className={`badge rounded-pill ${form.audience.includes(opt) ? "bg-success" : "bg-light text-dark border"}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => toggleSelection("audience", opt)}
                  >
                    {opt}
                  </span>
                ))}
              </div>
            </div>

            <div className="col-12">
              <label className="form-label">Bio</label>
              <textarea className="form-control" name="bio" rows="3" onChange={handleChange}></textarea>
            </div>

            {/* EDUCATION */}
            <h5 className="mt-4">Education</h5>
            {education.map((edu, i) => (
              <div className="row g-2" key={i}>
                <div className="col-md-4"><input placeholder="Name" className="form-control"
                  value={edu.name} onChange={(e) => handleNestedChange(setEducation, i, "name", e.target.value)} /></div>
                <div className="col-md-4"><input placeholder="Agency" className="form-control"
                  value={edu.agency} onChange={(e) => handleNestedChange(setEducation, i, "agency", e.target.value)} /></div>
                <div className="col-md-3"><input type="date" className="form-control"
                  value={edu.eligibility_date} onChange={(e) => handleNestedChange(setEducation, i, "eligibility_date", e.target.value)} /></div>
                <div className="col-md-1 d-flex align-items-center">
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => removeField(setEducation, i)}><FontAwesomeIcon icon={faTrash} /></button>
                </div>
              </div>
            ))}
            <button type="button" className="btn btn-outline-primary btn-sm mt-2" onClick={() => addField(setEducation, { name: "", agency: "", eligibility_date: "", certificate: null })}>
              <FontAwesomeIcon icon={faPlus} /> Add Education
            </button>

            {/* CLIENTS */}
            <h5 className="mt-4">Past Clients</h5>
            {clients.map((c, i) => (
              <div className="row g-2" key={i}>
                <div className="col-md-6"><input placeholder="Client Name" className="form-control"
                  value={c.client_name} onChange={(e) => handleNestedChange(setClients, i, "client_name", e.target.value)} /></div>
                <div className="col-md-5"><input placeholder="Year" className="form-control"
                  value={c.year} onChange={(e) => handleNestedChange(setClients, i, "year", e.target.value)} /></div>
                <div className="col-md-1 d-flex align-items-center">
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => removeField(setClients, i)}><FontAwesomeIcon icon={faTrash} /></button>
                </div>
              </div>
            ))}
            <button type="button" className="btn btn-outline-primary btn-sm mt-2" onClick={() => addField(setClients, { client_name: "", year: "" })}>
              <FontAwesomeIcon icon={faPlus} /> Add Client
            </button>

            {/* TESTIMONIALS */}
            <h5 className="mt-4">Testimonials</h5>
            {testimonials.map((t, i) => (
              <div className="row g-2" key={i}>
                <div className="col-md-4"><input placeholder="Author Name" className="form-control"
                  value={t.author_name} onChange={(e) => handleNestedChange(setTestimonials, i, "author_name", e.target.value)} /></div>
                <div className="col-md-4"><input placeholder="Author Email" className="form-control"
                  value={t.author_email} onChange={(e) => handleNestedChange(setTestimonials, i, "author_email", e.target.value)} /></div>
                <div className="col-md-3"><input placeholder="Testimonial" className="form-control"
                  value={t.testimonial_text} onChange={(e) => handleNestedChange(setTestimonials, i, "testimonial_text", e.target.value)} /></div>
                <div className="col-md-1 d-flex align-items-center">
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => removeField(setTestimonials, i)}><FontAwesomeIcon icon={faTrash} /></button>
                </div>
              </div>
            ))}
            <button type="button" className="btn btn-outline-primary btn-sm mt-2" onClick={() => addField(setTestimonials, { testimonial_text: "", author_name: "", author_email: "" })}>
              <FontAwesomeIcon icon={faPlus} /> Add Testimonial
            </button>
          </div>

          <div className="text-center mt-4">
            <button type="submit" className="btn btn-success px-4" disabled={loading}>
              {loading ? "Registering..." : "Submit Registration"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrainerRegister;