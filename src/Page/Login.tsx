import { ReactComponent as EmaiL } from "../../Asset/icon/email.svg";
import React, { FC, useState } from "react";
import Button from "../components/Button";
import styled from "@emotion/styled";
import Google from "../Asset/image/google 1.png";
import FaceBook from "../Asset/image/facebook 1.png";
import PassworD from "../components/icon/Password";
import Email from "../components/icon/Email";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios";

const RootContainer = styled.div({
  display: "flex",
  alignItems: "center",
  flex: 1,
  justifyContent: "center",
});

const RootChild = styled.div({
  padding: "20px",
  backgroundColor: "white",
  borderRadius: "10px",
  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
});

const StyledLink = styled.a({
  textDecoration: "none",
  color: "black",
});

const ChildDiv = styled.div({
  display: "flex",
  justifyContent: "center",
  margin: "20px",
});

const Heading = styled.p({
  display: "flex",
  justifyContent: "center",
  fontSize: "30px",
  fontWeight: 700,
  alignItems: "center",
  color: "black",
});

const LoginWithOther = styled.p({
  display: "flex",
  fontWeight: 700,
  justifyContent: "center",
  fontSize: "16px",
  alignItems: "center",
  color: "black",
});

const LoginWithGoogle = styled.p({
  display: "flex",
  fontWeight: 400,
  justifyContent: "center",
  fontSize: "12px",
  alignItems: "center",
  color: "black",
});

const ErrorText = styled.p({
  color: "red",
  fontSize: "12px",
  margin: "5px 0",
});

const InputContainer = styled.div<{ hasError?: boolean }>(({ hasError }) => ({
  borderRadius: "20px",
  height: "50px",
  fontSize: "16px",
  fontWeight: 400,
  display: "flex",
  backgroundColor: "rgba(240, 237, 255, 0.8)",
  gap: 10,
  alignItems: "center",
  justifyContent: "space-between",
  border: hasError ? "2px solid red" : "none", // Error styling
}));

interface IFormInput {
  email: string;
  password: string;
}

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Login = () => {
  const [cookies, setCookie] = useCookies(["token"]);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError: setFormError,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange", // Trigger validation on change
  });

  const onSubmit = async (data: IFormInput) => {
    try {
      const response = await axios.post("http://localhost:5000/login", data);
      setCookie("token", response.data.token);
      localStorage.setItem("userId", response.data.id);

      if (response.data.redirectTo) {
        navigate(response.data.redirectTo);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <RootContainer>
      <RootChild>
        <Heading>LogIn</Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ChildDiv>
            <InputContainer hasError={!!errors.email}>
              <div style={{ display: "flex", marginLeft: "20px" }}></div>
              <div>
                <input
                  placeholder="Email"
                  height={35}
                  type="email"
                  color="black"
                  {...register("email")}
                  style={{ width: 350 }}
                  data-testid="email"
                />
              </div>
            </InputContainer>
          </ChildDiv>
          {errors.email && <ErrorText>{errors.email.message}</ErrorText>}

          <ChildDiv>
            <InputContainer hasError={!!errors.password}>
              <div style={{ display: "flex", marginLeft: "20px" }}></div>
              <div>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  height={35}
                  color="black"
                  {...register("password")}
                  style={{ width: 305 }}
                />
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    background: "none",
                    border: "none",
                  }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </button>
              </div>
            </InputContainer>
          </ChildDiv>
          {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
          {error && <ErrorText>{error}</ErrorText>}
          <ChildDiv>
            <div>
              <Button
                type="submit"
                width="124px"
                height="52px"
                BgColor="rgba(145, 129, 244, 1)"
                borderRadius="20px"
                name="Login Now"
                color="white"
                border="none"
              />
            </div>
            <div style={{ paddingLeft: "15px" }}>
              <Button
                width="124px"
                height="52px"
                BgColor="rgba(145, 129, 244, 1)"
                borderRadius="20px"
                name="Register Now"
                color="white"
                border="none"
                onClick={() => {
                  navigate("/register");
                }}
              />
            </div>
          </ChildDiv>
        </form>
      </RootChild>
    </RootContainer>
  );
};

export default Login;
