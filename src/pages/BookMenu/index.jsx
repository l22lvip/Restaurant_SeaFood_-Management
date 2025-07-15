import axios from "axios";
import { useEffect, useState } from "react"

const API_URL = 'http://localhost:9999/menuItems';
const CATEGORY_URL = 'http://localhost:9999/categories';

export default function BookMenu() {
  const [menu, setMenu] = useState([]);
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get(API_URL);
        const data = await response.json();
        setMenu(data);
        console.log(data);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };
    fetchMenu();
  })
  return (
    <div>Hello</div>
  )
}