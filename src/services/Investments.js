import axios from 'axios';

export async function fetchInvestments(id = '') {
  const res = await axios(`/api/investments/${id}`);
  return res.data;
}
