import { gql, GraphQLClient } from 'graphql-request';
import axios from 'axios';

const API_ENDPOINT = "https://ede7-38-75-137-97.ngrok-free.app";

export const getCurrentRoundId = async () => {
    try {
        const res = await axios.get(API_ENDPOINT + "/current-round-id");
        return res.data.roundId;
    } catch (error) {
        console.log(error);
    }
}
export const getBetInfo = async (_roundId) => {
    try {
        const res = await axios.post(API_ENDPOINT + "/bet-info", {
            roundId: _roundId
        });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export const getBetHistory = async (params) => {
    const res = await axios.post(API_ENDPOINT + "/bet-round-history", {
        address: params.address,
        pageIndex: params.pageIndex,
        pageSize: params.pageSize,
        isJoined: params.isJoined,
        isClaimed: params.isClaimed,
        isUnclaimed: params.isUnclaimed
    });
    // console.log(res.data);
    return res.data;
}
// const endPoint = "https://api.studio.thegraph.com/query/98873/bet-graph-test/version/latest";

// export const getBetInfo = async (_roundId) => {
//     const client = new GraphQLClient(endPoint);
//     const filter = _roundId ? `(where: {_roundId: "${_roundId}"})` : "";
//     const query = gql`
//         {
//             betPlaceds${filter} {
//                 id
//                 _roundId
//                 _address
//                 _betValue
//                 _betAmount
//             }
//         }`;
//     const response = await client.request(query);
//     return response;

// }

// export const getBetHistory = async (_address) => {
//     const client = new GraphQLClient(endPoint);
//     const query = gql`
//         {
//             betPlaceds {
//                 id
//                 _roundId
//                 _address
//                 _betValue
//                 _betAmount
//             },
//             betRoundFinisheds {
//                 _roundId
//                 _winningValue
//             },
//             claimedRewards(where: {_address: "${_address}"}) {
//                 _roundId
//                 _address
//                 _rewardAmount
//             }
//         }`;
//     const response = await client.request(query);
//     // console.log(response);
//     return response;
// }