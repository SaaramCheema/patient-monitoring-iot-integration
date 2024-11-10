import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Grid, Box } from "@mui/material";
import axios from "axios";

const MonitoringDashboard = () => {
  const [monitoringData, setMonitoringData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMonitoringData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:3001/auth/monitoringData",
          {
            headers: { token },
          }
        );
        setMonitoringData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching monitoring data:", error);
        setLoading(false);
      }
    };

    fetchMonitoringData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!monitoringData) {
    return <div>No data available</div>;
  }

  return (
    <Box sx={{ padding: "2rem", backgroundColor: "#f5f5f5" }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "1rem",
          color: "#3f51b5",
        }}
      >
        Patient Monitoring Dashboard
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ boxShadow: 3, borderRadius: "12px" }}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ color: "#e53935", fontWeight: "bold" }}
              >
                Heart Rate
              </Typography>
              <Typography variant="h4" sx={{ color: "#333" }}>
                {monitoringData.heartRate} bpm
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ boxShadow: 3, borderRadius: "12px" }}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ color: "#1e88e5", fontWeight: "bold" }}
              >
                Blood Pressure
              </Typography>
              <Typography variant="h4" sx={{ color: "#333" }}>
                {monitoringData.bloodPressure.systolic}/
                {monitoringData.bloodPressure.diastolic} mmHg
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ boxShadow: 3, borderRadius: "12px" }}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ color: "#43a047", fontWeight: "bold" }}
              >
                Oxygen Saturation
              </Typography>
              <Typography variant="h4" sx={{ color: "#333" }}>
                {monitoringData.oxygenSaturation}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ boxShadow: 3, borderRadius: "12px" }}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ color: "#fb8c00", fontWeight: "bold" }}
              >
                Temperature
              </Typography>
              <Typography variant="h4" sx={{ color: "#333" }}>
                {monitoringData.temperature} °C
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ boxShadow: 3, borderRadius: "12px" }}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ color: "#8e24aa", fontWeight: "bold" }}
              >
                Alerts
              </Typography>
              {monitoringData.alerts.length > 0 ? (
                monitoringData.alerts.map((alert, index) => (
                  <Typography
                    key={index}
                    variant="body1"
                    sx={{ color: "#333" }}
                  >
                    {alert.message} -{" "}
                    {alert.acknowledged ? "Acknowledged" : "Unacknowledged"}
                  </Typography>
                ))
              ) : (
                <Typography variant="body1" sx={{ color: "#333" }}>
                  No alerts
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ boxShadow: 3, borderRadius: "12px" }}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ color: "#3949ab", fontWeight: "bold" }}
              >
                Notes
              </Typography>
              {monitoringData.notes.length > 0 ? (
                monitoringData.notes.map((note, index) => (
                  <Typography
                    key={index}
                    variant="body2"
                    sx={{ color: "#333" }}
                  >
                    {note.author}: {note.note}
                  </Typography>
                ))
              ) : (
                <Typography variant="body2" sx={{ color: "#333" }}>
                  No notes available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MonitoringDashboard;
