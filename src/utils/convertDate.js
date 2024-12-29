const convertDate = (dateValue) => {
  const originalDate = new Date(dateValue);
  const gmtPlus1Date = new Date(originalDate.getTime() + 60 * 60 * 1000); // Add 1 hour to convert to GMT+1

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
  const day = gmtPlus1Date.getDate();
  const month = months[gmtPlus1Date.getMonth()];
  const year = gmtPlus1Date.getFullYear();

  const formattedDate = `${day}${getDaySuffix(day)} ${month}, ${year}`;

  function getDaySuffix(day) {
    if (day >= 11 && day <= 13) {
      return "th";
    }
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }

  return formattedDate;
};

export default convertDate;
