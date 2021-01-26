import { BOAT_OFFLOAD_DETAILS } from '../Constants';

export default function (state = {}, action) {
  switch (action.type) {
    case (BOAT_OFFLOAD_DETAILS):
      return action.payload;
    default: return state;
  }
}
