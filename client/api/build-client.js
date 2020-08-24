import axios from 'axios';

export default ({ req }) => {
  if (typeof window === 'undefined') {
    /// On the server
    /**
     * URL format will be
     * http://<SERVICENAME>.<NAMESPACE>.svc.cluster.local/
     */
    // return axios.create({
    //   baseURL:
    //     "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
    //   headers: req.headers,
    // });
    return axios.create({
      baseURL: 'http://www.ticketing.supsengu.de',
      headers: req.headers,
    });
  } else {
    /// On the browser
    return axios.create({
      baseURL: '/',
    });
  }
};
