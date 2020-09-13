import AwesomeDebouncePromise from 'awesome-debounce-promise';
import {Post} from '../../api/http';

const partialSearchAPI = (query) =>
  new Promise((resolve, reject) => {
    const body = JSON.stringify({query});
    Post('app/search/partial', body)
      .then((data) => resolve(data.response))
      .catch((e) => reject(e));
  });
export const partialSearchDelayed = AwesomeDebouncePromise(
  partialSearchAPI,
  30,
);

export const fullSearchAPI = (query, model) =>
  new Promise((resolve, reject) => {
    const body = JSON.stringify({
      query: query,
      city: 'Mumbai',
    });
    Post(`app/search/full/${model}`, body).then(
      (data) => resolve(data.response),
      (e) => resject(e),
    );
  });
