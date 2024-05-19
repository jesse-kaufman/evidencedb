import { nl2br, format_phone } from "../utils/utils";
import moment from "moment";

function EvidenceItem({
  item,
  show_phone_divider,
  phone,
  show_email_divider,
  email,
  show_date_divider,
  date,
}) {
  // Setup name class and from name
  var name_class = item.direction === "IN" ? "brian" : item.victim;

  return (
    <>
      {show_phone_divider && <PhoneDivider phone={phone} />}
      {show_email_divider && <EmailDivider email={email} />}
      {show_date_divider && <DateDivider date={date} />}

      <div className={`message ${item.type} ${name_class}`} id={item._id}>
        <Header item={item} />
        <Body body={item.body} body_html={item.body_html} />
        <Footer type={item.type} />
      </div>
    </>
  );
}

function PhoneDivider({ phone }) {
  return (
    <div className="phone_divider">
      <div className="phone">{phone}</div>
    </div>
  );
}

function EmailDivider({ email }) {
  return (
    <div className="email_divider">
      <div className="email">{email}</div>
    </div>
  );
}

function DateDivider({ date }) {
  return (
    <div className="date_divider">
      <div className="date">{date}</div>
    </div>
  );
}

function Body({ body, body_html }) {
  body = body_html ? body_html : nl2br(body);

  return (
    <div className="body">
      <div dangerouslySetInnerHTML={{ __html: body }}></div>
    </div>
  );
}

function Footer({ type }) {
  return (
    <div className="footer">
      <span>{type}</span>
    </div>
  );
}

function Header({ item }) {
  var date_sent = moment(item.date_sent).format("MMMM D, YYYY [at] h:mm:ss A");
  return (
    <>
      <div className="meta">
        <span className="icon">
          <Icon type={item.type} />
        </span>
        <span className="info">
          <From
            type={item.type}
            direction={item.direction}
            from={item.from}
            victim={item.victim}
          />
          <To victim={item.victim} direction={item.direction} />
          <br />
          <strong>Date:</strong> <span className="date">{date_sent}</span>
          <EmailHeaders item={item} />
        </span>
      </div>
    </>
  );
}

function Icon({ type }) {
  switch (type) {
    case "text":
      return "💬";

    case "video":
      return "🎞️";

    case "voicemail":
      return "📞";

    case "email":
      return "📫";

    default:
  }
}

function EmailHeaders({ item }) {
  if (item.type === "email") {
    return (
      <>
        <br />
        <strong>From:</strong> {item.from}
        <br />
        <strong>To:</strong> {item.to}
        <br />
        <strong>Subject:</strong> {item.subject}
      </>
    );
  } else {
    return "";
  }
}

function From({ type, direction, from, victim }) {
  var name_class = "";
  var from_name = "";

  // Setup name class and from name
  if (direction === "IN") {
    name_class = "brian";
    from_name = "Brian Tiemeyer";
  } else {
    name_class = victim;
    from_name = victim.substring(0, 1).toUpperCase() + victim.substring(1);
  }

  // Format "From" address / number
  if (direction === "IN") {
    if (type === "text") {
      // Format phone number
      from = " (" + format_phone(from) + ")";
    } else if (type === "email") {
      // Format email address
      from = " (" + from.match(/<(.*)>/)[1] + ")";
    }
  } else if (direction === "OUT") {
    // Hide from address on outgoing items
    from = null;
  }

  return (
    <span className="from">
      <strong className={name_class}>{from_name}</strong>
      {from}
    </span>
  );
}

function To({ victim, direction }) {
  if (direction === "OUT") {
    // Hide on outgoing evidence items
    return null;
  }

  return (
    <>
      <strong> to </strong>

      {victim === "both" ? (
        <>
          <strong className="jesse">Jesse</strong>&nbsp;
          <strong className="shannon">Shannon</strong>
        </>
      ) : (
        <>
          <strong className={victim}>
            {victim.substr(0, 1).toUpperCase() + victim.substr(1)}
          </strong>
        </>
      )}
    </>
  );
}

export default EvidenceItem;
