import React from "react";
import { useState, useEffect } from "react";
// import NoData from "assets/No-Data.jpg";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Label,
  Tooltip,
} from "recharts";
import Loader from "components/Loader";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const completedCount = payload[0]?.payload?.completedCount || 0;
    const pendingCount = payload[0]?.payload?.pendingCount || 0;

    return (
      <div className="bg-gray-700 text-white text-xs p-3 rounded-md shadow-md">
        <p className="font-medium mb-1">{label}</p>
        <div className="flex flex-col gap-1">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-sm mr-2"></div>
            <span>Completed: {completedCount}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-orange-500 rounded-sm mr-2"></div>
            <span>Pending: {pendingCount}</span>
          </div>
          <div className="border-t border-gray-500 mt-1 pt-1">
            <span>Total: {completedCount + pendingCount}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

type ChartData = {
  year: string;
  month: string;
  completedDemos: number;
  pendingDemos: number;
};

interface RechartComponentProps {
  monthDemo: ChartData[];
  year: number;
  loading?: boolean;
}

const RechartComponent = ({
  monthDemo,
  year,
  loading,
}: RechartComponentProps) => {
  const [isDark, setIsDark] = useState<boolean>(
    localStorage.getItem("theme") === "dark"
  );
  console.log(monthDemo);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const currentTheme = localStorage.getItem("theme");
      setIsDark(currentTheme === "dark");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className=" rounded-lg  bg-[#FCFCFC] w-full h-full dark:bg-gray-600 dark:text-white">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <Loader />
        </div>
      ) : (
        monthDemo && (
          <ResponsiveContainer
            width="100%"
            height="100%"
            className=" dark:text-white"
          >
            <BarChart
              data={monthDemo}
              margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
            >
              <XAxis
                dataKey="month"
                tickLine={false}
                className="text-[12px]  font-medium p-2 m-2 gap-2"
                tick={{
                  fontSize: 12,
                  fontWeight: 500,
                  fill: isDark ? "#ffffff" : "#4b5563",
                }}
                height={20}
              >
                <Label
                  value={`Year ${year}`}
                  offset={-30}
                  position="insideBottom"
                  fontSize={14}
                  fontWeight={600}
                  className="text-[12px]  font-medium p-2 m-2 gap-2"
                  style={{
                    textAnchor: "middle",
                  }}
                  fill={isDark ? "#ffffff" : "#4b5563"}
                />
              </XAxis>
              <YAxis
                tick={{
                  fontSize: 12,
                  fontWeight: 500,
                  fill: isDark ? "#ffffff" : "#4b5563",
                }}
              >
                <Label
                  value="Sessions"
                  angle={-90}
                  position="insideLeft"
                  style={{ textAnchor: "middle" }}
                  className="text-[12px] leading-[11px] font-medium  dark:text-white"
                  fontSize={14}
                  fontWeight={600}
                  fill={isDark ? "#ffffff" : "#4b5563"}
                />
              </YAxis>
              <Tooltip content={<CustomTooltip />} />

              <Bar
                dataKey="completedCount"
                stackId="bar"
                fill="#48bb78"
                name="Completed"
                barSize={35}
                className="text-[12px]  font-medium p-2 mt-2 gap-2"
              />
              <Bar
                dataKey="pendingCount"
                stackId="bar"
                fill="#f97316"
                name="In progress"
                className="text-[10px] font-medium mt-2"
              />
            </BarChart>
          </ResponsiveContainer>
        )
      )}
    </div>
  );
};

export default RechartComponent;
