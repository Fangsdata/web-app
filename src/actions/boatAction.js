import { BOAT_OFFLOAD_DETAILS } from '../Constants';

const StoredBoatDetails = (boat) => ({
  type: BOAT_OFFLOAD_DETAILS,
  payload: boat,
});


export default StoredBoatDetails;
