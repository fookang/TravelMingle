export const formatDate = (dateStr) => {
  const [year, month, day] = dateStr.split("-");

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return `${day} ${months[parseInt(month, 10) - 1]} ${year}`;
};

export const formatAsYYYYMMDD = (dateObj) => {
  if (typeof dateObj === "string") return dateObj;

  const yyyy = dateObj.getFullYear();
  const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
  const dd = String(dateObj.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export const displayDate = (date) => {
  const today = formatAsYYYYMMDD(new Date());
  date = formatAsYYYYMMDD(date);

  const isToday = today === date;

  return isToday ? "Today" : formatDate(date);
};

export const parseYYYYMMDD = (dateStr) => {
  const [yyyy, mm, dd] = dateStr.split("-");
  return new Date(Number(yyyy), Number(mm) - 1, Number(dd));
};
