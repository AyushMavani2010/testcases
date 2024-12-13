import { render, screen, waitFor } from "@testing-library/react";
import InvoiceDashBoard from "../Page/InvoiceDashBoard";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../redux/apii/store";
import axios from "axios";
import { CookiesProvider } from "react-cookie";
import MockAdapter from "axios-mock-adapter";
import { within } from "@testing-library/react";
import { Table } from "@mui/material";
const mockAxios = new MockAdapter(axios);

beforeEach(() => {
  mockAxios.resetHistory();
  mockAxios.reset();
});
test("renders the table with  headers", async () => {
  render(
    <BrowserRouter
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true,
      }}
    >
      <Provider store={store}>
        <InvoiceDashBoard />
      </Provider>
    </BrowserRouter>
  );

  const table = await screen.findByTestId("client-table");
  expect(table).toBeInTheDocument();

  const headers = table.querySelectorAll("th");
  expect(headers).toHaveLength(5);

  expect(headers[0].textContent).toBe("Client");
  expect(headers[1].textContent).toBe("Invoice Date");
  expect(headers[2].textContent).toBe("Invoice Number");
  expect(headers[3].textContent).toBe("Due Date");
  expect(headers[4].textContent).toBe("Action");
});

// test("renders correct data of rows", async () => {
//   mockAxios
//     .onGet(
//       "http://localhost:5000/invoice/userId?user_id=02efaa66-4a66-466f-b92b-24ce7366edf0"
//     )
//     .reply(200, [
//       {
//         id: "1",
//         client: "Ayush Mavani",
//         invoiceDate: "2024-12-18T18:30:00.000Z",
//         invoiceNumber: "222211212121",
//         dueDate: "2024-12-27T18:30:00.000Z",
//       },
//       {
//         id: "2",
//         client: "Ayush Mavani",
//         invoiceDate: "2024-12-20T18:30:00.000Z",
//         invoiceNumber: "111111111111111",
//         dueDate: "2024-12-27T18:30:00.000Z",
//       },
//       {
//         id: "3",
//         client: "Ayush Mavani",
//         invoiceDate: "2024-12-22T18:30:00.000Z",
//         invoiceNumber: "9999999999",
//         dueDate: "2024-12-27T18:30:00.000Z",
//       },
//     ]);

//   render(
//     <BrowserRouter>
//       <Provider store={store}>
//         <InvoiceDashBoard />
//       </Provider>
//     </BrowserRouter>
//   );

//   const table = await screen.findByTestId("table");
//   const rows = within(table).getAllByTestId("table-row");
//   expect(rows).toHaveLength(3);

//   // Verify specific content in the rows
//   const firstRowCells = within(rows[0]).getAllByRole("cell");
//   expect(firstRowCells[0]).toHaveTextContent("Ayush Mavani");
//   expect(firstRowCells[1]).toHaveTextContent("2024-12-18");
//   expect(firstRowCells[2]).toHaveTextContent("222211212121");
//   expect(firstRowCells[3]).toHaveTextContent("2024-12-27");

//   const secondRowCells = within(rows[1]).getAllByRole("cell");
//   expect(secondRowCells[0]).toHaveTextContent("Ayush Mavani");
//   expect(secondRowCells[1]).toHaveTextContent("2024-12-20");
//   expect(secondRowCells[2]).toHaveTextContent("111111111111111");
//   expect(secondRowCells[3]).toHaveTextContent("2024-12-27");

//   const thirdRowCells = within(rows[2]).getAllByRole("cell");
//   expect(thirdRowCells[0]).toHaveTextContent("Ayush Mavani");
//   expect(thirdRowCells[1]).toHaveTextContent("2024-12-22");
//   expect(thirdRowCells[2]).toHaveTextContent("9999999999");
//   expect(thirdRowCells[3]).toHaveTextContent("2024-12-27");
// });

// test("renders correct number of rows ", async () => {
//   mockAxios
//     .onGet(
//       "http://localhost:5000/invoice/userId?user_id=02efaa66-4a66-466f-b92b-24ce7366edf0"
//     )
//     .reply(200, [
//       {
//         id: "bdc42bf3-677a-4bb2-b946-5bbf9f4cd105",
//         client: "Ayush Mavani",
//         invoiceDate: "2024-12-18T18:30:00.000Z",
//         invoiceNumber: "222211212121",
//         dueDate: "2024-12-27T18:30:00.000Z",
//       },
//       // {
//       //   id: "2",
//       //   client: "Client B",
//       //   invoiceDate: "2024-01-02",
//       //   invoiceNumber: "INV002",
//       //   dueDate: "2024-01-11",
//       // },
//     ]);
//   render(
//     <BrowserRouter
//       future={{
//         v7_relativeSplatPath: true,
//         v7_startTransition: true,
//       }}
//     >
//       <Provider store={store}>
//         <InvoiceDashBoard />
//       </Provider>
//     </BrowserRouter>
//   );

