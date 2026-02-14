import { BrowserRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NavMenu } from "@shopify/app-bridge-react";
import Routes from "./Routes";
import { Provider } from "react-redux";
import { QueryProvider, PolarisProvider } from "./components";
import { store } from "./store/store";

export default function App() {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.glob("./pages/**/!(*.test.[jt]sx)*.([jt]sx)", {
    eager: true,
  });
  const { t } = useTranslation();

  return (
    <PolarisProvider>
      <BrowserRouter>
        <Provider store={store}>
          <QueryProvider>
            <NavMenu>
              <a href="/" rel="home" />
            </NavMenu>
            <Routes pages={pages} />
          </QueryProvider>
        </Provider>
      </BrowserRouter>
    </PolarisProvider>
  );
}
