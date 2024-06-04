// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/charts/BaseOptionChart';
// import { Worker } from '@react-pdf-viewer/core';

import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// ----------------------------------------------------------------------

export default function App() {
  return (
    <ThemeConfig>

        <ScrollToTop />
        <GlobalStyles />
        <BaseOptionChartStyle />
        <Router />

    </ThemeConfig>
  );
}
