import React, { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import RichTextEditor from "../components/RichTextEditor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faClipboardList,
  faUsers,
  faPaperPlane
} from "@fortawesome/free-solid-svg-icons";

const objectives = [
  "Leadership",
  "Teamwork",
  "Conflict Management",
  "Communication",
];

function getCookie(name) {
  let cookieValue = null;

  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();

      if (cookie.startsWith(name + "=")) {
        cookieValue = decodeURIComponent(
          cookie.substring(name.length + 1)
        );
        break;
      }
    }
  }

  return cookieValue;
};

const CreateReflection = () => {

  const [selectedObjectives, setSelectedObjectives] = useState([]);

  const [participants, setParticipants] = useState([
    {
      name:"",
      email:"",
      role:"",
      years_experience:"",
      department:"",
      city:"",
      state:"",
      country:"India",
      comments:""
    }
  ]);

  const [form,setForm] = useState({
    title:"",
    duration_from:"",
    duration_to:"",
    design:"",
    execution:""
  });

  const toggleObjective = (val) => {
    setSelectedObjectives(prev =>
      prev.includes(val) ? prev.filter(i=>i!==val) : [...prev,val]
    );
  };

  const addParticipant = () => {

    if(participants.length >= 25) return;

    setParticipants([
      ...participants,
      {
        name:"",
        email:"",
        role:"",
        years_experience:"",
        department:"",
        city:"",
        state:"",
        country:"India",
        comments:""
      }
    ]);
  };

  const removeParticipant = (index) => {
    setParticipants(prev => prev.filter((_,i)=>i!==index));
  };

  const updateParticipant = (i,field,val) => {
    const copy=[...participants];
    copy[i][field]=val;
    setParticipants(copy);
  };

  const submit = async () => {

    const payload = {
      ...form,
      learning_objectives:selectedObjectives,
      participants
    };

    await fetch("http://localhost:8001/api/reflections/create/",{
      method:"POST",
      credentials:"include",
      headers:{
        "Content-Type":"application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body:JSON.stringify(payload)
    });

    alert("Reflection Session Created!");
  };

  return (

    <DashboardLayout>

      <div className="card p-4">

        <h4 className="mb-4">
          <FontAwesomeIcon icon={faClipboardList} className="me-2"/>
          Create Reflection Session
        </h4>

        <label className="fw-semibold mb-1">Session Title</label>
        <input
          className="form-control mb-3"
          placeholder="Session Title"
          onChange={e=>setForm({...form,title:e.target.value})}
        />

        <div className="row mb-4">

            <div className="col-md-6">

                <label className="fw-semibold mb-1">
                <FontAwesomeIcon icon={faClipboardList} className="me-2"/>
                Duration From
                </label>

                <input
                type="date"
                className="form-control"
                value={form.duration_from}
                onChange={(e)=>
                    setForm(prev=>({...prev, duration_from:e.target.value}))
                }
                required
                />

            </div>

            <div className="col-md-6">

                <label className="fw-semibold mb-1">
                <FontAwesomeIcon icon={faClipboardList} className="me-2"/>
                Duration To
                </label>

                <input type="date" className="form-control" value={form.duration_to}
                onChange={(e)=>
                    setForm(prev=>({...prev, duration_to:e.target.value}))
                } required />

            </div>

        </div>

        {/* Learning Objectives */}

        <label className="mb-2 fw-semibold">Learning Objectives</label>

        <div className="mb-4">

          {objectives.map(o=>(
            <span
              key={o}
              className={`badge me-2 mb-2 ${selectedObjectives.includes(o)?"bg-success":"bg-light text-dark border"}`}
              style={{cursor:"pointer"}}
              onClick={()=>toggleObjective(o)}
            >
              {o}
            </span>
          ))}

        </div>

        <label className="fw-semibold mb-2">Design</label>
        <RichTextEditor id="design-editor" value={form.design} onChange={(content)=> setForm(prev=>({...prev, design: content}))} />

        <label className="fw-semibold mt-4 mb-2">Execution</label>
        <RichTextEditor id="execution-editor" value={form.execution} onChange={(content)=> setForm(prev=>({...prev, execution: content}))} />

        {/* Participants */}

        <h5 className="fw-semibold mb-3 mt-3">
          <FontAwesomeIcon icon={faUsers} className="me-2"/>
          Participants
        </h5>

        {participants.map((p,i)=>(
            <div key={i} className="border p-3 mb-3 rounded bg-light">
            <div className="row g-2">
                {/* Name */}
                <div className="col-md-4">
                <input
                    className="form-control"
                    placeholder="Name"
                    value={p.name}
                    onChange={e=>updateParticipant(i,"name",e.target.value)}
                />
                </div>

                {/* Email */}
                <div className="col-md-4">
                <input
                    className="form-control"
                    placeholder="Email"
                    type="email"
                    value={p.email}
                    onChange={e=>updateParticipant(i,"email",e.target.value)}
                />
                </div>

                {/* Role */}
                <div className="col-md-4">
                <input
                    className="form-control"
                    placeholder="Role"
                    value={p.role}
                    onChange={e=>updateParticipant(i,"role",e.target.value)}
                />
                </div>

                {/* Experience */}
                <div className="col-md-3">
                <input
                    className="form-control"
                    placeholder="Years Experience"
                    type="number"
                    value={p.years_experience}
                    onChange={e=>updateParticipant(i,"years_experience",e.target.value)}
                />
                </div>

                {/* Department */}
                <div className="col-md-3">
                <input
                    className="form-control"
                    placeholder="Department"
                    value={p.department}
                    onChange={e=>updateParticipant(i,"department",e.target.value)}
                />
                </div>

                {/* City */}
                <div className="col-md-2">
                <input
                    className="form-control"
                    placeholder="City"
                    value={p.city}
                    onChange={e=>updateParticipant(i,"city",e.target.value)}
                />
                </div>

                {/* State */}
                <div className="col-md-2">
                <input
                    className="form-control"
                    placeholder="State"
                    value={p.state}
                    onChange={e=>updateParticipant(i,"state",e.target.value)}
                />
                </div>

                {/* Country */}
                <div className="col-md-2">
                <input
                    className="form-control"
                    placeholder="Country"
                    value={p.country}
                    onChange={e=>updateParticipant(i,"country",e.target.value)}
                />
                </div>

                {/* Comments */}
                <div className="col-12">
                <textarea
                    className="form-control"
                    placeholder="Comments"
                    value={p.comments}
                    onChange={e=>updateParticipant(i,"comments",e.target.value)}
                />
                </div>

                {/* Remove button */}
                <div className="col-12 text-end">

                {participants.length > 1 && (
                    <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={()=>removeParticipant(i)}
                    >
                    <FontAwesomeIcon icon={faTrash} className="me-1"/>
                    Remove
                    </button>
                )}
                </div>
            </div>
        </div>))}

        <button className="btn btn-outline-success me-3 mb-2" onClick={addParticipant}>
          <FontAwesomeIcon icon={faPlus} className="me-2"/>
          Add Participant
        </button>

        <button className="btn btn-success" onClick={submit}>
          <FontAwesomeIcon icon={faPaperPlane} className="me-2"/>
          Create Session
        </button>

      </div>

    </DashboardLayout>

  );
};

export default CreateReflection;