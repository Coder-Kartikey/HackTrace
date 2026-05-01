import Select from "@/components/shared/Select";

const options = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" }
];

export default function DateRangePicker({
  defaultValue
}: {
  defaultValue?: string;
}) {
  return <Select name="range" defaultValue={defaultValue} options={options} />;
}
