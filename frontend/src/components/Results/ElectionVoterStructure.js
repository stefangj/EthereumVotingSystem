import React from "react";
import { useState, useEffect } from "react";
import { PieChart, Pie, Legend, Cell, Tooltip } from "recharts";
import Web3 from "web3";
import { ElectionAbi, ElectionAddress } from "../../config";

const ElectionVoterStructure = () => {
  const [pieChartData, setPieChartData] = useState([
    { id: 1, name: "Youths(18-24)", count: 0 },
    { id: 2, name: "Adults(25-64)", count: 0 },
    { id: 3, name: "Seniors(65+)", count: 0 },
  ]);
  const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
  const election = new web3.eth.Contract(ElectionAbi, ElectionAddress);

  useEffect(() => {
    (async function () {
      const voterLength = await election.methods.getVoterCount().call();

      for (let i = 0; i <= voterLength - 1; i++) {
        const voterVoteStatus = await election.methods
          .getVoterVoteStatus(i)
          .call();
        if (voterVoteStatus === true) {
          const voterYear = await election.methods.getVoterAge(i).call();
          const voterAge = 2021 - parseInt(voterYear);
          if (voterAge < 18) {
            console.log("Not Permitted");
          } else if (voterAge > 17 && voterAge < 25) {
            setPieChartData((existingItems) => {
              return existingItems.map((item) => {
                return item.id === 1
                  ? { ...item, count: item.count + 1 }
                  : item;
              });
            });
          } else if (voterAge > 24 && voterAge < 65) {
            setPieChartData((existingItems) => {
              return existingItems.map((item) => {
                return item.id === 2
                  ? { ...item, count: item.count + 1 }
                  : item;
              });
            });
          } else if (voterAge >= 65) {
            setPieChartData((existingItems) => {
              return existingItems.map((item) => {
                return item.id === 3
                  ? { ...item, count: item.count + 1 }
                  : item;
              });
            });
          }
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const COLORS = ["#FF8042", "#C42031", "#2E1B7B"];

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
          cx="75%"
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

export default ElectionVoterStructure;
