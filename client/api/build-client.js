import axios from "axios";

export default ({ req }) => {
  // We need to differentiate between browse and server as if a
  // request is made from the server it will by default be using
  // a base url of localhost on port 80 which does not exist on
  // the container that the client is running on. To solve this
  // a request will be made to the ingress-nginx service which is
  // running in a different namespace. To do this when requesting
  // from the server we use:
  //    http://{service_name}.{service_namespace}.svc.cluster.local/{route}
  // We also need to define the host/domain in the headers of the
  // request this is because ingress nginx is looking for the ticketing.dev
  // host and the auth cookie
  if (typeof window === "undefined") {
    // we are on the server!
    return axios.create({
      baseURL:
        "http://adfcd14b75d81470abbe4b3056fb30b5-1454631012.ap-southeast-2.elb.amazonaws.com",
      headers: req.headers,
    });
  } else {
    // We are on the browser!
    // requests can be made with a base url of ''
    return axios.create({
      baseURL: "/",
    });
  }
};
