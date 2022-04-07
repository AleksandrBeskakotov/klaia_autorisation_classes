import axios from "axios";

export default axios.create({
    baseURL:"https://staging.klaia.xyz",
    headers: { 'Content-Type': 'application/json' }
  });
