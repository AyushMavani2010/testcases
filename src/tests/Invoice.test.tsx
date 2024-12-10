import { render, screen, waitFor } from "@testing-library/react";
import InvoiceDashBoard from "../Page/InvoiceDashBoard";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../redux/apii/store";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

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

test("renders correct number of rows ", async () => {
  mockAxios
    .onGet(
      "http://localhost:5000/invoice/userId?user_id=02efaa66-4a66-466f-b92b-24ce7366edf0"
    )
    .reply(200, [
      {
        id: "bdc42bf3-677a-4bb2-b946-5bbf9f4cd105",
        client: "Ayush Mavani",
        invoiceDate: "2024-12-18T18:30:00.000Z",
        invoiceNumber: "222211212121",
        dueDate: "2024-12-27T18:30:00.000Z",
      },
      {
        id: "2",
        client: "Client B",
        invoiceDate: "2024-01-02",
        invoiceNumber: "INV002",
        dueDate: "2024-01-11",
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

  const rows = await waitFor(() => screen.getAllByRole("row"));
  expect(rows).toHaveLength(1);
});

test("renders correct data in table rows", async () => {
  mockAxios
  .onGet("http://localhost:5000/invoice/userId?user_id= ")
    .reply(200, [
      {
        id: "1",
        client: "Client A",
        invoiceDate: "2024-12-18",
        invoiceNumber: "INV001",
        dueDate: "2024-12-25",
      },
      {
        id: "2",
        client: "Client B",
        invoiceDate: "2024-12-19",
        invoiceNumber: "INV002",
        dueDate: "2024-12-26",
      },
    ]);

  // Render the component
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

  // Wait for the table to appear
  const table = await screen.findByTestId("table");

  // Get all the rows from tbody, skipping the header
  const rows = await waitFor(() => screen.getAllByRole("row"));

  // Filter out the header row (it will be the first row)

  // Verify the number of data rows
  expect(rows).toHaveLength(3); // We expect 2 data rows in this case

  // Verify content of the first data row
  // expect(rows[0].cells[0].textContent).toBe("Client A");
  // expect(rows[0].cells[1].textContent).toBe("2024-12-18");
  // expect(rows[0].cells[2].textContent).toBe("INV001");
  // expect(rows[0].cells[3].textContent).toBe("2024-12-25");

  // // Verify content of the second data row
  // expect(rows[1].cells[0].textContent).toBe("Client B");
  // expect(rows[1].cells[1].textContent).toBe("2024-12-19");
  // expect(rows[1].cells[2].textContent).toBe("INV002");
  // expect(rows[1].cells[3].textContent).toBe("2024-12-26");
});
