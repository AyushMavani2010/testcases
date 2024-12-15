import { render, screen, within } from "@testing-library/react";
import InvoiceDashBoard from "../Page/InvoiceDashBoard";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../redux/apii/store";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { CookiesProvider } from 'react-cookie';

const mockAxios = new MockAdapter(axios);

jest.mock('react-cookie', () => ({
  ...jest.requireActual('react-cookie'),
  useCookies: () => [
    { token: 'mock-token' },
    jest.fn(),
    jest.fn()
  ]
}));

jest.mock('jwt-decode', () => ({
  jwtDecode: () => ({ id: 'mockUserId' })
}));

const mockInvoices = [
  {
    id: "1",
    client: "Ayush Mavani",
    invoiceDate: "2024-12-18T18:30:00.000Z",
    invoiceNumber: "222211212121",
    dueDate: "2024-12-27T18:30:00.000Z",
  },
  {
    id: "2",
    client: "John Doe",
    invoiceDate: "2024-12-20T18:30:00.000Z",
    invoiceNumber: "111111111111111",
    dueDate: "2024-12-27T18:30:00.000Z",
  }
];

const renderInvoiceDashboard = () => {
  render(
    <CookiesProvider>
      <BrowserRouter>
        <Provider store={store}>
          <InvoiceDashBoard />
        </Provider>
      </BrowserRouter>
    </CookiesProvider>
  );
};

describe('InvoiceDashboard', () => {
  beforeEach(() => {
    mockAxios.reset();
    mockAxios.onGet(/\/invoice\/userId/).reply(200, mockInvoices);
  });

  test("renders table headers correctly", async () => {
    renderInvoiceDashboard();
    const table = await screen.findByTestId("client-table");
    const headers = within(table).getAllByRole('columnheader');
    
    expect(headers).toHaveLength(5);
    expect(headers[0]).toHaveTextContent("Client");
    expect(headers[1]).toHaveTextContent("Invoice Date");
    expect(headers[2]).toHaveTextContent("Invoice Number");
    expect(headers[3]).toHaveTextContent("Due Date");
    expect(headers[4]).toHaveTextContent("Action");
  });

  test("renders invoice data correctly", async () => {
    renderInvoiceDashboard();
    await screen.findByText("Ayush Mavani"); // Wait for data to load
    
    const cells = screen.getAllByRole("cell");
    expect(cells[0]).toHaveTextContent("Ayush Mavani");
    expect(cells[1]).toHaveTextContent("2024-12-18");
    expect(cells[2]).toHaveTextContent("222211212121");
    expect(cells[3]).toHaveTextContent("2024-12-27");
  });

  test("renders action buttons for each row", async () => {
    renderInvoiceDashboard();
    await screen.findByText("Ayush Mavani"); // Wait for data to load
    
    const viewIcons = screen.getAllByTestId("VisibilityIcon");
    const editIcons = screen.getAllByTestId("EditIcon");
    const deleteIcons = screen.getAllByTestId("DeleteIcon");
    
    expect(viewIcons).toHaveLength(2);
    expect(editIcons).toHaveLength(2);
    expect(deleteIcons).toHaveLength(2);
  });
});
