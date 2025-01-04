import { gql, GraphQLClient } from 'graphql-request';

const endPoint = "https://api.studio.thegraph.com/query/98873/bet-graph-test/version/latest";

export const getBetInfo = async (_roundId) => {
    const client = new GraphQLClient(endPoint);
    const filter = _roundId ? `(where: {_roundId: "${_roundId}"})` : "";
    const query = gql`
        {
            betPlaceds${filter} {
                id
                _roundId
                _address
                _betValue
                _betAmount
            }
        }`;
    const response = await client.request(query);
    return response;

}

export const getBetHistory = async (_address) => {
    const client = new GraphQLClient(endPoint);
    const query = gql`
        {
            betPlaceds {
                id
                _roundId
                _address
                _betValue
                _betAmount
            },
            betRoundFinisheds {
                _roundId
                _winningValue
            },
            claimedRewards(where: {_address: "${_address}"}) {
                _roundId
                _address
                _rewardAmount
            }
        }`;
    const response = await client.request(query);
    // console.log(response);
    return response;
}