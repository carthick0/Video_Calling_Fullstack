import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { SocketContext } from "../context/socket_context";
import UserFeedPlayer from "../components/UserFeedPlayer";

const Room = () => {
  const { id } = useParams();
  const context = useContext(SocketContext);

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{ message: string; sender: string }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // Join room and listen for participant list
  useEffect(() => {
    if (!context || !id) return;

    const { socket, user } = context;

    if (user?.id) {
      socket.emit("joined-room", { roomId: id, peerId: user.id });

      const handleUsers = ({ participants }: { roomId: string; participants: string[] }) => {
        console.log("Participants:", participants);
      };

      socket.on("get-users", handleUsers);
      return () => {
        socket.off("get-users", handleUsers);
      };
    }

    // Always return a cleanup function or nothing
    return undefined;
  }, [context, id]);

  // Handle incoming messages
  useEffect(() => {
    if (!context) return;

    const handleMessage = ({ message, sender }: { message: string; sender: string }) => {
      setChat((prev) => [...prev, { message, sender }]);
    };

    context.socket.on("receive-message", handleMessage);
    return () => context.socket.off("receive-message", handleMessage);
  }, [context]);

  // Send message
  const handleSend = () => {
    if (!message.trim() || !context || !id) return;

    context.socket.emit("send-message", {
      roomId: id,
      message,
      sender: context.user.id,
    });

    setChat((prev) => [...prev, { message, sender: "You" }]);
    setMessage("");
  };

  const userStream = context?.stream;
  const peers = context?.peers;

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#1e1e1e] text-white">
      {/* Left - Videos */}
      <div className="w-full md:w-3/4 p-4 flex flex-col gap-6 overflow-y-auto">
        <div>
          <h2 className="text-2xl font-semibold">Room ID: {id}</h2>
          <h3 className="text-sm text-gray-400">Your ID: {context?.user.id}</h3>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-2">Your Feed</h4>
          {userStream && <UserFeedPlayer stream={userStream} />}
          {/* Mute/unmute button */}
          {context && (
            <button
              onClick={context.toggleMute}
              className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
            >
              {context.isMuted ? "Unmute" : "Mute"}
            </button>
          )}
        </div>

        <div>
          <h4 className="text-lg font-bold mb-2">Other Users</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {peers &&
              Object.keys(peers).map((peerId) => (
                <UserFeedPlayer key={peerId} stream={peers[peerId].stream} />
              ))}
          </div>
        </div>
      </div>

      {/* Right - Chat */}
      <div className="w-full md:w-80 p-4 bg-[#111] border-l border-gray-800 flex flex-col">
        <h4 className="text-xl font-semibold mb-3">Chat</h4>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-2 mb-4 bg-[#1f1f1f] rounded space-y-2">
          {chat.map((c, i) => (
            <div
              key={i}
              className={`p-2 rounded text-sm max-w-xs ${
                c.sender === "You"
                  ? "ml-auto bg-blue-600 text-white"
                  : "mr-auto bg-gray-700 text-white"
              }`}
            >
              <strong>{c.sender}:</strong> {c.message}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message"
            className="flex-1 p-2 rounded bg-gray-800 border border-gray-600 text-white"
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Room;
