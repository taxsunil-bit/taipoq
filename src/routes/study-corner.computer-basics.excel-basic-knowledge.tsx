import { createFileRoute } from "@tanstack/react-router";
import { ExcelBasicKnowledgePage } from "@/components/ExcelBasicKnowledgePage";

export const Route = createFileRoute("/study-corner/computer-basics/excel-basic-knowledge")({
  head: () => ({
    meta: [
      {
        title: "Excel / Spreadsheet Basic Knowledge — पुस्तकालय / Library",
      },
      {
        name: "description",
        content:
          "Workbook, Worksheet, Cell, Formula, Function, Sort, Filter, Chart, Print और PDF Export — सरकारी नौकरी और Office के लिए मूलभूत Excel ज्ञान।",
      },
    ],
  }),
  component: ExcelBasicKnowledgePage,
});
