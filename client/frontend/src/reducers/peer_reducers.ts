import { ADD_PEER, REMOVE_PEER } from "../actions/peer_action";

export type PeerState=Record<string,{stream:MediaStream}>;


type PeerAction={
    type: typeof ADD_PEER,
    payload:{peerId:string,stream:MediaStream}
}
|
{
      type: typeof REMOVE_PEER,
    payload:{peerId:string}
}


export const peerReducer=(state:PeerState,action:PeerAction)=>{
    switch(action.type){
        case ADD_PEER:
            return {
                ...state,
                [action.payload.peerId]:{
                    stream:action.payload.stream
                }
            }
        case REMOVE_PEER:
            // eslint-disable-next-line no-case-declarations
            const newState = { ...state };
            delete newState[action.payload.peerId];
            return newState;
        default:
            return {...state}
    }
}