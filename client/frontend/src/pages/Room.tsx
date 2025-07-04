import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SocketContext } from "../context/socket_context";
import UserFeedPlayer from "../components/UserFeedPlayer";

const Room = () => {
  const { id } = useParams(); // room ID from URL
  const context = useContext(SocketContext);

  const fetchParticipantList = ({
    roomId,
    participants,
  }: {
    roomId: string;
    participants: string[];
  }) => {
    console.log("Fetched room participants:");
    console.log(roomId, participants);
  };

  useEffect(() => {
    if (!context || !id) return;

    const { socket, user } = context;

    if (user && user.id) {
      socket.emit("joined-room", { roomId: id, peerId: user.id });
      socket.on("get-users", fetchParticipantList);
    }

    
  }, [context, id]);

  const userStream = context?.stream;

  return (
    <div>
      Room Id: {id}
      <br />
      User Id: {context?.user.id}
      {userStream && <UserFeedPlayer stream={userStream} />}
    </div>
  );
};

export default Room;
