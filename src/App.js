import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { Box, Button, Grid, Typography } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import "./App.css";

function App() {
  const sortByFieldStyle = {
    width: 200,
    height: 41,
    background: "#F0F2FF",
    border: "1px solid #E0EEFF",
    fontSize: 12,
  };
  Array.prototype.contains = function (v) {
    for (var i = 0; i < this.length; i++) {
      if (this[i] === v) return true;
    }
    return false;
  };

  Array.prototype.unique = function () {
    var arr = [];
    for (var i = 0; i < this.length; i++) {
      if (!arr.contains(this[i])) {
        arr.push(this[i]);
      }
    }
    return arr;
  };

  const [displayData, setDisplayData] = useState([]);
  const [uniqueYearArr, setUniqueYearArr] = useState([]);
  const [label, setLabel] = useState([]);
  const [value, setValue] = useState([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
    axios
      .get(
        "https://codejudge-question-artifacts.s3.ap-south-1.amazonaws.com/poplution-countries-yearwise.json"
      )
      .then(function (response) {
        console.log("response----", response.data);
        let data = response.data;
        let yearArr = response.data.map((o) => o.Year);

        var uniques = yearArr.unique();
        setUniqueYearArr(uniques);
        console.log("==========years ", uniques);

        setDisplayData(data);
      });
  }, []);

  const data = {
    labels: label,
    datasets: [
      {
        label: "Population",
        data: value,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: "y",
    // Elements options apply to all of the options unless overridden in a dataset
    // In this case, we are setting the border of each horizontal bar to be 2px wide
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
      title: {
        display: true,
        text: "Population Charts",
      },
    },
  };

  const handleChange = (e) => {
    console.log("eee", e.target.value);

    const selectedYear = e.target.value;
    const filteredData = displayData.filter((o) => o.Year == selectedYear);
    console.log("=========> filtered first data", filteredData[0]);
    const sortedArr = filteredData.sort((a, b) => {
      return b.Value - a.Value;
    });
    const labels = sortedArr.map((o) => o["Country Name"]);
    const values = sortedArr.map((o) => o.Value);
    setLabel(labels);
    setValue(values);
  };

  const searchHandle = (e) => {
    setSearch(e.target.value);
  };
  return (
    <div className="App">
      <Box mt={4}>
        <Grid
          container
          spacing={2}
          direction="column"
          alignItems="center"
          justify="center"
        >
          <Grid md={6}>
            <FormControl fullWidth variant="outlined">
              <Select
                native
                // value={SortBy}
                name="Select Year"
                style={sortByFieldStyle}
                onChange={(e) => handleChange(e)}
              >
                {uniqueYearArr.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {/* <Grid md={6}>
            <input label="Search Country" onChange={(e) => searchHandle(e)} />\
          </Grid> */}
        </Grid>
      </Box>
      <Box mt={4}>
        <Grid
          container
          spacing={2}
          direction="column"
          alignItems="center"
          justify="center"
        >
          <Grid md={12}>
            <div style={{ width: 1500 }}>
              <Bar data={data} options={options} />
            </div>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default App;
