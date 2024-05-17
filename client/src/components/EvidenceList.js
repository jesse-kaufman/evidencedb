import { useState, useEffect } from "react";
import moment from "moment";
import Axios from "axios";
import { format_phone, get_email } from "../utils/utils";
import EvidenceItem from "./EvidenceItem";
import "../styles/css/EvidenceList.css";

function EvidenceList({ items }) {
  var prev_date = "";
  var prev_email = "";
  var prev_phone = "";

  const [evidenceItems, setEvidenceItems] = useState([]);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const searchParams = new URLSearchParams(document.location.search);
    Axios.get("http://localhost:8080/api/evidence/?" + searchParams.toString())
      .then((response) => {
        setEvidenceItems(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="evidenceList">
      {evidenceItems.length > 0 ? (
        evidenceItems.map((item) => {
          var curr_date = moment(item.date_sent).format("ll");
          var show_date_divider = false;
          var show_email_divider = false;
          var show_phone_divider = false;

          if (item.type === "email") {
            var curr_email = get_email(item.from);
            if (curr_email !== prev_email) {
              show_email_divider = true;
              prev_email = curr_email;
            }
          }

          if (item.type === "text") {
            var curr_phone = format_phone(item.from);
            if (curr_phone !== prev_phone) {
              show_phone_divider = true;
              prev_phone = curr_phone;
            }
          }

          if (curr_date !== prev_date) {
            show_date_divider = true;
            prev_date = curr_date;
          }

          return (
            <EvidenceItem
              key={item._id}
              item={item}
              show_phone_divider={show_phone_divider}
              phone={curr_phone}
              show_email_divider={show_email_divider}
              email={curr_email}
              show_date_divider={show_date_divider}
              date={curr_date}
            />
          );
        })
      ) : (
        <div className="loading">Loading...</div>
      )}
    </div>
  );
}

export default EvidenceList;
