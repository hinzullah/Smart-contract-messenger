import { useState } from "react";
import abi from "./abi.json";
import { ethers } from "ethers";

const contractAddress = "0x9D1eb059977D71E1A21BdebD1F700d4A39744A70";

function App() {
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  const handleSet = async () => {
    try {
      if (!text) {
        alert("Please enter a message before setting.");
        return;
      }

      if (window.ethereum) {
        await requestAccount();
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        const tx = await contract.setMessage(text);
        await tx.wait();

        alert("Message set successfully.");
        setText("");
      } else {
        alert("MetaMask not found. Please install MetaMask.");
      }
    } catch (error) {
      console.error("Error setting message:", error);
      alert(error.message || "Error setting message.");
    }
  };

  const handleGet = async () => {
    try {
      if (window.ethereum) {
        await requestAccount();
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, abi, provider);

        const fetchedMessage = await contract.getMessage();
        setMessage(fetchedMessage);
      } else {
        alert("MetaMask not found.");
      }
    } catch (error) {
      console.log(error.message || "Error fetching message.");
      alert(error.message || "Error fetching message.");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f3f4f6",
      }}
    >
      <div
        style={{
          padding: "2rem",
          backgroundColor: "white",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h1 style={{ marginBottom: "1.5rem", color: "#ef6c00" }}>
          Smart Contract Messenger
        </h1>
        <p style={{ marginBottom: "1.5rem", color: "#000000" }}>
          Set Your Message on smart contract
        </p>
        <input
          type="text"
          placeholder="Enter message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{
            padding: "0.75rem",
            marginBottom: "1rem",
            width: "100%",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={handleSet}
          style={{
            padding: "0.75rem",
            backgroundColor: "#ef6c00",
            color: "white",
            border: "none",
            borderRadius: "5px",
            width: "100%",
            marginBottom: "0.75rem",
            cursor: "pointer",
          }}
        >
          Set Message
        </button>

        <button
          onClick={handleGet}
          style={{
            padding: "0.75rem",
            backgroundColor: "#374151",
            color: "white",
            border: "none",
            borderRadius: "5px",
            width: "100%",
            cursor: "pointer",
          }}
        >
          Get Message
        </button>

        {message && (
          <div
            style={{
              marginTop: "1.5rem",
              color: "#374151",
              fontWeight: "bold",
            }}
          >
            <p>Message:</p>
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
