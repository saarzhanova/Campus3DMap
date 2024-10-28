# 3D Campus Map Extraction and Visualisation

This repository contains the code and documentation for a 3D map extraction and visualisation project, focused on creating an interactive 3D model of a university campus using OpenStreetMap (OSM) data. The project explores various tools and methods for 3D map generation, including OSM2World and Three.js, and leverages OSMnx for advanced spatial analysis and automated feature extraction.

## Key Features
- **3D Map Extraction**: Utilized OSM2World to convert OSM data into `.obj` format for 3D rendering.
- **3D Visualisation**: Implemented Three.js to display the 3D model in a web browser, with clickable buildings to retrieve names from OSM data.
- **Automated Feature Extraction with OSMnx**: Explored OSMnx for retrieving geographic features, routing, and spatial data filtering.

## Challenges and Future Directions
- **Optimising Load Times**: Large `.obj` files impact load time; future work will focus on size reduction or performance optimisations.
- **Building Metadata**: Moving from hardcoded to dynamic building information via database or API integration.
- **Advanced Routing and Analysis**: Further exploration of OSMnx's network analysis tools for enhanced navigation insights.

You can view the live application here: [Campus3DMap](https://saarzhanova.github.io/Campus3DMap/) and explore the code on GitHub. Additional OSMnx experimentation is documented in [Google Colab](https://colab.research.google.com/drive/1EdwR0e3s716DyIXcITD4xKOT6XdMDHla?usp=sharing).
