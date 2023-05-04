import * as React from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Stack,
  IconButton,
  Tabs,
  Tab,
  Typography,
  ImageList,
  ImageListItem,
  Link,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import "./Admin.css";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const itemData = [
  {
    img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
    title: "Breakfast",
    selected: false,
  },
  {
    img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
    title: "Burger",
    selected: false,
  },
  {
    img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
    title: "Camera",
    selected: false,
  },
  {
    img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
    title: "Coffee",
    selected: false,
  },
  {
    img: "https://images.unsplash.com/photo-1533827432537-70133748f5c8",
    title: "Hats",
    selected: false,
  },
  {
    img: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62",
    title: "Honey",
    selected: false,
  },
  {
    img: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6",
    title: "Basketball",
    selected: false,
  },
  {
    img: "https://images.unsplash.com/photo-1518756131217-31eb79b20e8f",
    title: "Fern",
    selected: false,
  },
  {
    img: "https://images.unsplash.com/photo-1597645587822-e99fa5d45d25",
    title: "Mushrooms",
    selected: false,
  },
  {
    img: "https://images.unsplash.com/photo-1567306301408-9b74779a11af",
    title: "Tomato basil",
    selected: false,
  },
  {
    img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1",
    title: "Sea star",
    selected: false,
  },
  {
    img: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6",
    title: "Bike",
    selected: false,
  },
];

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function Admin() {
  const [flag, setFlag] = useState(false);
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const isImageSelected = function (imageItem) {
    return itemData.find((item) => item.img === imageItem?.img)?.selected ? "selected" : "";
  };

  const selectImage = function (imageItem) {
    const item = itemData.find((item) => item.img === imageItem?.img);

    if (item) {
      item.selected = !item.selected;
      setFlag(!flag);
    }
  };

  const cancelSelection = function () {
    itemData.forEach((item) => (item.selected = false));
    setFlag(!flag);
  };

  const showButtons = function () {
    return itemData.some((item) => item.selected);
  };

  const gallery = function (type) {
    return (
      <ImageList cols={2} rowHeight={164}>
        {itemData.map((item) => (
          <ImageListItem key={item.img} className={isImageSelected(item)} onClick={() => selectImage(item)}>
            <img
              src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
              srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
              alt={item.title}
              loading="lazy"
            />
          </ImageListItem>
        ))}
      </ImageList>
    );
  };

  return (
    <Box sx={{ width: "100%" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin Panel
          </Typography>
          <Button color="inherit">
            <Link to="/test"></Link>Zurück
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Neu" {...a11yProps(0)} />
          <Tab label="Veröffentlicht" {...a11yProps(1)} />
          <Tab label="Archiviert" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        {gallery("new")}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {gallery("new")}
      </TabPanel>
      <TabPanel value={value} index={2}>
        {gallery("new")}
      </TabPanel>
      {showButtons() && value === 0 && (
        <Stack direction="row" spacing={2} className="button-container">
          <Button color="success" variant="contained" size="large">
            Veröffentlichen
          </Button>
          <Button color="error" variant="contained" size="large">
            Archivieren
          </Button>
          <Button color="error" variant="contained" size="large" onClick={cancelSelection}>
            X
          </Button>
        </Stack>
      )}
      {showButtons() && value === 1 && (
        <Stack direction="row" spacing={2} className="button-container">
          <Button color="error" variant="contained" size="large">
            Archivieren
          </Button>
          <Button color="error" variant="contained" size="large" onClick={cancelSelection}>
            X
          </Button>
        </Stack>
      )}
      {showButtons() && value === 2 && (
        <Stack direction="row" spacing={2} className="button-container">
          <Button color="success" variant="contained" size="large">
            Veröffentlichen
          </Button>
          <Button color="error" variant="contained" size="large" onClick={cancelSelection}>
            X
          </Button>
        </Stack>
      )}
    </Box>
  );
}

export default Admin;
