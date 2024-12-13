import styled from "@emotion/styled";
import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";

const RootContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  width: 400px;
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

const AddCompany = () => {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    const { company, companyEmail, companyAddress, gstNumber } = data;

    const token = localStorage.getItem("token");
    let userId = "";

    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        console.log("Decoded Token:", decodedToken);
        userId = decodedToken.id;
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
    console.log(userId, "test test set set set ");

    const userData = {
      company,
      companyEmail,
      companyAddress,
      gstNumber,
      userId,
    };

    console.log("Submitting data:", userData);

    await axios
      .post("http://localhost:5000/addcompany", userData, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        console.log("Response:", response.data);
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error("Error response:", error.response?.data || error.message);
      });
  };

  return (
    <RootContainer>
      <FormContainer onSubmit={handleSubmit(onSubmit)}>
        <Title>Add Company</Title>

        <Controller
          name="company"
          control={control}
          defaultValue=""
          rules={{ required: "Company name is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              type="text"
              label="Company Name"
              error={!!errors.company}
              helperText={
                errors.company?.message
                  ? String(errors.company?.message)
                  : undefined
              }
              fullWidth
              margin="normal"
            />
          )}
        />

        <Controller
          name="companyEmail"
          control={control}
          defaultValue=""
          rules={{
            required: "Company email is required",
            pattern: {
              value: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
              message: "Invalid email format",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              type="email"
              label="Company Email"
              error={!!errors.companyEmail}
              helperText={
                errors.companyEmail?.message
                  ? String(errors.companyEmail?.message)
                  : undefined
              }
              fullWidth
              margin="normal"
            />
          )}
        />

        <Controller
          name="companyAddress"
          control={control}
          defaultValue=""
          rules={{ required: "Company address is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              type="text"
              label="Company Address"
              error={!!errors.companyAddress}
              helperText={
                errors.companyAddress?.message
                  ? String(errors.companyAddress?.message)
                  : undefined
              }
              fullWidth
              margin="normal"
            />
          )}
        />

        <Controller
          name="gstNumber"
          control={control}
          defaultValue=""
          rules={{ required: "GST number is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              type="text"
              label="GST Number"
              error={!!errors.gstNumber}
              helperText={
                errors.gstNumber?.message
                  ? String(errors.gstNumber?.message)
                  : undefined
              }
              fullWidth
              margin="normal"
            />
          )}
        />

        <SubmitButton type="submit">Submit</SubmitButton>
      </FormContainer>
    </RootContainer>
  );
};

export default AddCompany;