//   const rows = await waitFor(() => screen.getAllByRole("row"));
//   expect(rows).toHaveLength(1);
// });

// test("renders invoices in the table and handles interactions", async () => {
//   // Mock API response with MSW
//   server.use(
//     rest.get(
//       "http://localhost:5000/invoice/userId?user_id=02efaa66-4a66-466f-b92b-24ce7366edf0",
//       (req, res, ctx) => {
//         return res(
//           ctx.status(200),
//           ctx.json([
//             {
//               id: 1,
//               client: "Client A",
//               invoiceDate: "2023-12-01",
//               invoiceNumber: "INV-001",
//               dueDate: "2023-12-15",
//             },
//             {
//               id: 2,
//               client: "Client B",
//               invoiceDate: "2023-12-05",
//               invoiceNumber: "INV-002",
//               dueDate: "2023-12-20",
//             },
//           ])
//         );
//       }
//     )
//   );

//   render(
//     <CookiesProvider>
//       <BrowserRouter>
//         <Provider store={store}>
//           <InvoiceDashBoard />
//         </Provider>
//       </BrowserRouter>
//     </CookiesProvider>
//   );

//   const error = await screen.findByText("Error fetching invoice");
//   expect(error).toBeInTheDocument();
//   // // Verify the table renders the correct number of rows
//   // const rows = await waitFor(() => screen.getAllByTestId("table-row"));
//   // expect(rows).toHaveLength(2);

//   // // Verify specific content in the rows
//   // expect(screen.getByText("Client A")).toBeInTheDocument();
//   // expect(screen.getByText("2023-12-01")).toBeInTheDocument();
//   // expect(screen.getByText("INV-001")).toBeInTheDocument();
//   // expect(screen.getByText("2023-12-15")).toBeInTheDocument();

//   // expect(screen.getByText("Client B")).toBeInTheDocument();
//   // expect(screen.getByText("2023-12-05")).toBeInTheDocument();
//   // expect(screen.getByText("INV-002")).toBeInTheDocument();
//   // expect(screen.getByText("2023-12-20")).toBeInTheDocument();
// });

test("renders correct data of rows", async () => {
  const mockResponse = {
    data: [
      {
        id: "1",
        client: "Ayush Mavani",
        invoiceDate: "2024-12-18T18:30:00.000Z",
        invoiceNumber: "222211212121",
        dueDate: "2024-12-27T18:30:00.000Z",
      },
      {
        id: "2",
        client: "Ayush Mavani",
        invoiceDate: "2024-12-20T18:30:00.000Z",
        invoiceNumber: "111111111111111",
        dueDate: "2024-12-27T18:30:00.000Z",
      },
      {
        id: "3",
        client: "Ayush Mavani",
        invoiceDate: "2024-12-22T18:30:00.000Z",
        invoiceNumber: "9999999999",
        dueDate: "2024-12-27T18:30:00.000Z",
      },
    ],
  };
  mockAxios
    .onGet(
      "http://localhost:5000/invoice/userId?user_id=02efaa66-4a66-466f-b92b-24ce7366edf0"
    )
    .reply(200, [
      {
        id: "1",
        client: "Ayush Mavani",
        invoiceDate: "2024-12-18T18:30:00.000Z",
        invoiceNumber: "222211212121",
        dueDate: "2024-12-27T18:30:00.000Z",
      },
      {
        id: "2",
        client: "Ayush Mavani",
        invoiceDate: "2024-12-20T18:30:00.000Z",
        invoiceNumber: "111111111111111",
        dueDate: "2024-12-27T18:30:00.000Z",
      },
      {
        id: "3",
        client: "Ayush Mavani",
        invoiceDate: "2024-12-22T18:30:00.000Z",
        invoiceNumber: "9999999999",
        dueDate: "2024-12-27T18:30:00.000Z",
      },
    ]);

  render(
    <BrowserRouter
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true,
      }}
    >
      <Provider store={store}>
        <InvoiceDashBoard />
      </Provider>
    </BrowserRouter>
  );

  const table = screen.getAllByTestId("table");
  expect(table).toBeInTheDocument();
  const rows = screen.getAllByTestId("table-row");
  expect(rows).toHaveLength(3);

  // const rows = screen.getAllByTestId("table-row");

  // expect(rows).toHaveLength(3);
  console.log(rows);

  expect(rows[0]).toHaveTextContent("Ayush Mavani");
  const firstRowCells = within(rows[0]).getAllByRole("cell");
  expect(firstRowCells[0]).toHaveTextContent("Ayush Mavani");
  expect(firstRowCells[1]).toHaveTextContent("2024-12-18T18:30:00.000Z");
  expect(firstRowCells[2]).toHaveTextContent("222211212121");
  expect(firstRowCells[3]).toHaveTextContent("2024-12-27T18:30:00.000Z");
});
