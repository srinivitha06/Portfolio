import React, { useState } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { isFirebaseActive, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Save, Plus, Trash2, Edit3, X, Download, CloudLightning, FileText, Image as ImageIcon, Laptop } from "lucide-react";
import Card from "../components/Card";

export default function AdminDashboard({ onClose }) {
  const { data, saveData, exportPortfolioJSON, isFirebaseMode } = usePortfolio();
  
  // Tabs: 'profile', 'projects', 'certifications', 'skills'
  const [activePanel, setActivePanel] = useState("profile");

  // Form states initialized with current context data
  const [profileForm, setProfileForm] = useState({ ...data.profile });
  const [projectsList, setProjectsList] = useState([...data.projects]);
  const [certsList, setCertsList] = useState([...data.certifications]);
  const [skillsList, setSkillsList] = useState([...data.skills]);

  // Modals / Item editing states
  const [editingProject, setEditingProject] = useState(null); // null or project object
  const [editingCert, setEditingCert] = useState(null); // null or cert object
  const [editingSkillCat, setEditingSkillCat] = useState(null); // null or skill category object

  // Uploading states
  const [uploadProgress, setUploadProgress] = useState({ type: "", status: "" }); // type: 'profile'|'project'|'cert', status: 'idle'|'uploading'|'success'

  // Handle Firebase File Uploads (Storage)
  const handleFileUpload = async (e, type, targetId = null) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!isFirebaseActive) {
      alert("⚠️ You are in Local Mode. To add local images/PDFs, drop the file in your project's '/public' folder (e.g. '/public/my-photo.jpg') and input its path relative to root: '/my-photo.jpg'.");
      return;
    }

    setUploadProgress({ type, status: "uploading" });

    try {
      // Path definition in storage
      const storagePath = `portfolio/${type}/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, storagePath);

      // Upload bytes
      const snapshot = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);

      setUploadProgress({ type, status: "success" });
      setTimeout(() => setUploadProgress({ type: "", status: "" }), 2500);

      // Update appropriate states
      if (type === "profile") {
        setProfileForm((prev) => ({ ...prev, profileImage: downloadUrl }));
      } else if (type === "resume") {
        setProfileForm((prev) => ({ ...prev, resumeUrl: downloadUrl }));
      } else if (type === "project") {
        setEditingProject((prev) => ({ ...prev, image: downloadUrl }));
      } else if (type === "certification") {
        setEditingCert((prev) => ({ ...prev, credentialUrl: downloadUrl }));
      }
      
      console.log(`Uploaded successfully: ${downloadUrl}`);
    } catch (error) {
      console.error("Firebase upload error:", error);
      alert("Failed to upload file to Firebase. Check your Firebase Storage rules.");
      setUploadProgress({ type: "", status: "failed" });
    }
  };

  // --- SAVE ACTIONS ---
  const handleSaveProfile = () => {
    const updated = { ...data, profile: profileForm };
    saveData(updated);
    alert("Profile changes updated successfully!");
  };

  // --- PROJECTS ADMIN ---
  const handleSaveProjectModal = () => {
    if (!editingProject.title || !editingProject.description) {
      alert("Project title and description are required.");
      return;
    }

    let updatedProjects;
    if (editingProject.isNew) {
      const newProj = {
        ...editingProject,
        id: `proj-${Date.now()}`
      };
      delete newProj.isNew;
      updatedProjects = [...projectsList, newProj];
    } else {
      updatedProjects = projectsList.map((p) => (p.id === editingProject.id ? editingProject : p));
    }

    setProjectsList(updatedProjects);
    const updated = { ...data, projects: updatedProjects };
    saveData(updated);
    setEditingProject(null);
  };

  const handleDeleteProject = (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    const updatedProjects = projectsList.filter((p) => p.id !== id);
    setProjectsList(updatedProjects);
    const updated = { ...data, projects: updatedProjects };
    saveData(updated);
  };

  // --- CERTIFICATIONS ADMIN ---
  const handleSaveCertModal = () => {
    if (!editingCert.title || !editingCert.issuer) {
      alert("Certificate title and issuer are required.");
      return;
    }

    let updatedCerts;
    if (editingCert.isNew) {
      const newCert = {
        ...editingCert,
        id: `cert-${Date.now()}`
      };
      delete newCert.isNew;
      updatedCerts = [...certsList, newCert];
    } else {
      updatedCerts = certsList.map((c) => (c.id === editingCert.id ? editingCert : c));
    }

    setCertsList(updatedCerts);
    const updated = { ...data, certifications: updatedCerts };
    saveData(updated);
    setEditingCert(null);
  };

  const handleDeleteCert = (id) => {
    if (!window.confirm("Are you sure you want to delete this certification?")) return;
    const updatedCerts = certsList.filter((c) => c.id !== id);
    setCertsList(updatedCerts);
    const updated = { ...data, certifications: updatedCerts };
    saveData(updated);
  };

  // --- SKILLS ADMIN ---
  const handleSaveSkillCategory = () => {
    const updatedSkills = skillsList.map((c) => (c.id === editingSkillCat.id ? editingSkillCat : c));
    setSkillsList(updatedSkills);
    const updated = { ...data, skills: updatedSkills };
    saveData(updated);
    setEditingSkillCat(null);
  };

  const handleUpdateSkillLevel = (catId, skillIndex, newLevel) => {
    const updatedSkills = skillsList.map((cat) => {
      if (cat.id === catId) {
        const items = [...cat.items];
        items[skillIndex].level = parseInt(newLevel);
        return { ...cat, items };
      }
      return cat;
    });
    setSkillsList(updatedSkills);
    const updated = { ...data, skills: updatedSkills };
    saveData(updated);
  };

  const handleAddSkillToCategory = (catId) => {
    const name = prompt("Enter new skill name:");
    if (!name) return;

    const updatedSkills = skillsList.map((cat) => {
      if (cat.id === catId) {
        return { ...cat, items: [...cat.items, { name, level: 70 }] };
      }
      return cat;
    });
    setSkillsList(updatedSkills);
    const updated = { ...data, skills: updatedSkills };
    saveData(updated);
  };

  const handleDeleteSkillFromCategory = (catId, skillIndex) => {
    const updatedSkills = skillsList.map((cat) => {
      if (cat.id === catId) {
        const items = cat.items.filter((_, idx) => idx !== skillIndex);
        return { ...cat, items };
      }
      return cat;
    });
    setSkillsList(updatedSkills);
    const updated = { ...data, skills: updatedSkills };
    saveData(updated);
  };

  return (
    <div className="flex flex-col h-full text-coffee">
      
      {/* Dynamic Sync Banner */}
      <div className={`p-4 rounded-2xl flex items-center justify-between gap-3 text-sm mb-6 ${
        isFirebaseMode 
          ? "bg-green-50 border border-green-200 text-green-800" 
          : "bg-amber-50 border border-amber-200 text-amber-800"
      }`}>
        <div className="flex items-center gap-2">
          {isFirebaseMode ? <CloudLightning size={18} /> : <Laptop size={18} />}
          <span>
            {isFirebaseMode 
              ? "🔥 Connected to Live Firebase Database. All edits sync in real-time." 
              : "💾 Running in Local Mode. Edits update the site state. Export and save the JSON to retain edits permanently!"}
          </span>
        </div>
        {!isFirebaseMode && (
          <button
            onClick={exportPortfolioJSON}
            className="inline-flex items-center gap-1.5 bg-amber-600 text-cream-light font-semibold py-1.5 px-4 rounded-xl text-xs shadow-sm hover:bg-amber-700 cursor-pointer"
          >
            <Download size={14} />
            Export portfolio-data.json
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-latte/40 mb-6 overflow-x-auto gap-2">
        {["profile", "projects", "certifications", "skills"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActivePanel(tab)}
            className={`px-5 py-2.5 font-sans font-semibold text-sm capitalize border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activePanel === tab
                ? "border-coffee text-coffee"
                : "border-transparent text-coffee/60 hover:text-coffee"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* --- PANEL: PROFILE --- */}
      {activePanel === "profile" && (
        <div className="space-y-5 text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-coffee-light">Full Name</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-coffee/20 bg-cream-light/30 focus:outline-none focus:ring-1 focus:ring-coffee text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-coffee-light">Professional Tagline</label>
              <input
                type="text"
                value={profileForm.tagline}
                onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-coffee/20 bg-cream-light/30 focus:outline-none focus:ring-1 focus:ring-coffee text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase text-coffee-light">Sub Tagline</label>
            <input
              type="text"
              value={profileForm.subTagline}
              onChange={(e) => setProfileForm({ ...profileForm, subTagline: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-coffee/20 bg-cream-light/30 focus:outline-none focus:ring-1 focus:ring-coffee text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase text-coffee-light">About Narrative</label>
            <textarea
              rows={4}
              value={profileForm.aboutText}
              onChange={(e) => setProfileForm({ ...profileForm, aboutText: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-coffee/20 bg-cream-light/30 focus:outline-none focus:ring-1 focus:ring-coffee text-sm resize-none"
            />
          </div>

          {/* Upload / URL for profile image */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3 border-t border-latte/20">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-coffee-light flex items-center gap-1">
                <ImageIcon size={14} /> Profile Image URL
              </label>
              <input
                type="text"
                value={profileForm.profileImage}
                onChange={(e) => setProfileForm({ ...profileForm, profileImage: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-coffee/20 bg-cream-light/30 focus:outline-none focus:ring-1 focus:ring-coffee text-sm"
              />
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "profile")}
                  className="text-xs text-coffee-light file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-latte/40 file:text-coffee file:cursor-pointer"
                />
                {uploadProgress.type === "profile" && (
                  <span className="text-[11px] italic font-semibold animate-pulse text-coffee-light">
                    {uploadProgress.status === "uploading" ? "Uploading..." : "Success!"}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-coffee-light flex items-center gap-1">
                <FileText size={14} /> Resume PDF URL
              </label>
              <input
                type="text"
                value={profileForm.resumeUrl}
                onChange={(e) => setProfileForm({ ...profileForm, resumeUrl: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-coffee/20 bg-cream-light/30 focus:outline-none focus:ring-1 focus:ring-coffee text-sm"
              />
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => handleFileUpload(e, "resume")}
                  className="text-xs text-coffee-light file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-latte/40 file:text-coffee file:cursor-pointer"
                />
                {uploadProgress.type === "resume" && (
                  <span className="text-[11px] italic font-semibold animate-pulse text-coffee-light">
                    {uploadProgress.status === "uploading" ? "Uploading..." : "Success!"}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-coffee-light">Contact Email</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-coffee/20 bg-cream-light/30 focus:outline-none focus:ring-1 focus:ring-coffee text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-coffee-light">LinkedIn Link</label>
              <input
                type="text"
                value={profileForm.linkedin}
                onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-coffee/20 bg-cream-light/30 focus:outline-none focus:ring-1 focus:ring-coffee text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-coffee-light">GitHub Link</label>
              <input
                type="text"
                value={profileForm.github}
                onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-coffee/20 bg-cream-light/30 focus:outline-none focus:ring-1 focus:ring-coffee text-sm"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-latte/30 text-right">
            <button
              onClick={handleSaveProfile}
              className="inline-flex items-center gap-1.5 bg-gradient-coffee text-cream-light py-2 px-6 rounded-full font-semibold shadow-md hover:bg-coffee-dark cursor-pointer text-sm"
            >
              <Save size={16} />
              Save Profile Details
            </button>
          </div>
        </div>
      )}

      {/* --- PANEL: PROJECTS --- */}
      {activePanel === "projects" && (
        <div className="space-y-6 text-left">
          <div className="flex justify-between items-center pb-3 border-b border-latte/30">
            <h3 className="font-serif font-bold text-lg text-coffee">Project Catalog ({projectsList.length})</h3>
            <button
              onClick={() =>
                setEditingProject({
                  isNew: true,
                  title: "",
                  description: "",
                  category: "IoT & Embedded",
                  image: "",
                  tags: [],
                  githubLink: "",
                  demoLink: ""
                })
              }
              className="inline-flex items-center gap-1 bg-gradient-coffee text-cream-light font-semibold py-1.5 px-4 rounded-xl text-xs cursor-pointer shadow-sm"
            >
              <Plus size={14} /> Add Project
            </button>
          </div>

          {/* List of current projects */}
          <div className="space-y-3.5">
            {projectsList.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-cream/40 border border-coffee/5"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={p.image || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=80&q=80"}
                    alt={p.title}
                    className="w-12 h-12 object-cover rounded-xl border border-coffee/5 shadow-inner"
                  />
                  <div>
                    <h4 className="font-sans font-semibold text-coffee text-sm sm:text-base leading-tight">{p.title}</h4>
                    <span className="text-[10px] uppercase font-bold text-coffee-light tracking-wide">{p.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingProject({ ...p })}
                    className="p-2 rounded-lg text-coffee-light hover:text-coffee hover:bg-latte/40 transition-colors cursor-pointer"
                    title="Edit"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteProject(p.id)}
                    className="p-2 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Project Edit / Add Form */}
          {editingProject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-coffee-dark/30 backdrop-blur-sm">
              <div className="w-full max-w-xl glass-modal border border-coffee/10 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center pb-3 border-b border-latte/40">
                  <h4 className="font-serif font-bold text-coffee text-lg">
                    {editingProject.isNew ? "Create New Project" : "Edit Project Details"}
                  </h4>
                  <button
                    onClick={() => setEditingProject(null)}
                    className="p-1 rounded-full text-coffee/60 hover:text-coffee hover:bg-latte/40 cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase text-coffee-light">Project Title</label>
                    <input
                      type="text"
                      value={editingProject.title}
                      onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl border border-coffee/20 text-sm focus:outline-none focus:ring-1 focus:ring-coffee"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase text-coffee-light">Category</label>
                      <select
                        value={editingProject.category}
                        onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-xl border border-coffee/20 text-sm focus:outline-none bg-cream-light"
                      >
                        <option value="IoT & Embedded">IoT & Embedded</option>
                        <option value="VLSI & DSP">VLSI & DSP</option>
                        <option value="EDA & PCB Design">EDA & PCB Design</option>
                        <option value="General ECE">General ECE</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase text-coffee-light">Technologies (Comma separated)</label>
                      <input
                        type="text"
                        value={editingProject.tags.join(", ")}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean)
                          })
                        }
                        placeholder="STM32, Altium, Embedded C"
                        className="w-full px-3 py-1.5 rounded-xl border border-coffee/20 text-sm focus:outline-none focus:ring-1 focus:ring-coffee"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase text-coffee-light">Project Screenshot URL</label>
                    <input
                      type="text"
                      value={editingProject.image}
                      onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl border border-coffee/20 text-sm focus:outline-none"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "project")}
                        className="text-xs text-coffee-light file:mr-2 file:py-0.5 file:px-2 file:rounded-lg file:border-0 file:text-[10px] file:bg-latte/40 file:text-coffee"
                      />
                      {uploadProgress.type === "project" && (
                        <span className="text-[10px] italic font-semibold animate-pulse text-coffee-light">
                          {uploadProgress.status === "uploading" ? "Uploading..." : "Uploaded!"}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase text-coffee-light">Description</label>
                    <textarea
                      rows={3}
                      value={editingProject.description}
                      onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl border border-coffee/20 text-sm focus:outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase text-coffee-light">GitHub Repository URL</label>
                      <input
                        type="text"
                        value={editingProject.githubLink}
                        onChange={(e) => setEditingProject({ ...editingProject, githubLink: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-xl border border-coffee/20 text-sm focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase text-coffee-light">Live Project Demo URL</label>
                      <input
                        type="text"
                        value={editingProject.demoLink}
                        onChange={(e) => setEditingProject({ ...editingProject, demoLink: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-xl border border-coffee/20 text-sm focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-latte/40 flex justify-end gap-3">
                  <button
                    onClick={() => setEditingProject(null)}
                    className="px-4 py-2 rounded-xl text-coffee hover:bg-latte/40 transition-colors text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProjectModal}
                    className="bg-gradient-coffee text-cream-light font-semibold py-2 px-5 rounded-xl text-xs shadow-sm hover:shadow-md cursor-pointer flex items-center gap-1"
                  >
                    <Save size={14} /> Save Project
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- PANEL: CERTIFICATIONS --- */}
      {activePanel === "certifications" && (
        <div className="space-y-6 text-left">
          <div className="flex justify-between items-center pb-3 border-b border-latte/30">
            <h3 className="font-serif font-bold text-lg text-coffee">Certificates ({certsList.length})</h3>
            <button
              onClick={() =>
                setEditingCert({
                  isNew: true,
                  title: "",
                  issuer: "",
                  issueDate: "",
                  credentialUrl: "",
                  description: ""
                })
              }
              className="inline-flex items-center gap-1 bg-gradient-coffee text-cream-light font-semibold py-1.5 px-4 rounded-xl text-xs cursor-pointer shadow-sm"
            >
              <Plus size={14} /> Add Certificate
            </button>
          </div>

          <div className="space-y-3.5">
            {certsList.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-cream/40 border border-coffee/5"
              >
                <div>
                  <h4 className="font-sans font-semibold text-coffee text-sm sm:text-base leading-tight">{c.title}</h4>
                  <span className="text-[10px] font-bold text-coffee-light uppercase tracking-wide">{c.issuer} • {c.issueDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingCert({ ...c })}
                    className="p-2 rounded-lg text-coffee-light hover:text-coffee hover:bg-latte/40 transition-colors cursor-pointer"
                    title="Edit"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteCert(c.id)}
                    className="p-2 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Certificate Edit / Add Form */}
          {editingCert && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-coffee-dark/30 backdrop-blur-sm">
              <div className="w-full max-w-xl glass-modal border border-coffee/10 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center pb-3 border-b border-latte/40">
                  <h4 className="font-serif font-bold text-coffee text-lg">
                    {editingCert.isNew ? "Add New Certification" : "Edit Certification Details"}
                  </h4>
                  <button
                    onClick={() => setEditingCert(null)}
                    className="p-1 rounded-full text-coffee/60 hover:text-coffee hover:bg-latte/40 cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase text-coffee-light">Certificate Title</label>
                    <input
                      type="text"
                      value={editingCert.title}
                      onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl border border-coffee/20 text-sm focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase text-coffee-light">Issuer</label>
                      <input
                        type="text"
                        value={editingCert.issuer}
                        onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-xl border border-coffee/20 text-sm focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase text-coffee-light">Issue Date</label>
                      <input
                        type="text"
                        value={editingCert.issueDate}
                        onChange={(e) => setEditingCert({ ...editingCert, issueDate: e.target.value })}
                        placeholder="Jan 2025"
                        className="w-full px-3 py-1.5 rounded-xl border border-coffee/20 text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase text-coffee-light">Credential PDF URL</label>
                    <input
                      type="text"
                      value={editingCert.credentialUrl}
                      onChange={(e) => setEditingCert({ ...editingCert, credentialUrl: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl border border-coffee/20 text-sm focus:outline-none"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => handleFileUpload(e, "certification")}
                        className="text-xs text-coffee-light file:mr-2 file:py-0.5 file:px-2 file:rounded-lg file:border-0 file:text-[10px] file:bg-latte/40 file:text-coffee"
                      />
                      {uploadProgress.type === "certification" && (
                        <span className="text-[10px] italic font-semibold animate-pulse text-coffee-light">
                          {uploadProgress.status === "uploading" ? "Uploading..." : "Uploaded!"}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase text-coffee-light">Brief Description</label>
                    <textarea
                      rows={3}
                      value={editingCert.description}
                      onChange={(e) => setEditingCert({ ...editingCert, description: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl border border-coffee/20 text-sm focus:outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-latte/40 flex justify-end gap-3">
                  <button
                    onClick={() => setEditingCert(null)}
                    className="px-4 py-2 rounded-xl text-coffee hover:bg-latte/40 transition-colors text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveCertModal}
                    className="bg-gradient-coffee text-cream-light font-semibold py-2 px-5 rounded-xl text-xs shadow-sm hover:shadow-md cursor-pointer flex items-center gap-1"
                  >
                    <Save size={14} /> Save Certificate
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- PANEL: SKILLS --- */}
      {activePanel === "skills" && (
        <div className="space-y-8 text-left">
          {skillsList.map((category) => (
            <div key={category.id} className="p-5 rounded-2xl bg-cream/40 border border-coffee/5 space-y-4">
              
              {/* Category Title */}
              <div className="flex justify-between items-center pb-2 border-b border-latte/30">
                <h4 className="font-serif font-bold text-coffee text-base">{category.category}</h4>
                <button
                  onClick={() => handleAddSkillToCategory(category.id)}
                  className="inline-flex items-center gap-1 text-coffee hover:text-coffee-light text-xs font-semibold cursor-pointer"
                >
                  <Plus size={14} /> Add Skill
                </button>
              </div>

              {/* Skills Sliders Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                {category.items.map((skill, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-sans font-semibold text-coffee/90">{skill.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-coffee-light font-bold">{skill.level}%</span>
                        <button
                          onClick={() => handleDeleteSkillFromCategory(category.id, index)}
                          className="text-red-500 hover:text-red-700 p-0.5 rounded transition-colors cursor-pointer"
                          title="Delete Skill"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={skill.level}
                      onChange={(e) => handleUpdateSkillLevel(category.id, index, e.target.value)}
                      className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-latte/50 accent-coffee"
                    />
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
