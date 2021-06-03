import axios from "axios";

export async function fetchInvestments(id = "") {
  const res = await axios(
    `https://6r3yk.sse.codesandbox.io/api/investments/${id}`
  );
  return res.data;
}
