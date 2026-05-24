import React, { createContext, useContext, useState, useEffect } from "react";
import { isFirebaseActive, db } from "../firebase";
import { doc, getDoc, setDoc, collection, addDoc, getDocs } from "firebase/firestore";

const PortfolioContext = createContext();

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
};

export const PortfolioProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState("home");

  // Load Portfolio Data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (isFirebaseActive) {
        try {
          const docRef = doc(db, "portfolio", "data");
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setData(docSnap.data());
          } else {
            // If Firebase is active but empty, seed it with the default local JSON data
            console.log("🌱 Seeding Firebase with default ECE portfolio data...");
            const response = await fetch("/portfolio-data.json");
            const localData = await response.json();
            await setDoc(docRef, localData);
            setData(localData);
          }
        } catch (error) {
          console.error("Error fetching from Firebase, falling back to local JSON:", error);
          loadLocalData();
        }
      } else {
        loadLocalData();
      }
    };

    const loadLocalData = async () => {
      try {
        const response = await fetch("/portfolio-data.json");
        const localData = await response.json();
        setData(localData);
      } catch (error) {
        console.error("Error loading local portfolio-data.json:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData().then(() => setLoading(false));
  }, []);

  // Fetch Contact Messages (Admin only)
  const fetchMessages = async () => {
    if (!isFirebaseActive) return [];
    try {
      const querySnapshot = await getDocs(collection(db, "messages"));
      const msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() });
      });
      // Sort messages by date descending
      msgs.sort((a, b) => new Date(b.date) - new Date(a.date));
      setMessages(msgs);
      return msgs;
    } catch (error) {
      console.error("Error fetching messages:", error);
      return [];
    }
  };

  // Save Portfolio Data
  const saveData = async (updatedData) => {
    setSaving(true);
    setData(updatedData); // Optimistic UI update

    if (isFirebaseActive) {
      try {
        const docRef = doc(db, "portfolio", "data");
        await setDoc(docRef, updatedData);
        console.log("🔥 Portfolio synced to Firebase successfully!");
      } catch (error) {
        console.error("Error saving data to Firebase:", error);
        alert("Failed to sync changes with Firebase. Check your permissions.");
      } finally {
        setSaving(false);
      }
    } else {
      // Local Mode: Data is kept in state. User will download the exported JSON to save permanently
      setTimeout(() => {
        setSaving(false);
        console.log("💾 Portfolio updated locally. Don't forget to export data in the Admin panel!");
      }, 800);
    }
  };

  // Submit Contact Message
  const submitMessage = async (name, email, subject, messageText) => {
    const newMessage = {
      name,
      email,
      subject,
      message: messageText,
      date: new Date().toISOString()
    };

    if (isFirebaseActive) {
      try {
        await addDoc(collection(db, "messages"), newMessage);
        return { success: true, mode: "live" };
      } catch (error) {
        console.error("Error sending message to Firebase:", error);
        return { success: false, error: error.message };
      }
    } else {
      // Local Mode Fallback: store in local storage or state
      const localMsgs = JSON.parse(localStorage.getItem("contact_messages") || "[]");
      localMsgs.push(newMessage);
      localStorage.setItem("contact_messages", JSON.stringify(localMsgs));
      return { success: true, mode: "local", message: newMessage };
    }
  };

  // Helper to trigger a local JSON export
  const exportPortfolioJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "portfolio-data.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        loading,
        saving,
        messages,
        isFirebaseMode: isFirebaseActive,
        activeTab,
        setActiveTab,
        saveData,
        submitMessage,
        fetchMessages,
        exportPortfolioJSON
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};
