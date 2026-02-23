import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

const TrainerRegister = () => {
  const [education, setEducation] = useState([{ name: "", agency: "", eligibility_date: "" }]);
  const [clients, setClients] = useState([{ client_name: "", year: "" }]);
  const [testimonials, setTestimonials] = useState([{ testimonial_text: "", author_name: "", author_email: "" }]);

  const expertiseOptions = ["Teamwork", "Leadership", "Conflict Management", "Communication", "Decision Making"];
  const audienceOptions = ["Students", "Corporate", "Youth Groups", "NGOs"];

  const [form, setForm] = useState({
    area_of_expertise: [],
    audience: [],
  });

  const toggleSelection = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((i) => i !== value)
        : [...prev[field], value],
    }));
  };

  const handleNestedChange = (setFn, index, field, value) => {
    setFn((prev) => prev.map((it, i) => (i === index ? { ...it, [field]: value } : it)));
  };

  const addField = (setFn, obj) => setFn((prev) => [...prev, obj]);
  const removeField = (setFn, index) => setFn((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
      e.preventDefault();

      const formData = new FormData();

      // Basic fields
      formData.append("name", e.target.name.value);
      formData.append("email", e.target.email.value);
      formData.append("contact", e.target.contact.value);
      formData.append("bio", e.target.bio.value);

      if (e.target.cv.files[0]) {
        formData.append("cv", e.target.cv.files[0]);
      }

      // Arrays (stringified for DRF multipart)
      formData.append("area_of_expertise", JSON.stringify(form.area_of_expertise));
      formData.append("audience", JSON.stringify(form.audience));
      formData.append("education", JSON.stringify(education));
      formData.append("past_clients", JSON.stringify(clients));
      formData.append("testimonials", JSON.stringify(testimonials));
      try {
        const response = await fetch("http://localhost:8001/api/trainers/register/", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        if (!response.ok) {
          alert(JSON.stringify(data));
          return;
        }
        alert("Trainer registered successfully!");
      } catch (error) {
        console.error(error);
        alert("Something went wrong.");
      }
  };

  return (
    <div className="container-fluid py-5" style={{ minHeight: "100vh" }}>
      <div className="card p-4 shadow">
        <h3 className="text-center text-teal mb-4">Trainer Registration</h3>

        {/* PURE HTML FORM SUBMIT */}
        <form onSubmit={handleSubmit}>
        {/* <form action="http://127.0.0.1:8001/api/trainers/register/" method="POST" encType="multipart/form-data"> */}

          {/* <input type="hidden" name="area_of_expertise" value={JSON.stringify(form.area_of_expertise)} />
          <input type="hidden" name="audience" value={JSON.stringify(form.audience)} />
          <input type="hidden" name="education" value={JSON.stringify(education)} />
          <input type="hidden" name="past_clients" value={JSON.stringify(clients)} />
          <input type="hidden" name="testimonials" value={JSON.stringify(testimonials)} /> */}

          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Full Name *</label>
              <input className="form-control" name="name" required />
            </div>

            <div className="col-md-6">
              <label>Email *</label>
              <input className="form-control" name="email" type="email" required />
            </div>

            <div className="col-md-6">
              <label>Contact *</label>
              <input className="form-control" name="contact" required />
            </div>

            <div className="col-md-6">
              <label>Upload CV</label>
              <input className="form-control" type="file" name="cv" />
            </div>

            {/* Expertise */}
            <div className="col-12">
              <label>Area of Expertise</label>
              <div className="d-flex gap-2 flex-wrap">
                {expertiseOptions.map((opt) => (
                  <span
                    key={opt}
                    className={`badge rounded-pill ${form.area_of_expertise.includes(opt) ? "bg-success" : "bg-light text-dark border"}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => toggleSelection("area_of_expertise", opt)}
                  >
                    {opt}
                  </span>
                ))}
              </div>
            </div>

            {/* Audience */}
            <div className="col-12">
              <label>Target Audience</label>
              <div className="d-flex gap-2 flex-wrap">
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

            {/* BIO */}
            <div className="col-12">
              <label>Bio</label>
              <textarea className="form-control" name="bio" rows="3"></textarea>
            </div>

            {/* EDUCATION */}
            <h5 className="mt-4">Education</h5>
            {education.map((edu, i) => (
              <div className="row g-2" key={i}>
                <div className="col-md-4">
                  <input placeholder="Name" className="form-control"
                    value={edu.name}
                    onChange={(e) => handleNestedChange(setEducation, i, "name", e.target.value)}
                  />
                </div>

                <div className="col-md-4">
                  <input placeholder="Agency" className="form-control"
                    value={edu.agency}
                    onChange={(e) => handleNestedChange(setEducation, i, "agency", e.target.value)}
                  />
                </div>

                <div className="col-md-3">
                  <input type="date" className="form-control"
                    value={edu.eligibility_date}
                    onChange={(e) => handleNestedChange(setEducation, i, "eligibility_date", e.target.value)}
                  />
                </div>

                <div className="col-md-1 d-flex align-items-center">
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => removeField(setEducation, i)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            ))}
            <button type="button" className="btn btn-outline-success btn-sm mt-2"
              onClick={() => addField(setEducation, { name: "", agency: "", eligibility_date: "" })}
            >
              <FontAwesomeIcon icon={faPlus} /> Add Education
            </button>

            {/* CLIENTS */}
            <h5 className="mt-4">Past Clients</h5>
            {clients.map((c, i) => (
              <div className="row g-2" key={i}>
                <div className="col-md-6">
                  <input placeholder="Client Name" className="form-control"
                    value={c.client_name}
                    onChange={(e) => handleNestedChange(setClients, i, "client_name", e.target.value)}
                  />
                </div>

                <div className="col-md-5">
                  <input placeholder="Year" className="form-control"
                    value={c.year}
                    onChange={(e) => handleNestedChange(setClients, i, "year", e.target.value)}
                  />
                </div>

                <div className="col-md-1 d-flex align-items-center">
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => removeField(setClients, i)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            ))}

            <button type="button" className="btn btn-outline-success btn-sm mt-2"
              onClick={() => addField(setClients, { client_name: "", year: "" })}
            >
              <FontAwesomeIcon icon={faPlus} /> Add Client
            </button>

            {/* TESTIMONIALS */}
            <h5 className="mt-4">Testimonials</h5>
            {testimonials.map((t, i) => (
              <div className="row g-2" key={i}>
                <div className="col-md-4">
                  <input placeholder="Author Name" className="form-control"
                    value={t.author_name}
                    onChange={(e) => handleNestedChange(setTestimonials, i, "author_name", e.target.value)}
                  />
                </div>

                <div className="col-md-4">
                  <input placeholder="Author Email" className="form-control"
                    value={t.author_email}
                    onChange={(e) => handleNestedChange(setTestimonials, i, "author_email", e.target.value)}
                  />
                </div>

                <div className="col-md-3">
                  <input placeholder="Testimonial" className="form-control"
                    value={t.testimonial_text}
                    onChange={(e) => handleNestedChange(setTestimonials, i, "testimonial_text", e.target.value)}
                  />
                </div>

                <div className="col-md-1 d-flex align-items-center">
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => removeField(setTestimonials, i)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            ))}

            <button type="button" className="btn btn-outline-success btn-sm mt-2"
              onClick={() => addField(setTestimonials, { testimonial_text: "", author_name: "", author_email: "" })}
            >
              <FontAwesomeIcon icon={faPlus} /> Add Testimonial
            </button>
          </div>

          <div className="text-center mt-4">
            <button type="submit" className="btn btn-success px-5">Submit</button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default TrainerRegister;