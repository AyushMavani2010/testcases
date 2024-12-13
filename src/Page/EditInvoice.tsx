import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import styled from "@emotion/styled";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Header from "../components/Header";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";



const RootContainer = styled.div({
  width: "100%",
  padding: "20px",
  backgroundColor: "#f5f5f5",
});
const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  width: 600px;
  margin: 50px auto;
  padding: 30px;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  font-family: Arial, sans-serif;
`;

const RowContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const SubmitButton = styled.button`
  padding: 10px;
  font-size: 18px;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const EditInvoice = () => {
  const { invoiceId } = useParams();
  const [invoiceDate, setInvoiceDate] = useState<any>();
  const [dueDate, setDueDate] = useState<any>();
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [cookies, , removeCookie] = useCookies(["token"]);
  const navigate = useNavigate();
  useEffect(() => {
    const token = cookies.token;
    let userId = "";

    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        userId = decodedToken.id;
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }

    if (userId) {
      axios
        .get(`http://localhost:5000/client/userId?user_id=${userId}`)
        .then((response) => {
          setClients(response.data); // Assuming response.data is an array of clients
        })
        .catch((error) => {
          console.error("Error fetching client data:", error);
        });
    }
  }, []);
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!invoiceNumber || !selectedClient || !invoiceDate || !dueDate) {
      alert("Please fill out all required fields.");
      return;
    }

    const updatedInvoice = {
      invoiceDate,
      dueDate,
      invoiceNumber,
      client: selectedClient,
      totalAmount,
      items,
    };

    axios
      .put(`http://localhost:5000/invoice/${invoiceId}`, updatedInvoice)
      .then(() => {
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error("Error updating invoice:", error);
      });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <RootContainer>
        <Header />
        <FormContainer onSubmit={handleSubmit}>
          <Title>Edit Invoice</Title>

          <RowContainer>
            <DatePicker
              label="Invoice Date"
              value={invoiceDate}
              onChange={(newValue) => setInvoiceDate(newValue)}
            />
            <DatePicker
              label="Due Date"
              value={dueDate}
              onChange={(newValue) => setDueDate(newValue)}
            />
          </RowContainer>

          <TextField
            label="Invoice Number"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            fullWidth
            margin="normal"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel id="client-select-label">Client</InputLabel>
            <Select
              labelId="client-select-label"
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              label="Client"
            >
              {clients.map((client: any) => (
                <MenuItem key={client.id} value={client.name}>
                  {client.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <h3>Items:</h3>
          <ul>
            {items.map((item, index) => (
              <li key={index}>
                {item.name} - {item.price}
              </li>
            ))}
          </ul>

          <SubmitButton type="submit">Save Changes</SubmitButton>
        </FormContainer>
      </RootContainer>
    </LocalizationProvider>
  );
};

export default EditInvoice;
