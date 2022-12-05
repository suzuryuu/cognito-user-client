
import axios from 'axios';

const API_ENDPOINT = 'https://6c1o3159qj.execute-api.ap-northeast-1.amazonaws.com';


export async function MatchResult(wantSkill, haveSkill){
    const matchingRoute = '/dev/m-result'
    const query = '?wskill=' + wantSkill + '&hskill=' + haveSkill
    const requestUrl = API_ENDPOINT + matchingRoute + query
    
    try {
        const response = await axios.get(requestUrl);
        alert(response.data);
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
}

// APIいるとき
/**
 * import axios from 'axios';

const API_ENDPOINT = 'https://your-api-gateway-endpoint.com/';
const API_KEY = 'your-api-key';

const sendRequest = async () => {
  try {
    const response = await axios.get(API_ENDPOINT, {
      headers: {
        'X-API-Key': API_KEY,
      }
    });
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}
 * 
 */