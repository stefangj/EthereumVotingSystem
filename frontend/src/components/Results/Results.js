import React from "react";
import { useState, useEffect } from "react";
import { PieChart, Pie, Legend, Cell, Tooltip } from "recharts";
import Web3 from "web3";

import { ElectionAbi, ElectionAddress } from "../../config";

const Results = () => {
  const [pieChartData, setPieChartData] = useState([]);
  const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
  const election = new web3.eth.Contract(ElectionAbi, ElectionAddress);

  useEffect(() => {
    (async function () {
      const candidateLength = await election.methods.candidateCount().call();

      for (let i = 0; i <= candidateLength - 1; i++) {
        const candidateName = await election.methods.getCandidate(i).call();
        const candidateVotes = await election.methods.getVotes(i).call();
        setPieChartData((pieChartData) => [
          ...pieChartData,
          {
            candidateID: i,
            name: candidateName,
            candidateVotes: parseInt(candidateVotes),
          },
        ]);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#C42031",
    "#2E1B7B",
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(2)}%`}
      </text>
    );
  };

  return (
    <>
      <PieChart width={700} height={300}>
        <Pie
          data={pieChartData}
          dataKey="candidateVotes"
          nameKey="name"
          labelLine={false}
          cx="65%"
          cy="50%"
          fill="#82ca9d"
          label={renderCustomizedLabel}
        >
          {pieChartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend
          layout="vertical"
          verticalAlign="right"
          align="center"
          wrapperStyle={{ top: 105, left: 25 }}
        />
      </PieChart>
    </>
  );
};

export default Results;
