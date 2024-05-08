import React, { useState } from "react";
import axios from "axios";

function Bot() {
  const [message, setMessage] = useState("");
  const [prevMessage, setPrevMessage] = useState("");

  const [response, setResponse] = useState("");
  const [conversation, setConversation] = useState([]);

  const sendMessage = async () => {
    try {
      const response = await axios.post("http://localhost:8000/bot/message", {
        message,
      });
      setResponse(response.data.response);
      const botResponse = response.data.response;
      setConversation([...conversation, { user: message, bot: botResponse }]);
      setPrevMessage(message);
      setMessage("");
    } catch (error) {
      console.error(error);
    }
  };

  const resetBot = async () => {
    try {
      const response = await axios.patch("http://localhost:8000/bot/reset");
      console.log(response.data);
      setResponse("");
      setConversation([]);
      setPrevMessage("");
      setMessage("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="Bot flex-grow">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Clinician Chatbot 🏥
        </h1>
        <div className="flex mt-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            className="border border-gray-300 rounded px-2 py-1 mr-2 flex-grow"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Send ➡️
          </button>
        </div>
        <h2 className="text-xl font-semibold mt-2">Bot 😁</h2>
        <p className="mt-2">{response}</p>
        <div className="conversation mt-4">
          <h2 className="text-xl font-semibold my-2 pt-2 border-t border-gray-300">
            <u>Full Chat Overview </u> 📃
          </h2>

          {conversation.map((item, index) => (
            <div key={index} className="mb-2">
              <p>
                <strong>User:</strong> {item.user}
              </p>
              <p>
                <strong>Bot:</strong> {item.bot}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="bottom-of-the-page bg-white pb-10 ">
        <button
          onClick={resetBot}
          className="mb-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2"
        >
          Reset Bot 😵
        </button>
        <h2 className=" border-t border-gray-300 text-xl font-semibold pt-4">
          Current States
        </h2>
        <p>Last Message: {prevMessage}</p>
        <p>Last Response: {response}</p>
      </div>
    </div>
  );
}

export default Bot;
