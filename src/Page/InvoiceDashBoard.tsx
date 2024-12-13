import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Header from "../components/Header";
import { useCookies } from "react-cookie";
import { parseJwt } from "../utils/parseJWT";
import { jwtDecode } from "jwt-decode";
import { tr } from "date-fns/locale";

const RootContainer = styled.div({
  width: "100%",
  padding: "20px",
  backgroundColor: "#f5f5f5",
});

const ContentSection = styled.section({
  backgroundColor: "white",
  margin: "20px",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
});

const TableHeader = styled.div({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

const AddInvoiceButton = styled.button({
  backgroundColor: "#6c63ff",
  color: "white",
  border: "none",
  padding: "10px 15px",
  borderRadius: "5px",
  cursor: "pointer",
});

const ClientTable = styled.table({
  width: "100%",
  marginTop: "20px",
  borderCollapse: "collapse",
  th: {
    backgroundColor: "#4c6ef5",
    color: "white",
    padding: "10px",
    border: "1px solid #ddd",
    textAlign: "left",
  },
  td: {
    padding: "10px",
    border: "1px solid #ddd",
    textAlign: "left",
  },
  "tbody tr:nth-of-type(odd)": {
    backgroundColor: "#f9f9f9",
  },
});

const PaginationContainer = styled.div({
  display: "flex",
  justifyContent: "center",
  marginTop: "20px",
});

const PageButton = styled.button({
  margin: "0 5px",
  padding: "5px 10px",
  backgroundColor: "#6c63ff",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  "&:disabled": {
    backgroundColor: "#ccc",
    cursor: "not-allowed",
  },
});
interface Invoice {
  id: number;
  client: string;
  invoiceDate: string;
  invoiceNumber: string;
  dueDate: string;
}
const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cookies, , removeCookie] = useCookies(["token"]);

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [status, setStatus] = useState<string>("loading");
  const [currentPage, setCurrentPage] = useState(1);
  const invoicesPerPage = 5;

  useEffect(() => {
    const token = cookies.token;
    if (!token) return;

    let userId = "";

    try {
      const decodedToken: any = jwtDecode(token);
      userId = decodedToken.id;
      console.log("Decoded user ID:", userId);
    } catch (error) {
      console.error("Error decoding token:", error);
    }

    if (userId) {
      const fetchInvoices = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/invoice/userId?user_id=${userId}`
          );
          console.log("Fetched invoices:", response.data);
          setInvoices(response.data);
        } catch (error) {
          console.error("Error fetching invoices:", error);
        }
      };
      fetchInvoices();
    }
  }, [cookies.token]);

  const totalPages = Math.ceil(invoices.length / invoicesPerPage);
  const indexOfLastInvoice = currentPage * invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
  const currentInvoices = invoices.slice(
    indexOfFirstInvoice,
    indexOfLastInvoice
  );

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleViewInvoice = (invoice: any) => {
    navigate("/invoice", { state: { invoice } });
  };

  const handleEditInvoice = (invoiceId: any) => {
    navigate(`/editinvoice/${invoiceId}`);
  };

  const handleDeleteInvoice = (invoiceId: any) => {
    axios
      .delete(`http://localhost:5000/invoice/${invoiceId}`)
      .then(() => {
        setInvoices((prevInvoices) =>
          prevInvoices.filter((invoice: any) => invoice.id !== invoiceId)
        );
      })
      .catch((error) => {
        console.error("Error deleting invoice:", error);
      });
  };

  console.log("-----------------");
  console.log(invoices);

  return (
    <RootContainer>
      <Header />

      {/* <table data-testid="client-table">
        <thead>
          <tr>
            <th>Test</th>
          </tr>
        </thead>
      </table> */}
      <ContentSection>
        <TableHeader>
          <h2>Invoice List</h2>
          <AddInvoiceButton onClick={() => navigate("/addinvoice")}>
            Add Invoice
          </AddInvoiceButton>
        </TableHeader>

        <ClientTable data-testid="client-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Invoice Date</th>
              <th>Invoice Number</th>
              <th>Due Date</th>
              <th>Action</th>
            </tr>
          </thead>
        </ClientTable>
        <ClientTable data-testid="table">
          <tbody data-testid="table-body">
            {currentInvoices.map((invoice) => (
              <tr data-testid="table-row" key={invoice.id}>
                <td>{invoice.client}</td>
                <td>{invoice.invoiceDate}</td>
                <td>{invoice.invoiceNumber}</td>
                <td>{invoice.dueDate}</td>
                <td>
                  <button onClick={() => handleViewInvoice(invoice)}>
                    <VisibilityIcon />
                  </button>
                  <button onClick={() => handleEditInvoice(invoice.id)}>
                    <EditIcon />
                  </button>
                  <button onClick={() => handleDeleteInvoice(invoice.id)}>
                    <DeleteIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </ClientTable>
      </ContentSection>

      <PaginationContainer>
        {[...Array(totalPages)].map((_, index) => (
          <PageButton
            key={index}
            onClick={() => handlePageChange(index + 1)}
            disabled={currentPage === index + 1}
          >
            {index + 1}
          </PageButton>
        ))}
      </PaginationContainer>
    </RootContainer>
  );
};

export default Dashboard;

// import { render, screen, waitFor } from "@testing-library/react";
// import InvoiceDashBoard from "../Page/InvoiceDashBoard";
// import { BrowserRouter } from "react-router-dom";
// import { Provider } from "react-redux";
// import store from "../redux/apii/store";
// import axios from "axios";
// import MockAdapter from "axios-mock-adapter";

// // Mock Axios for API calls
// const mockAxios = new MockAdapter(axios);

// beforeEach(() => {
//   // Reset mock before each test
//   mockAxios.reset();
// });

// test("renders the table with correct headers", async () => {
//   // Mock data for the invoices
//   mockAxios.onGet("http://localhost:5000/invoice/userId?user_id=someUserId").reply(200, [
//     {
//       id: 1,
//       client: "Client A",
//       invoiceDate: "2023-01-01",
//       invoiceNumber: "INV001",
//       dueDate: "2023-02-01",
//     },
//     {
//       id: 2,
//       client: "Client B",
//       invoiceDate: "2023-01-02",
//       invoiceNumber: "INV002",
//       dueDate: "2023-02-02",
//     },
//   ]);

//   render(
//     <BrowserRouter>
//       <Provider store={store}>
//         <InvoiceDashBoard />
//       </Provider>
//     </BrowserRouter>
//   );

//   const table = await screen.findByTestId("client-table");
//   expect(table).toBeInTheDocument();

//   const headers = table.querySelectorAll("th");
//   expect(headers).toHaveLength(5);
//   expect(headers[0].textContent).toBe("Client");
//   expect(headers[1].textContent).toBe("Invoice Date");
//   expect(headers[2].textContent).toBe("Invoice Number");
//   expect(headers[3].textContent).toBe("Due Date");
//   expect(headers[4].textContent).toBe("Action");
// });

// test("renders correct number of rows with mock data", async () => {
//   // Mock data for the invoices
//   mockAxios.onGet("http://localhost:5000/invoice/userId?user_id=someUserId").reply(200, [
//     {
//       id: 1,
//       client: "Client A",
//       invoiceDate: "2023-01-01",
//       invoiceNumber: "INV001",
//       dueDate: "2023-02-01",
//     },
//     {
//       id: 2,
//       client: "Client B",
//       invoiceDate: "2023-01-02",
//       invoiceNumber: "INV002",
//       dueDate: "2023-02-02",
//     },
//   ]);

//   render(
//     <BrowserRouter>
//       <Provider store={store}>
//         <InvoiceDashBoard />
//       </Provider>
//     </BrowserRouter>
//   );

//   // Wait for the rows to appear in the table
//   const rows = await waitFor(() => screen.getAllByRole("row"));
//   expect(rows).toHaveLength(3); // 1 header row + 2 data rows
// });

// test("renders data correctly in table rows", async () => {
//   // Mock data for the invoices
//   mockAxios.onGet("http://localhost:5000/invoice/userId?user_id=someUserId").reply(200, [
//     {
//       id: 1,
//       client: "Client A",
//       invoiceDate: "2023-01-01",
//       invoiceNumber: "INV001",
//       dueDate: "2023-02-01",
//     },
//     {
//       id: 2,
//       client: "Client B",
//       invoiceDate: "2023-01-02",
//       invoiceNumber: "INV002",
//       dueDate: "2023-02-02",
//     },
//   ]);

//   render(
//     <BrowserRouter>
//       <Provider store={store}>
//         <InvoiceDashBoard />
//       </Provider>
//     </BrowserRouter>
//   );

//   // Wait for the table data cells to render
//   const rows = await waitFor(() => screen.getAllByRole("row"));
//   const firstRowCells = rows[1].querySelectorAll("td");
//   const secondRowCells = rows[2].querySelectorAll("td");

//   // Validate data for first row
//   expect(firstRowCells[0].textContent).toBe("Client A");
//   expect(firstRowCells[1].textContent).toBe("2023-01-01");
//   expect(firstRowCells[2].textContent).toBe("INV001");
//   expect(firstRowCells[3].textContent).toBe("2023-02-01");

//   // Validate data for second row
//   expect(secondRowCells[0].textContent).toBe("Client B");
//   expect(secondRowCells[1].textContent).toBe("2023-01-02");
//   expect(secondRowCells[2].textContent).toBe("INV002");
//   expect(secondRowCells[3].textContent).toBe("2023-02-02");
// });
