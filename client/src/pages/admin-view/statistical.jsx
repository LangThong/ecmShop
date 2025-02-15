/* eslint-disable no-unused-vars */
import { Bar, Doughnut, Line, Pie, PolarArea } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from "chart.js";
import axios from "axios";
import { useEffect, useState } from "react";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
  ChartDataLabels
);

// ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);
const data = {
  labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6"],
  datasets: [
    {
      label: "Doanh thu (triệu VND)",
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: "rgba(75, 192, 192, 0.6)",
      borderColor: "rgba(75, 192, 192, 1)",
      borderWidth: 1,
    },
  ],
};

const dataLine = {
  labels: ["January", "February", "March", "April", "May"], // Tháng
  datasets: [
    {
      label: "Sales", // Nhãn cho đường biểu đồ
      data: [65, 59, 80, 81, 56], // Dữ liệu số liệu cho biểu đồ
      borderColor: "rgba(75,192,192,1)", // Màu đường
      backgroundColor: "rgba(75,192,192,0.2)", // Màu nền của điểm
      fill: true, // Tô màu dưới đường
      tension: 0.4, // Độ cong của đường
    },
  ],
};

const optionsLine = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: "Monthly Sales Data", // Tiêu đề biểu đồ
    },
    tooltip: {
      mode: "index", // Hiển thị tooltip khi hover trên các điểm dữ liệu
      intersect: false, // Tooltip không chỉ xuất hiện khi hover đúng trên điểm
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: "Month", // Tiêu đề trục X
      },
    },
    y: {
      title: {
        display: true,
        text: "Sales (in units)", // Tiêu đề trục Y
      },
      beginAtZero: true, // Bắt đầu trục Y từ 0
    },
  },
};
const dataTypeProduct = {
  labels: [],
  datasets: [
    {
      data: [],
      backgroundColor: [
        "rgba(75, 192, 192, 0.6)", // Tháng 1
        "rgba(255, 99, 132, 0.6)", // Tháng 2
        "rgba(54, 162, 235, 0.6)", // Tháng 3
        "rgba(255, 159, 64, 0.6)", // Tháng 4
        "rgba(153, 102, 255, 0.6)", // Tháng 5
        "rgba(255, 205, 86, 0.6)", // Tháng 6
      ],
      borderColor: [
        "rgba(75, 192, 192, 1)",
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 159, 64, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 205, 86, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: { position: "top" },
    title: { display: true, text: "Biểu đồ Doanh thu" },
  },
  scales: {
    y: { beginAtZero: true },
  },
};

const optionsPie = {
  responsive: true,
  plugins: {
    datalabels: {
      color: "#fff", // Màu chữ
      formatter: (value, context) => {
        // Tính phần trăm
        const total = context.chart.data.datasets[0].data.reduce(
          (acc, val) => acc + val,
          0
        );
        const percentage = ((value / total) * 100).toFixed(2) + "%";
        return percentage;
      },
      font: {
        size: 14,
        weight: "bold",
      },
    },
  },
};

function AdminStatistical() {
  const [chartData, setChartData] = useState();
  const [chartDataTypeProduct, setChartDataTypeProduct] = useState();
  const [chartDataBrandProduct, setChartDataBrandProduct] = useState();
  const [viewType, setViewType] = useState("year"); // "year" hoặc "month"
  const [year, setYear] = useState("2024");
  const currentMonth = new Date().getMonth() + 1;
  const [month, setMonth] = useState(currentMonth);
  const fetchRevenueData = async () => {
    try {
      let url = `http://localhost:5000/api/admin/orders/getRevenue?year=${year}`;
      if (viewType === "month") {
        url += `&month=${month}`;
      }

      const response = await axios.get(url);
      console.log(response);

      const revenueData =
        viewType === "year"
          ? response.data.monthlyRevenue
          : response.data.dailyRevenue;

      console.log(revenueData);

      // Kiểm tra nếu revenueData không phải là mảng hoặc trống
      if (!Array?.isArray(revenueData)) {
        console.error("Dữ liệu doanh thu không hợp lệ.");
        return;
      }

      // Thiết lập labels và data theo cấu trúc yêu cầu
      const labels =
        viewType === "year"
          ? [
              "Tháng 1",
              "Tháng 2",
              "Tháng 3",
              "Tháng 4",
              "Tháng 5",
              "Tháng 6",
              "Tháng 7",
              "Tháng 8",
              "Tháng 9",
              "Tháng 10",
              "Tháng 11",
              "Tháng 12",
            ]
          : await Array.from({ length: 31 }, (_, i) => `Ngày ${i + 1}`); // 31 ngày cho biểu đồ theo ngày

      const data = labels.map((label, index) => {
        const revenueEntry = revenueData.find(
          (item) => item._id === (viewType === "year" ? index + 1 : index + 1)
        );
        return revenueEntry ? revenueEntry.totalRevenue : 0; // Lấy giá trị doanh thu trực tiếp
      });

      console.log(data);

      setChartData({
        labels,
        datasets: [
          {
            label: "Doanh thu (VND)",
            data: data,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu biểu đồ:", error);
    }
  };

  const prepareChartData = async () => {
    try {
      let url = `http://localhost:5000/api/admin/orders/getBrandOfOrder?year=${year}`;
      if (viewType === "month") {
        url += `&month=${month}`;
      }

      const response = await axios.get(url);
      const revenueData = response.data; // Dữ liệu trả về từ API

      // Kiểm tra dữ liệu hợp lệ
      if (!Array.isArray(revenueData)) {
        console.error("Dữ liệu không hợp lệ từ API.");
        return;
      }

      // Lấy dữ liệu labels và values
      const labels = revenueData.map((item) => item.brand); // Brand là nhãn
      const data1 = revenueData.map((item) => item.totalQuantity); // Tổng số lượng theo từng brand

      // Cập nhật dữ liệu cho biểu đồ
      setChartDataBrandProduct({
        labels: labels,
        datasets: [
          {
            data: data1,
            backgroundColor: [
              "rgba(75, 192, 192, 0.6)",
              "rgba(255, 99, 132, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 159, 64, 0.6)",
              "rgba(153, 102, 255, 0.6)",
              "rgba(255, 205, 86, 0.6)",
            ],
            borderColor: [
              "rgba(75, 192, 192, 1)",
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 159, 64, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 205, 86, 1)",
            ],
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu từ API:", error);
    }
  };
  const prepareCategoryChartData = async () => {
    try {
      let url = `http://localhost:5000/api/admin/orders/getCategoryOfOrder?year=${year}`;
      if (viewType === "month") {
        url += `&month=${month}`;
      }

      const response = await axios.get(url);
      const revenueData = response.data; // Dữ liệu trả về từ API

      // Kiểm tra dữ liệu hợp lệ
      if (!Array.isArray(revenueData)) {
        console.error("Dữ liệu không hợp lệ từ API.");
        return;
      }

      // Lấy dữ liệu labels và values
      const labels = revenueData.map((item) => item.category); // Brand là nhãn
      const data1 = revenueData.map((item) => item.totalQuantity); // Tổng số lượng theo từng brand

      // Cập nhật dữ liệu cho biểu đồ
      setChartDataTypeProduct({
        labels: labels,
        datasets: [
          {
            data: data1,
            backgroundColor: [
              "rgba(75, 192, 192, 0.6)",
              "rgba(255, 99, 132, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 159, 64, 0.6)",
              "rgba(153, 102, 255, 0.6)",
              "rgba(255, 205, 86, 0.6)",
            ],
            borderColor: [
              "rgba(75, 192, 192, 1)",
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 159, 64, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 205, 86, 1)",
            ],
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu từ API:", error);
    }
  };

  useEffect(() => {
    fetchRevenueData();
    prepareChartData();
    prepareCategoryChartData();
  }, [viewType, year, month]);
  return (
    <div>
      {/* Dòng đầu tiên với 2 cột */}
      <div className="flex gap-4">
        {/* Cột 1: 2 Pie charts */}
        <div className="">
          <Doughnut
            data={chartDataBrandProduct || dataTypeProduct}
            options={optionsPie}
          />
          <Pie
            data={chartDataTypeProduct || dataTypeProduct}
            options={optionsPie}
          />
        </div>

        {/* Cột 2: 1 Line chart */}
        <div className="flex-1">
          <Line data={data} options={options} />
        </div>
      </div>

      {/* Dòng thứ hai chứa Bar chart */}

      <div className="relative w-full h-full">
        <div className="mt-4 absolute right-2 top-2">
          <select
            value={viewType}
            onChange={(e) => setViewType(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="year">Theo năm</option>
            <option value="month">Theo tháng</option>
          </select>
        </div>
        <Bar data={chartData || data} options={options} className="w-full" />
      </div>

      {/* Dropdown để chọn giữa "theo năm" và "theo tháng" */}
    </div>
  );
}

export default AdminStatistical;
