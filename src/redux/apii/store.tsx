import { configureStore } from "@reduxjs/toolkit";
import invoiceReducer from "./invoice/invoice";

const store = configureStore({
  reducer: {
    invoices: invoiceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;