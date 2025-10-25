
export const generateTickets = () => {
  const rows = ["A", "B", "C", "D", "E", "F", "G"];
  const tickets = [];

  for (let row of rows) {
    for (let num = 1; num <= 9; num++) {
      tickets.push({
        id: `${row}${num}`,
        seat: `${row}${num}`,
        isAvailable: true,
      });
    }
  }

  return tickets;
};