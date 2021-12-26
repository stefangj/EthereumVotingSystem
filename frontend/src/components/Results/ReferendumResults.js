import React from "react";
import { useState, useEffect } from "react";
import { PieChart, Pie, Legend, Cell, Tooltip } from "recharts";
import Web3 from "web3";
import { ElectionAbi, ElectionAddress } from "../../config";

const ReferendumResults = () => {
  const [pieChartData, setPieChartData] = useState([
    { id: 1, name: "For", count: 0 },
    { id: 2, name: "Against", count: 0 },
  ]);
  const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
  const election = new web3.eth.Contract(ElectionAbi, ElectionAddress);
  useEffect(() => {
    (async function () {
      const proposalLength = await election.methods.proposalCount().call();

      for (let i = 0; i <= proposalLength - 1; i++) {
        const votesPos = await election.methods.getProposalPos(i).call();
        const votesNeg = await election.methods.getProposalNeg(i).call();
        setPieChartData((existingItems) => {
          return existingItems.map((item) => {
            return item.id === 1
              ? { ...item, count: parseInt(votesPos) }
              : item;
          });
        });
        setPieChartData((existingItems) => {
          return existingItems.map((item) => {
            return item.id === 2
              ? { ...item, count: parseInt(votesNeg) }
              : item;
          });
        });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const COLORS = ["#228B22", "#FF0000"];

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
          dataKey="count"
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

export default ReferendumResults;
